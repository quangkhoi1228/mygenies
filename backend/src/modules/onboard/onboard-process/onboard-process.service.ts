import {
  BadRequestException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AppConfigService } from 'src/modules/app-config/app-config.service';
import { OnboardPhaseService } from '../onboard-phase/onboard-phase.service';
import {
  AppConfigName,
  OnboardProcessConfig,
  OnboardProcessConfigItem,
} from 'src/modules/app-config/dto/create-app-config.dto';
import { ResourceBundleService } from 'src/modules/resource-bundle/resource-bundle/resource-bundle.service';
import { In } from 'typeorm';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { UserService } from 'src/modules/user/user/user.service';
import {
  OnboardProcessProcessDto,
  OnboardProcessStatusDto,
} from './dto/onboard-process.dto';
import {
  OnboardKeyEnum,
  UserDataDto,
} from 'src/modules/user/user/dto/create-user.dto';
import { OnboardPhase } from '../onboard-phase/entities/onboard-phase.entity';
import { isNotEmpty } from 'src/utils/object.util';
import {
  OnboardContentTypeEnum,
  OnboardPhaseTemplateEnum,
} from '../onboard-phase/dto/create-onboard-phase.dto';
import { LangCodesEnum } from 'src/modules/resource-bundle/resource-bundle/entities/resource-bundle.entity';
import { AIService } from 'src/modules/ai/ai.service';
import { UserConversationTopic } from 'src/modules/chat/conversation/user-conversation/topic/user-conversation-topic/entities/user-conversation-topic.entity';
import { UserConversationTopicService } from 'src/modules/chat/conversation/user-conversation/topic/user-conversation-topic/user-conversation-topic.service';
import {
  CreateUserConversationTopicDto,
  UserConversationTopicType,
} from 'src/modules/chat/conversation/user-conversation/topic/user-conversation-topic/dto/create-user-conversation-topic.dto';

// const mockUser: UserDataDto = {
//   userInfo: {
//     onboardBegin: true,
//     nativeLanguage: 'vi',
//     languageToLearn: 'en',
//     languageLevel: 1,
//     learningHistory: ['hi'],
//     learningPurpose: ['hi'],
//     onboardInitEnd: true,
//     languageLearningFrequency: null,
//   },
//   id: 0,
//   clerkId: '',
// };

@Injectable()
export class OnboardProcessService {
  constructor(
    private readonly onboardPhaseService: OnboardPhaseService,
    private readonly appConfigService: AppConfigService,
    private readonly resourceBundleService: ResourceBundleService,
    private readonly userService: UserService,
    private readonly userConversationTopicService: UserConversationTopicService,

    @Inject(forwardRef(() => AIService))
    private readonly aiService: AIService,
  ) {}

  async setup(req: AuthRequest) {
    const userConversationTopicData =
      await this.aiService.generateLetsTalkGeneralTopic(req);

    const createDtos = userConversationTopicData.topics.map((item) => {
      const dto = new CreateUserConversationTopicDto();
      dto.name = item.name;
      dto.scenario = item.scenario;
      dto.systemRole = item.systemRole;
      dto.userRole = item.userRole;
      dto.userId = req.user.userId;
      dto.type = UserConversationTopicType.general;

      return dto;
    });

    const userConversationTopics: UserConversationTopic[] =
      await this.userConversationTopicService.createCoreService(
        createDtos,
        'system',
      );

    return this.userConversationTopicService.returnMessage({
      statusCode: HttpStatus.OK,
      message: 'Setup successfully',
      data: {
        userConversationTopics: userConversationTopics.length,
      },
    });
  }

  async getUserOnboardInfo(id: number): Promise<{
    [key in OnboardKeyEnum]: string;
  }> {
    const { user, resourceBundleData } = await this.prepareDataByUserId(id);

    if (user) {
      const phases = await this.onboardPhaseService.find({
        where: {
          code: In(Object.values(OnboardKeyEnum)),
        },
      });

      const result = Object.values(OnboardKeyEnum).reduce(
        (a, v) => {
          let onboardValue = user.userInfo[v];

          if (onboardValue) {
            const phase = phases.find((item) => item.code === v);
            if (phase) {
              if (
                phase.content.type ===
                OnboardContentTypeEnum.singleChoiceQuestion
              ) {
                const phaseValue = phase.content.options.find(
                  (item) => item.value === onboardValue,
                );

                if (phaseValue) {
                  onboardValue =
                    resourceBundleData[LangCodesEnum.en][phaseValue.text] ??
                    onboardValue;
                }
              } else if (
                phase.content.type ===
                OnboardContentTypeEnum.multipleChoiceQuestion
              ) {
                const phaseValues = phase.content.options.filter((item) =>
                  onboardValue.includes(item.value),
                );

                console.log(onboardValue, phaseValues);

                if (phaseValues.length > 0) {
                  onboardValue = phaseValues.map(
                    (item) => resourceBundleData[LangCodesEnum.en][item.text],
                  );
                }
              }
            }
          } else {
            onboardValue = '';
          }

          a[v] = onboardValue;

          return a;
        },
        Object.fromEntries(
          Object.values(OnboardKeyEnum).map((item) => [item, '']),
        ) as {
          [key in OnboardKeyEnum]: string;
        },
      );

      return result;
    } else {
      throw new BadRequestException('User not found');
    }
  }

  async getOnboardStatus(req: AuthRequest): Promise<OnboardProcessStatusDto> {
    const {
      user,
      onboardProcess,
      flatProcess,
      onboardStatus,
      resourceBundleData,
    } = await this.prepareData(req);

    let check = false;
    for (let i = 0; i < flatProcess.length; i++) {
      const step = flatProcess[i];

      const code = step.code;
      const status = isNotEmpty(user.userInfo[code]);

      onboardStatus.itemStatus.push({
        code,
        status: status,
        value: status ? user.userInfo[code] : undefined,
      });

      if (!status && !check) {
        onboardStatus.current =
          await this.getDetailStepOnboardProcessWithResourceBundle(
            code,
            resourceBundleData,
            req,
          );

        onboardStatus.next =
          i + 1 < flatProcess.length
            ? await this.getDetailStepOnboardProcessWithResourceBundle(
                flatProcess[i + 1].code,
                resourceBundleData,
                req,
              )
            : null;

        onboardStatus.previous =
          i > 0
            ? await this.getDetailStepOnboardProcessWithResourceBundle(
                flatProcess[i - 1].code,
                resourceBundleData,
                req,
              )
            : null;

        check = true;
      }
    }

    if (!check) {
      onboardStatus.done = true;
      onboardStatus.process = onboardProcess.map((item) => ({
        current: item.steps.filter((item) => item.type !== 'view').length,
        total: item.steps.filter((item) => item.type !== 'view').length,
      }));
    }

    // process by stage
    onboardStatus.process = this.getProcessIndex(onboardStatus, onboardProcess);

    return onboardStatus;
  }

  async getOnboardStatusByCode(
    code: string,
    req: AuthRequest,
  ): Promise<OnboardProcessStatusDto> {
    if (isNotEmpty(code)) {
      const {
        user,
        onboardProcess,
        flatProcess,
        onboardStatus,
        resourceBundleData,
      } = await this.prepareData(req);

      const allKey = flatProcess.map((item) => item.code);

      // index
      const previousIndex = allKey.findIndex((item) => item === code) - 1;
      const nextIndex = allKey.findIndex((item) => item === code) + 1;

      // step
      onboardStatus.previous =
        previousIndex >= 0 && previousIndex < allKey.length
          ? await this.getDetailStepOnboardProcessWithResourceBundle(
              allKey[previousIndex],
              resourceBundleData,
              req,
            )
          : null;
      onboardStatus.current =
        await this.getDetailStepOnboardProcessWithResourceBundle(
          code,
          resourceBundleData,
          req,
        );
      onboardStatus.next =
        nextIndex >= 0 && nextIndex < allKey.length
          ? await this.getDetailStepOnboardProcessWithResourceBundle(
              allKey[nextIndex],
              resourceBundleData,
              req,
            )
          : null;

      // item status
      onboardStatus.itemStatus = allKey.map((item) => {
        return {
          code: item,
          status: isNotEmpty(user.userInfo[item]),
          value: isNotEmpty(user.userInfo[item]) ? user.userInfo[item] : null,
        };
      });

      // process
      onboardStatus.process = this.getProcessIndex(
        onboardStatus,
        onboardProcess,
      );

      return onboardStatus;
    } else {
      return await this.getOnboardStatus(req);
    }
  }

  async getDetailStepOnboardProcess(
    code: string,
    req: AuthRequest,
  ): Promise<OnboardPhase> {
    const resourceBundleData =
      await this.resourceBundleService.getObjectResourceBundle();

    return await this.getDetailStepOnboardProcessWithResourceBundle(
      code,
      resourceBundleData,
      req,
    );
  }

  async getDetailStepOnboardProcessWithResourceBundle(
    code: string,
    resourceBundleData: { [key: string]: string } = {},
    req: AuthRequest,
  ): Promise<OnboardPhase> {
    const user = await this.userService.findOne(req.user.userId);
    // const user = mockUser;

    if (user) {
      const phase = await this.onboardPhaseService.getRepository().findOne({
        where: {
          code,
        },
      });

      if (phase) {
        return this.translateOnboardProcessStep(
          phase,
          user,
          resourceBundleData,
        );
      } else {
        return null;
      }
    } else {
      throw new BadRequestException('User not found');
    }
  }

  async prepareData(req: AuthRequest) {
    return await this.prepareDataByUserId(req.user.userId);
  }

  async prepareDataByUserId(id: number) {
    const onboardStatus: OnboardProcessStatusDto = {
      itemStatus: [],
      process: [],
      done: false,
      previous: undefined,
      current: undefined,
      next: undefined,
    };

    const resourceBundleData =
      await this.resourceBundleService.getObjectResourceBundle();

    const user = await this.userService.findOne(id);
    // const user = mockUser;

    if (user) {
      const onboardProcessConfig = await this.appConfigService.findOneByName(
        AppConfigName.ONBOARD_PHASE_PROCESS,
      );

      if (onboardProcessConfig) {
        const onboardProcess: OnboardProcessConfig[] = JSON.parse(
          onboardProcessConfig.value,
        );

        // full process
        const flatProcess: OnboardProcessConfigItem[] = onboardProcess.reduce(
          (a, v) => a.concat(v.steps),
          [],
        );

        return {
          user,
          onboardProcess,
          flatProcess,
          onboardStatus,
          resourceBundleData,
        };
      } else {
        throw new BadRequestException('Onboard config not found');
      }
    } else {
      throw new BadRequestException('User not found');
    }
  }

  getProcessIndex(
    status: OnboardProcessStatusDto,
    onboardProcess: OnboardProcessConfig[],
  ) {
    const result: OnboardProcessProcessDto[] = [];

    let check = false;
    for (const stage of onboardProcess) {
      const steps = stage.steps.filter((item) => item.type !== 'view');

      const tmp: OnboardProcessProcessDto = {
        current: check ? 0 : steps.length,
        total: steps.length,
      };

      if (status.done) {
        tmp.current = steps.length;
      } else {
        for (let si = 0; si < steps.length; si++) {
          if (status.current.code === steps[si].code) {
            tmp.current = si + 1;

            check = true;
          }

          if (!check && si === steps.length - 1) {
            tmp.current = steps.length;
          }
        }
      }

      result.push(tmp);
    }

    return result;
  }

  translateOnboardProcessStep(
    step: OnboardPhase,
    user: UserDataDto,
    resourceBundleData: { [key: string]: string },
  ) {
    // default
    const nativeLanguage = isNotEmpty(user.userInfo.nativeLanguage)
      ? user.userInfo.nativeLanguage
      : 'vi';
    const languageToLearn = isNotEmpty(user.userInfo.languageToLearn)
      ? user.userInfo.languageToLearn
      : 'en';
    const languageLevel = isNotEmpty(user.userInfo.languageLevel)
      ? user.userInfo.languageLevel
      : 0;

    const title =
      resourceBundleData[languageToLearn]?.[step.title] ?? step.title;
    const translateTitle =
      languageLevel < 2
        ? (resourceBundleData[nativeLanguage]?.[step.title] ?? step.title)
        : null;

    const description =
      resourceBundleData[languageToLearn]?.[step.description] ??
      step.description;
    const translateDescription =
      languageLevel < 2
        ? (resourceBundleData[nativeLanguage]?.[step.description] ??
          step.description)
        : null;

    const translatedStep = {
      ...step,
      title:
        step.template === OnboardPhaseTemplateEnum.question
          ? `${title} ${translateTitle ? `(${translateTitle})` : ''}`
          : title,
      translateTitle,
      description:
        step.template === OnboardPhaseTemplateEnum.question
          ? `${description} ${translateDescription ? `(${translateDescription})` : ''}`
          : description,
      translateDescription,
      content: {
        ...step.content,
        options: step.content.options.map((option) => {
          const text =
            resourceBundleData[languageToLearn]?.[option.text] ?? option.text;

          if (languageLevel < 2) {
            const translateText =
              resourceBundleData[nativeLanguage]?.[option.text] ?? option.text;

            option['translateText'] = translateText;
          }

          option.text = text;

          return option;
        }),
      },
    };

    return translatedStep;
  }
}
