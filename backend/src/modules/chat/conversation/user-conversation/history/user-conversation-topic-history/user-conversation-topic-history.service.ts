import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserConversationTopicHistoryDto } from './dto/create-user-conversation-topic-history.dto';
import { UpdateUserConversationTopicHistoryDto } from './dto/update-user-conversation-topic-history.dto';
import { UserConversationTopicHistory } from './entities/user-conversation-topic-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from 'src/shared/modules/routes/core.service';
import { Repository } from 'typeorm';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { FindRequestDto } from 'src/shared/dto/find-request.dto';
import { UserConversationTopicService } from '../../topic/user-conversation-topic/user-conversation-topic.service';
import { UserConversationTopicHistoryLogService } from '../user-conversation-topic-history-log/user-conversation-topic-history-log.service';
import { CreateUserConversationTopicHistoryLogDto } from '../user-conversation-topic-history-log/dto/create-user-conversation-topic-history-log.dto';
import { isNotEmpty } from 'src/utils/object.util';
import { UserConversationTopicStatus } from '../../topic/user-conversation-topic/dto/create-user-conversation-topic.dto';

@Injectable()
export class UserConversationTopicHistoryService extends CoreService<UserConversationTopicHistory> {
  constructor(
    @InjectRepository(UserConversationTopicHistory)
    private readonly userConversationTopicHistoryRepository: Repository<UserConversationTopicHistory>,

    @Inject(forwardRef(() => UserConversationTopicService))
    private readonly userConversationTopicService: UserConversationTopicService,

    private readonly userConversationTopicHistoryLogService: UserConversationTopicHistoryLogService,
  ) {
    super(userConversationTopicHistoryRepository);
  }

  async create(
    createUserConversationTopicHistoryDto: CreateUserConversationTopicHistoryDto,
    req: AuthRequest,
  ) {
    const topic = await this.checkUserConversationTopic(
      createUserConversationTopicHistoryDto.userConversationTopicId,
      req,
    );

    if (topic) {
      const userConversationTopic = await this.createCoreService(
        [createUserConversationTopicHistoryDto],
        req.user.userId,
      );

      return userConversationTopic[0];
    }
  }

  async findAll(req: AuthRequest) {
    const findRequestDto = new FindRequestDto(req);

    if (
      findRequestDto.filter['userConversationTopicId'] &&
      !isNaN(findRequestDto.filter['userConversationTopicId'].value)
    ) {
      const topic = await this.checkUserConversationTopic(
        findRequestDto.filter['userConversationTopicId'].value,
        req,
      );

      if (!isNotEmpty(findRequestDto.sort)) {
        findRequestDto.sort['order'] = 'asc';
      }

      if (topic) {
        const data =
          await this.findAllCoreServiceByFindRequestDto(findRequestDto);

        return data;
      } else {
        const data = await this.responseEmptyFindAll(findRequestDto);

        return data;
      }
    } else {
      throw new BadRequestException('User conversation topic required');
    }
  }

  async findOne(id: number, req: AuthRequest) {
    const history = await this.userConversationTopicHistoryRepository.findOne({
      where: {
        id,
      },
    });

    if (history) {
      const topic = await this.checkUserConversationTopic(
        history.userConversationTopicId,
        req,
      );

      if (topic) {
        return history;
      }
    } else {
      throw new BadRequestException(
        'User conversation topic history not found',
      );
    }
  }

  async update(
    id: number,
    updateUserConversationTopicHistoryDto: UpdateUserConversationTopicHistoryDto,
    req: AuthRequest,
  ) {
    const existed = await this.userConversationTopicHistoryRepository.findOneBy(
      {
        id,
      },
    );

    if (existed) {
      const topic = await this.checkUserConversationTopic(
        existed.userConversationTopicId,
        req,
      );

      if (topic) {
        return await this.updateCoreService(
          { id },
          updateUserConversationTopicHistoryDto,
          'system',
        );
      }
    } else {
      throw new BadRequestException(
        'User conversation topic history not found',
      );
    }
  }

  async remove(id: number, req: AuthRequest) {
    const removeEntity =
      await this.userConversationTopicHistoryRepository.findOneBy({
        id,
      });

    if (removeEntity) {
      const topic = await this.checkUserConversationTopic(
        removeEntity.userConversationTopicId,
        req,
      );

      if (topic) {
        return await this.createLogAndRemove([removeEntity]);
      }
    } else {
      throw new BadRequestException(
        'User conversation topic history not found',
      );
    }
  }

  async removeAllByConversation(id: number, req: AuthRequest) {
    const topic = await this.checkUserConversationTopic(id, req);

    if (topic) {
      const history = await this.userConversationTopicHistoryRepository.findBy({
        userConversationTopicId: topic.id,
      });

      const result = await this.createLogAndRemove(history);

      await this.userConversationTopicService.update(
        topic.id,
        { status: UserConversationTopicStatus.new },
        req,
      );

      return result;
    }
  }

  async createLogAndRemove(history: UserConversationTopicHistory[]) {
    const logs =
      await this.userConversationTopicHistoryLogService.createMultiple(
        history.map((item) =>
          CreateUserConversationTopicHistoryLogDto.fromEntity(item),
        ),
      );

    if (logs) {
      return await this.userConversationTopicHistoryRepository.remove(history);
    } else {
      throw new BadRequestException(
        'Error delete user conversation topic history',
      );
    }
  }

  async checkUserConversationTopic(id: number, req: AuthRequest) {
    const userId = this.preCheckAuth(req);

    if (userId) {
    }

    const topic = await this.userConversationTopicService.findOne(id, req);

    if (topic) {
      return topic;
    } else {
      throw new BadRequestException(
        'User conversation topic history not found',
      );
    }
  }
}
