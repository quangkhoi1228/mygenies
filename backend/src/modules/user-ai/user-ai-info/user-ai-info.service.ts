import { Injectable } from '@nestjs/common';
import {
  CreateUserAiInfoBaseDto,
  CreateUserAiInfoDto,
} from './dto/create-user-ai-info.dto';
import { UpdateUserAiInfoDto } from './dto/update-user-ai-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from 'src/shared/modules/routes/core.service';
import { Repository } from 'typeorm';
import { UserAiInfo } from './entities/user-ai-info.entity';
import { UserAi } from '../user-ai/entities/user-ai.entity';

@Injectable()
export class UserAiInfoService extends CoreService<UserAiInfo> {
  constructor(
    @InjectRepository(UserAiInfo)
    private readonly userAiInfoRepository: Repository<UserAiInfo>,
  ) {
    super(userAiInfoRepository);
  }

  async createMultiple(createUserAiInfoDtos: CreateUserAiInfoDto[]) {
    return await this.createCoreService(createUserAiInfoDtos, 'system');
  }

  async create(createUserAiInfoDto: CreateUserAiInfoDto) {
    return await this.createMultiple([createUserAiInfoDto]);
  }

  async createOrUpdateMultiple(
    UserAiInfos: CreateUserAiInfoBaseDto[],
    userAi: UserAi,
  ) {
    const current = await this.findAllByUserAi(userAi.id, userAi.userId);

    const currentKeys = current.map((item) => item.key);

    const toAddUserAiInfos = UserAiInfos.filter(
      (item) => !currentKeys.includes(item.key),
    ).reduce((a, v) => {
      const createUserAiInfoDto = new CreateUserAiInfoDto();
      createUserAiInfoDto.key = v.key;
      createUserAiInfoDto.type = v.type;
      createUserAiInfoDto.value = v.value;
      createUserAiInfoDto.userAi = userAi;

      return [...a, createUserAiInfoDto];
    }, []);

    const toUpdateUserAiInfos = UserAiInfos.filter((item) =>
      currentKeys.includes(item.key),
    );

    // create
    await this.createMultiple(toAddUserAiInfos);

    // update
    await this.updateMultiple(userAi.id, userAi.userId, toUpdateUserAiInfos);

    return await this.findAllByUserAi(userAi.id, userAi.userId);
  }

  async updateMultiple(
    userAiId: number,
    userId: number,
    updateUserAiInfoDtos: UpdateUserAiInfoDto[],
  ) {
    for (const updateUserAiInfoDto of updateUserAiInfoDtos) {
      await this.update(userAiId, userId, updateUserAiInfoDto);
    }

    return await this.findAllByUserAi(userAiId, userId);
  }

  async update(
    userAiId: number,
    userId: number,
    updateUserAiInfoDto: UpdateUserAiInfoDto,
  ) {
    return await this.updateCoreService(
      {
        userAi: {
          id: userAiId,
          user: {
            id: userId,
          },
        },
        key: updateUserAiInfoDto.key,
      },
      updateUserAiInfoDto,
      userId,
    );
  }

  async findAllByUserAi(userAiId: number, userId: number) {
    return await this.userAiInfoRepository.find({
      where: {
        userAi: {
          id: userAiId,
          userId,
        },
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} userAiInfo`;
  }
}
