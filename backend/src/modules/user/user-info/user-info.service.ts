import { Injectable } from '@nestjs/common';
import {
  CreateUserInfoBaseDto,
  CreateUserInfoDto,
} from './dto/create-user-info.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from '../../../shared/modules/routes/core.service';
import { Repository } from 'typeorm';
import { UserInfo } from './entities/user-info.entity';
import * as clerk from '@clerk/backend';
import { MetaType } from '../../../shared/interfaces/objectMeta.interface';
import { User } from '../user/entities/user.entity';
import { LangCodesEnum } from 'src/modules/resource-bundle/resource-bundle/entities/resource-bundle.entity';

@Injectable()
export class UserInfoService extends CoreService<UserInfo> {
  constructor(
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
  ) {
    super(userInfoRepository);
  }

  async createMultiple(createUserInfoDtos: CreateUserInfoDto[]) {
    return await this.createCoreService(createUserInfoDtos, 'system');
  }

  async create(createUserInfoDto: CreateUserInfoDto) {
    return await this.createMultiple([createUserInfoDto]);
  }

  async createOrUpdateMultiple(userInfos: CreateUserInfoBaseDto[], user: User) {
    const current = await this.findAllByUser(user.id, user.clerkId);

    const currentKeys = current.map((item) => item.key);

    const toAddUserInfos = userInfos
      .filter((item) => !currentKeys.includes(item.key))
      .reduce((a, v) => {
        const createUserInfoDto = new CreateUserInfoDto();
        createUserInfoDto.key = v.key;
        createUserInfoDto.type = v.type;
        createUserInfoDto.value = v.value;
        createUserInfoDto.user = user;

        return [...a, createUserInfoDto];
      }, []);

    const toUpdateUserInfos = userInfos.filter((item) =>
      currentKeys.includes(item.key),
    );

    // create
    await this.createMultiple(toAddUserInfos);

    // update
    await this.updateMultiple(user.id, user.clerkId, toUpdateUserInfos);

    return await this.findAllByUser(user.id, user.clerkId);
  }

  async updateMultiple(
    userId: number,
    userClerkId: string,
    updateUserInfoDtos: UpdateUserInfoDto[],
  ) {
    for (const updateUserInfoDto of updateUserInfoDtos) {
      await this.update(userId, userClerkId, updateUserInfoDto);
    }

    return await this.findAllByUser(userId, userClerkId);
  }

  async update(
    userId: number,
    userClerkId: string,
    updateUserInfoDto: UpdateUserInfoDto,
  ) {
    return await this.updateCoreService(
      {
        user: {
          id: userId,
          clerkId: userClerkId,
        },
        key: updateUserInfoDto.key,
      },
      updateUserInfoDto,
      userId,
    );
  }

  async findAllByUser(userId: number, userClerkId: string) {
    return await this.userInfoRepository.find({
      where: {
        user: {
          id: userId,
          clerkId: userClerkId,
        },
      },
    });
  }

  createDefaultClerkUserInfo(clerkUserData: clerk.User) {
    return [
      {
        key: 'email',
        value: clerkUserData.emailAddresses[0].emailAddress,
        type: MetaType.string,
      },
      {
        key: 'firstName',
        value: clerkUserData.firstName,
        type: MetaType.string,
      },
      {
        key: 'lastName',
        value: clerkUserData.lastName,
        type: MetaType.string,
      },
      {
        key: 'imageUrl',
        value: clerkUserData.imageUrl,
        type: MetaType.string,
      },
      //
      {
        key: 'nativeLanguage',
        value: LangCodesEnum.vi,
        type: MetaType.string,
      },
      {
        key: 'languageToLearn',
        value: LangCodesEnum.en,
        type: MetaType.string,
      },
    ];
  }
}
