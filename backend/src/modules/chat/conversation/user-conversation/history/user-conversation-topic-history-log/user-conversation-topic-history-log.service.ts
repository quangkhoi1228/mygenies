import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserConversationTopicHistoryLogDto } from './dto/create-user-conversation-topic-history-log.dto';
import { UpdateUserConversationTopicHistoryLogDto } from './dto/update-user-conversation-topic-history-log.dto';
import { UserConversationTopicHistoryLog } from './entities/user-conversation-topic-history-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { FindRequestDto } from 'src/shared/dto/find-request.dto';
import { CoreService } from 'src/shared/modules/routes/core.service';
import { Repository } from 'typeorm';
@Injectable()
export class UserConversationTopicHistoryLogService extends CoreService<UserConversationTopicHistoryLog> {
  constructor(
    @InjectRepository(UserConversationTopicHistoryLog)
    private readonly userConversationTopicHistoryLogRepository: Repository<UserConversationTopicHistoryLog>,
  ) {
    super(userConversationTopicHistoryLogRepository);
  }

  async create(
    createUserConversationTopicHistoryLogDto: CreateUserConversationTopicHistoryLogDto,
  ) {
    const userConversationTopic = await this.createCoreService(
      [createUserConversationTopicHistoryLogDto],
      'system',
    );

    return userConversationTopic[0];
  }

  async createMultiple(
    listCreateUserConversationTopicHistoryLogDto: CreateUserConversationTopicHistoryLogDto[],
  ) {
    const userConversationTopic = await this.createCoreService(
      listCreateUserConversationTopicHistoryLogDto,
      'system',
    );

    return userConversationTopic;
  }

  async findAll(req: AuthRequest) {
    const findRequestDto = new FindRequestDto(req);

    const data = await this.findAllCoreServiceByFindRequestDto(findRequestDto);

    return data;
  }

  async findOne(id: number) {
    return await this.userConversationTopicHistoryLogRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateUserConversationTopicHistoryLogDto: UpdateUserConversationTopicHistoryLogDto,
  ) {
    const existed =
      await this.userConversationTopicHistoryLogRepository.findOneBy({
        id,
      });

    if (existed) {
      return await this.updateCoreService(
        { id },
        updateUserConversationTopicHistoryLogDto,
        'system',
      );
    } else {
      throw new BadRequestException(
        'User conversation topic history log not found',
      );
    }
  }

  async remove(id: number) {
    const removeEntity =
      await this.userConversationTopicHistoryLogRepository.findOneBy({
        id,
      });

    if (removeEntity) {
      return await this.userConversationTopicHistoryLogRepository.remove(
        removeEntity,
      );
    } else {
      throw new BadRequestException(
        'User conversation topic history log not found',
      );
    }
  }
}
