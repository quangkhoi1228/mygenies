import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateUserAiConfigDto,
  UserAiConfigKey,
} from './dto/create-user-ai-config.dto';
import { UpdateUserAiConfigDto } from './dto/update-user-ai-config.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from 'src/shared/modules/routes/core.service';
import { FindManyOptions, In, Repository } from 'typeorm';
import { UserAiConfig } from './entities/user-ai-config.entity';
import { UserAiConfigOptionService } from '../user-ai-config-option/user-ai-config-option.service';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { FindRequestDto } from 'src/shared/dto/find-request.dto';
import { CreateUserAiConfigOptionDto } from '../user-ai-config-option/dto/create-user-ai-config-option.dto';
import { AppConfigService } from 'src/modules/app-config/app-config.service';
import { AppConfigName } from 'src/modules/app-config/dto/create-app-config.dto';
import { ResourceBundleService } from 'src/modules/resource-bundle/resource-bundle/resource-bundle.service';
import { LangCodesEnum } from 'src/modules/resource-bundle/resource-bundle/entities/resource-bundle.entity';
import { UserService } from 'src/modules/user/user/user.service';
import { OnboardKeyEnum } from 'src/modules/user/user/dto/create-user.dto';

@Injectable()
export class UserAiConfigService extends CoreService<UserAiConfig> {
  constructor(
    @InjectRepository(UserAiConfig)
    private readonly userAiConfigRepository: Repository<UserAiConfig>,

    private readonly userAiConfigOptionService: UserAiConfigOptionService,
    private readonly userService: UserService,
    private readonly appConfigService: AppConfigService,
    private readonly resourceBundleService: ResourceBundleService,
  ) {
    super(userAiConfigRepository);
  }

  async create(createUserAiConfigDto: CreateUserAiConfigDto) {
    let existed = await this.userAiConfigRepository.findOne({
      ...this.createDefaultFindOption(),
      where: {
        key: createUserAiConfigDto.key,
      },
    });

    if (existed) {
    } else {
      const newUserAiConfig = new UserAiConfig();
      newUserAiConfig.key = createUserAiConfigDto.key;
      newUserAiConfig.name = createUserAiConfigDto.name;
      newUserAiConfig.type = createUserAiConfigDto.type;
      newUserAiConfig.maxSelection = createUserAiConfigDto.maxSelection;

      const userAiConfig = await this.createCoreService(
        [newUserAiConfig],
        'system',
      );

      existed = userAiConfig[0];
    }

    // create options
    if (createUserAiConfigDto.options) {
      await this.userAiConfigOptionService.createMultiple(
        createUserAiConfigDto.options.map((item) => {
          const createUserAiConfigOptionDto = new CreateUserAiConfigOptionDto();

          createUserAiConfigOptionDto.name = item.name;
          createUserAiConfigOptionDto.value = item.value;
          createUserAiConfigOptionDto.url = item.url;
          createUserAiConfigOptionDto.config = existed;

          return createUserAiConfigOptionDto;
        }),
      );
    }

    return await this.findOne(existed.id);
  }

  async findAll(req: AuthRequest) {
    const findRequestDto = new FindRequestDto(req);

    const data = await this.findAllCoreServiceByFindRequestDto(
      findRequestDto,
      this.createDefaultFindOption(),
    );

    return data;
  }

  async findOne(id: number) {
    const userAiConfig = await this.userAiConfigRepository.findOne({
      ...this.createDefaultFindOption(),
      where: {
        id: id,
      },
    });

    return userAiConfig;
  }

  async findOneByKey(key: UserAiConfigKey) {
    const userAiConfig = await this.userAiConfigRepository.findOne({
      ...this.createDefaultFindOption(),
      where: {
        key: key,
      },
    });

    return userAiConfig;
  }

  async update(id: number, updateUserAiConfigDto: UpdateUserAiConfigDto) {
    const userAiConfig = await this.userAiConfigRepository.findOne({
      ...this.createDefaultFindOption(),
      where: {
        id: id,
      },
    });

    if (userAiConfig) {
      const updateDto = new UpdateUserAiConfigDto();
      updateDto.name = updateUserAiConfigDto.name;
      updateDto.key = updateUserAiConfigDto.key;
      updateDto.type = updateUserAiConfigDto.type;
      updateDto.maxSelection = updateUserAiConfigDto.maxSelection;

      await this.updateCoreService({ id }, updateDto, 'system');

      if (updateDto.options) {
      }

      return await this.findOne(userAiConfig.id);
    } else {
      throw new BadRequestException('User AI config not found');
    }
  }

  async remove(id: number) {
    const removeEntity = await this.userAiConfigRepository.findOneBy({
      id,
    });

    if (removeEntity) {
      return await this.userAiConfigRepository.remove(removeEntity);
    } else {
      throw new BadRequestException('User AI config not found');
    }
  }

  async systemGetListConfig(langCode: LangCodesEnum = LangCodesEnum.en) {
    const userAIProcessConfig = await this.appConfigService.findOneByName(
      AppConfigName.USER_AI_CONFIG_PROCESS,
    );

    if (userAIProcessConfig) {
      const listKey: string[] = JSON.parse(userAIProcessConfig.value);

      const resourceBundleData =
        await this.resourceBundleService.getObjectResourceBundle();

      const data = await this.userAiConfigRepository.find({
        ...this.createDefaultFindOption(),
        where: {
          key: In(listKey),
        },
      });

      const translateData = this.translateListUserAiInfo(
        data,
        resourceBundleData,
        langCode,
      );

      const ordered = listKey.map((key) =>
        translateData.find((item) => item.key === key),
      );

      return ordered;
    } else {
      throw new BadRequestException('User AI process config not found');
    }
  }

  async getListConfig(
    req: AuthRequest,
    langCode: LangCodesEnum = LangCodesEnum.en,
  ) {
    const user = await this.userService.findOne(req.user.userId);

    return await this.systemGetListConfig(
      user.userInfo[OnboardKeyEnum.LANGUAGE_TO_LEARN] ?? langCode,
    );
  }

  translateListUserAiInfo(
    userAiConfigs: UserAiConfig[],
    resourceBundleData: { [key: string]: string },
    langCode: LangCodesEnum = LangCodesEnum.en,
  ) {
    const response = userAiConfigs.map((item) => {
      return this.translateUserAiInfo(item, resourceBundleData, langCode);
    });

    return response;
  }

  translateUserAiInfo(
    userAiConfig: UserAiConfig,
    resourceBundleData: { [key: string]: string },
    langCode: LangCodesEnum = LangCodesEnum.en,
  ) {
    const response: UserAiConfig = {
      ...userAiConfig,
      name:
        resourceBundleData[langCode][userAiConfig.name] || userAiConfig.name,
      options: userAiConfig.options.map((item) => {
        return {
          ...item,
          name: resourceBundleData[langCode][item.name] || item.name,
          value: resourceBundleData[langCode][item.value] || item.value,
          url: resourceBundleData[langCode][item.url] || item.url,
        };
      }),
    };

    return response;
  }

  createDefaultFindOption(): FindManyOptions<UserAiConfig> {
    return {
      relations: {
        options: true,
      },
    };
  }
}
