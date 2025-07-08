import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserRawDto,
  UserDataDto,
  UserInfoDataConfig,
  UserInfoKeys,
} from './dto/create-user.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from '../../../shared/modules/routes/core.service';
import { FindManyOptions, Repository } from 'typeorm';
import { UserInfoService } from '../user-info/user-info.service';
import { parseByMetaType } from '../../../utils/string.utils';
import { ClerkService } from '../../third-party/clerk/clerk.service';
import { AuthRequest } from '../../auth/interface/auth-request.interface';
import { CreateUserInfoBaseDto } from '../user-info/dto/create-user-info.dto';
import { MetaType } from '../../../shared/interfaces/objectMeta.interface';
import { UpdateUserDto, UpdateUserRawDto } from './dto/update-user.dto';
import { AppConfigService } from 'src/modules/app-config/app-config.service';
import { AppConfigName } from 'src/modules/app-config/dto/create-app-config.dto';

@Injectable()
export class UserService extends CoreService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userInfoService: UserInfoService,
    private readonly clerkService: ClerkService,
    private readonly appConfigService: AppConfigService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super(userRepository);
  }

  async createByToken(req: AuthRequest) {
    return await this.createByClerkId(req.user.clerkUserId);
  }

  async createByClerkId(clerkId: string) {
    const clerkUser = await this.clerkService.getUserById(clerkId);

    if (clerkUser) {
      return await this.create({
        clerkId,
        userInfo: this.userInfoService.createDefaultClerkUserInfo(clerkUser),
      });
    } else {
      throw new BadRequestException('Clerk user not found');
    }
  }

  async create(createUserDto: CreateUserDto) {
    let existed = await this.userRepository.findOne({
      ...this.createDefaultFindOption(),
      where: {
        clerkId: createUserDto.clerkId,
      },
    });

    if (existed) {
    } else {
      const newUser = new User();
      newUser.clerkId = createUserDto.clerkId;

      const user = await this.createCoreService([newUser], 'system');

      existed = user[0];
    }

    // create user info
    if (createUserDto.userInfo) {
      await this.userInfoService.createOrUpdateMultiple(
        createUserDto.userInfo,
        existed,
      );
    }

    return await this.findOne(existed.id);
  }

  async createByRaw(createUserRawDto: CreateUserRawDto) {
    const createUserDto = new CreateUserDto();
    createUserDto.clerkId = createUserRawDto.clerkId;

    const allKeys = Object.keys(createUserRawDto)
      .filter((item) => item !== 'clerkId')
      .filter((item) =>
        UserInfoDataConfig.map((configItem) => configItem.key).includes(
          item as UserInfoKeys,
        ),
      );

    createUserDto.userInfo = allKeys.reduce((a, v) => {
      const config = UserInfoDataConfig.find((item) => item.key === v);

      const createUserInfoBaseDto = new CreateUserInfoBaseDto();
      createUserInfoBaseDto.key = v;
      createUserInfoBaseDto.type = config ? config.type : MetaType.string;
      createUserInfoBaseDto.value =
        typeof createUserRawDto[v] === 'string'
          ? createUserRawDto[v]
          : JSON.stringify(createUserRawDto[v]);

      return [...a, createUserInfoBaseDto];
    }, []);

    return await this.create(createUserDto);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      ...this.createDefaultFindOption(),
      where: {
        id: id,
      },
    });

    return this.convertDataToResponse(user);
  }

  async findOneByClerkId(id: string) {
    const user = await this.userRepository.findOne({
      ...this.createDefaultFindOption(),
      where: {
        clerkId: id,
      },
    });

    return this.convertDataToResponse(user);
  }

  async currentUser(req: AuthRequest) {
    const user = await this.userRepository.findOne({
      ...this.createDefaultFindOption(),
      where: {
        clerkId: req.user.clerkUserId,
      },
    });

    return this.convertDataToResponse(user);
  }

  async updateUser(updateUserRawDto: UpdateUserRawDto, req: AuthRequest) {
    const user = await this.userRepository.findOne({
      ...this.createDefaultFindOption(),
      where: {
        clerkId: req.user.clerkUserId,
      },
    });

    if (user) {
      if (updateUserRawDto.clerkId) {
        delete updateUserRawDto.clerkId;
      }

      //
      const updateUserDto = new UpdateUserDto();

      const allKeys = Object.keys(updateUserRawDto)
        .filter((item) => item !== 'clerkId')
        .filter((item) =>
          UserInfoDataConfig.map((configItem) => configItem.key).includes(
            item as UserInfoKeys,
          ),
        );

      updateUserDto.userInfo = allKeys.reduce((a, v) => {
        const config = UserInfoDataConfig.find((item) => item.key === v);

        const createUserInfoBaseDto = new CreateUserInfoBaseDto();
        createUserInfoBaseDto.key = v;
        createUserInfoBaseDto.type = config ? config.type : MetaType.string;
        createUserInfoBaseDto.value =
          typeof updateUserRawDto[v] === 'string'
            ? updateUserRawDto[v]
            : JSON.stringify(updateUserRawDto[v]);

        return [...a, createUserInfoBaseDto];
      }, []);

      await this.userInfoService.createOrUpdateMultiple(
        updateUserDto.userInfo,
        user,
      );

      return await this.findOne(user.id);
    } else {
      throw new BadRequestException('User not found');
    }
  }

  convertDataToResponse(data: User): UserDataDto {
    if (!data) {
      return null;
    }

    const response: UserDataDto = {
      ...data,
      id: data.id,
      clerkId: data.clerkId,
      userInfo: data.userInfo.reduce((a, v) => {
        a[v.key] = parseByMetaType(v.value, v.type);

        return a;
      }, {}),
    };

    return response;
  }

  createDefaultFindOption(): FindManyOptions<User> {
    return {
      relations: {
        userInfo: true,
      },
    };
  }

  async checkUserIsWhitelist(req: AuthRequest) {
    const whitelistUser = await this.appConfigService.findOneByName(
      AppConfigName.WHITELIST_USER,
    );

    if (!whitelistUser) {
      return false;
    }

    const userInfo = await this.userInfoService.findAllByUser(
      req.user.userId,
      req.user.clerkUserId,
    );

    const userInfoEmail = userInfo.find((item) => item.key === 'email');

    if (userInfoEmail) {
      const whitelistUserList = JSON.parse(whitelistUser.value);

      return whitelistUserList.includes(userInfoEmail.value);
    } else {
      return false;
    }

    // if (whitelistUser) {
    //   const whitelistUserList = JSON.parse(whitelistUser.value);

    //   return whitelistUserList.includes(req.user.email);
    // } else {
    //   return false;
    // }
  }
}
