import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  CreateUserAiDto,
  CreateUserAiRawDto,
  UserAiDataDto,
  UserAiInfoDataConfig,
  UserAiInfoKeys,
} from './dto/create-user-ai.dto';
import { UpdateUserAiDto, UpdateUserAiRawDto } from './dto/update-user-ai.dto';
import { UserAiInfoService } from '../user-ai-info/user-ai-info.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from 'src/shared/modules/routes/core.service';
import { FindManyOptions, In, Repository } from 'typeorm';
import { UserAi } from './entities/user-ai.entity';
import { UserService } from 'src/modules/user/user/user.service';
import { CreateUserAiInfoBaseDto } from '../user-ai-info/dto/create-user-ai-info.dto';
import { MetaType } from 'src/shared/interfaces/objectMeta.interface';
import { parseByMetaType } from 'src/utils/string.utils';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { FindRequestDto } from 'src/shared/dto/find-request.dto';
import { ResourceBundleService } from 'src/modules/resource-bundle/resource-bundle/resource-bundle.service';
import {
  UserAiConfigKey,
  UserAiConfigType,
} from '../user-ai-config/dto/create-user-ai-config.dto';
import { UserAiConfig } from '../user-ai-config/entities/user-ai-config.entity';
import { UserAiConfigService } from '../user-ai-config/user-ai-config.service';
import { OnboardKeyEnum } from 'src/modules/user/user/dto/create-user.dto';
import { LangCodesEnum } from 'src/modules/resource-bundle/resource-bundle/entities/resource-bundle.entity';
import { UserActiveAiService } from '../user-active-ai/user-active-ai.service';

@Injectable()
export class UserAiService extends CoreService<UserAi> {
  constructor(
    @InjectRepository(UserAi)
    private readonly userAiRepository: Repository<UserAi>,
    private readonly userAiInfoService: UserAiInfoService,
    private readonly userAiConfigService: UserAiConfigService,
    private readonly userService: UserService,
    private readonly resourceBundleService: ResourceBundleService,

    @Inject(forwardRef(() => UserActiveAiService))
    private readonly userActiveAiService: UserActiveAiService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super(userAiRepository);
  }

  async create(createUserAiDto: CreateUserAiDto, req: AuthRequest) {
    const userId = this.preCheckAuth(req);

    // valid name
    const aiName =
      createUserAiDto.userAiInfo.find(
        (item) => item.key === UserAiConfigKey.name,
      )?.value ?? null;

    if (aiName) {
      await this.validUserAiName(aiName, userId);
    }

    const newUserAi = new UserAi();
    newUserAi.userId = userId;

    const user = await this.createCoreService([newUserAi], 'system');

    const existed = user[0];

    // create user info
    if (createUserAiDto.userAiInfo) {
      await this.userAiInfoService.createOrUpdateMultiple(
        createUserAiDto.userAiInfo,
        existed,
      );
    }

    return await this.findOne(existed.id, req);
  }

  async createByRaw(createUserAiRawDto: CreateUserAiRawDto, req: AuthRequest) {
    const userId = this.preCheckAuth(req);

    const user = await this.userService
      .getRepository()
      .findOneBy({ id: userId });

    if (user) {
      const createUserAiDto = new CreateUserAiDto();
      createUserAiDto.userId = userId;

      const allKeys = Object.keys(createUserAiRawDto)
        .filter((item) => item !== 'userId')
        .filter((item) =>
          UserAiInfoDataConfig.map((configItem) => configItem.key).includes(
            item as UserAiInfoKeys,
          ),
        );

      createUserAiDto.userAiInfo = allKeys.reduce((a, v) => {
        const config = UserAiInfoDataConfig.find((item) => item.key === v);

        const createUserInfoBaseDto = new CreateUserAiInfoBaseDto();
        createUserInfoBaseDto.key = v;
        createUserInfoBaseDto.type = config ? config.type : MetaType.string;
        createUserInfoBaseDto.value =
          typeof createUserAiRawDto[v] === 'string'
            ? createUserAiRawDto[v]
            : JSON.stringify(createUserAiRawDto[v]);

        return [...a, createUserInfoBaseDto];
      }, []);

      return await this.create(createUserAiDto, req);
    } else {
      throw new Error('User not found');
    }
  }

  async findAll(req: AuthRequest) {
    const { userId, userAiConfig } = await this.prepareData(req);

    const findRequestDto = new FindRequestDto(req);
    findRequestDto.filter['userId'] = {
      operator: 'in',
      value: [
        0, // system
        userId,
      ],
    };

    findRequestDto.sort = {
      userId: 'asc',
      ...findRequestDto.sort,
    };

    const data = await this.findAllCoreServiceByFindRequestDto(
      findRequestDto,
      this.createDefaultFindOption(),
    );

    const result = {
      ...data,
      meta: {
        ...data.meta,
        filter: {},
      },
      data: data.data.map((item) =>
        this.convertDataToResponse(item, userAiConfig),
      ),
    };

    return result;
  }

  async findOne(id: number, req: AuthRequest) {
    const { userId, userAiConfig } = await this.prepareData(req);

    const user = await this.userAiRepository.findOne({
      ...this.createDefaultFindOption(),
      where: {
        id: id,
        userId: In([
          0, // system
          userId,
        ]),
      },
    });

    return this.convertDataToResponse(user, userAiConfig);
  }

  async findSystemOne() {
    const { userAiConfig } = await this.prepareDataByUserId(0);

    const user = await this.userAiRepository.findOne({
      ...this.createDefaultFindOption(),
      where: {
        userId: 0,
      },
    });

    return this.convertDataToResponse(user, userAiConfig);
  }

  async update(
    id: number,
    updateUserAiRawDto: UpdateUserAiRawDto,
    req: AuthRequest,
  ) {
    const userId = this.preCheckAuth(req);

    const userAi = await this.userAiRepository.findOne({
      ...this.createDefaultFindOption(),
      where: {
        id: id,
        userId,
      },
    });

    if (userAi) {
      if (updateUserAiRawDto.userId) {
        delete updateUserAiRawDto.userId;
      }

      // valid name
      const aiName =
        userAi.userAiInfo.find((item) => item.key === UserAiConfigKey.name)
          ?.value ?? null;
      const newAiName = updateUserAiRawDto[UserAiConfigKey.name] ?? null;

      if (aiName && newAiName && aiName !== newAiName) {
        await this.validUserAiName(newAiName, userId);
      }

      //
      const updateUserAiDto = new UpdateUserAiDto();

      const allKeys = Object.keys(updateUserAiRawDto)
        .filter((item) => item !== 'userId')
        .filter((item) =>
          UserAiInfoDataConfig.map((configItem) => configItem.key).includes(
            item as UserAiInfoKeys,
          ),
        );

      updateUserAiDto.userAiInfo = allKeys.reduce((a, v) => {
        const config = UserAiInfoDataConfig.find((item) => item.key === v);

        const createUserAiInfoBaseDto = new CreateUserAiInfoBaseDto();
        createUserAiInfoBaseDto.key = v;
        createUserAiInfoBaseDto.type = config ? config.type : MetaType.string;
        createUserAiInfoBaseDto.value =
          typeof updateUserAiRawDto[v] === 'string'
            ? updateUserAiRawDto[v]
            : JSON.stringify(updateUserAiRawDto[v]);

        return [...a, createUserAiInfoBaseDto];
      }, []);

      await this.userAiInfoService.createOrUpdateMultiple(
        updateUserAiDto.userAiInfo,
        userAi,
      );

      return await this.findOne(userAi.id, req);
    } else {
      throw new BadRequestException('User AI not found');
    }
  }

  async remove(id: number, req: AuthRequest) {
    const userId = this.preCheckAuth(req);

    const removeEntity = await this.userAiRepository.findOneBy({
      id,
      userId,
    });

    if (removeEntity) {
      const userActiveAi = await this.userActiveAiService
        .getRepository()
        .findOneBy({ userAiId: id });

      if (userActiveAi) {
        throw new BadRequestException('User AI is using');
      } else {
        return await this.userAiRepository.remove(removeEntity);
      }
    } else {
      throw new BadRequestException('User AI not found');
    }
  }

  async translateUserAiInfoRaw(id: number, req: AuthRequest) {
    const { userAiConfig } = await this.prepareData(req);

    const data = await this.findOne(id, req);

    if (data) {
      return this.translateUserAiInfo(data, userAiConfig);
    } else {
      throw new BadRequestException('User AI not found');
    }
  }

  async validUserAiName(name: string, userId: number) {
    const existed = await this.userAiRepository.findOne({
      relations: {
        userAiInfo: true,
      },
      where: {
        userId: In([0, userId]),
        userAiInfo: {
          key: UserAiConfigKey.name,
          value: name,
        },
      },
    });

    if (existed) {
      throw new BadRequestException('User AI name existed');
    }

    return true;
  }

  async prepareData(req: AuthRequest) {
    const userId = this.preCheckAuth(req);

    return await this.prepareDataByUserId(userId);
  }

  async prepareDataByUserId(userId: number) {
    const resourceBundleData =
      await this.resourceBundleService.getObjectResourceBundle();

    const user = await this.userService.findOne(userId);

    const userAiConfig = await this.userAiConfigService.systemGetListConfig(
      user?.userInfo[OnboardKeyEnum.LANGUAGE_TO_LEARN] ?? LangCodesEnum.en,
    );

    // const user = mockUser;

    return {
      userId,
      user,
      userAiConfig,
      resourceBundleData,
    };
  }

  translateUserAiInfo(
    userAiDataDto: UserAiDataDto,
    userAiConfig: UserAiConfig[],
  ) {
    const data = UserAiInfoDataConfig.map(
      (configItem) => configItem.key,
    ).reduce((a, v) => {
      const config = userAiConfig.find((item) => item.key === v);

      if (Array.isArray(userAiDataDto.userAiInfo[v])) {
        a[v] = userAiDataDto.userAiInfo[v].map((item) => {
          const value = config.options.find((oi) => oi.value === item) ?? null;

          return value?.name || item;
        });
      } else {
        const value =
          config.options.find(
            (oi) => oi.value === userAiDataDto.userAiInfo[v],
          ) ?? null;

        a[v] =
          config.type === UserAiConfigType.imageSelect
            ? value?.url || ''
            : value?.name || userAiDataDto.userAiInfo[v];
      }

      return a;
    }, {});

    const response: UserAiDataDto = {
      ...userAiDataDto,
      targetInfo: data,
    };

    return response;
  }

  convertDataToResponse(
    data: UserAi,
    userAiConfig: UserAiConfig[],
  ): UserAiDataDto {
    if (!data) {
      return null;
    }

    const response: UserAiDataDto = {
      ...data,
      id: data.id,
      userId: data.userId,
      userAiInfo: data.userAiInfo.reduce((a, v) => {
        a[v.key] = parseByMetaType(v.value, v.type);

        return a;
      }, {}),
    };

    const result = this.translateUserAiInfo(response, userAiConfig);

    return result;
  }

  createDefaultFindOption(): FindManyOptions<UserAi> {
    return {
      relations: {
        userAiInfo: true,
      },
    };
  }
}
