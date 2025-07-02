import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  CreateUserConversationTopicBaseDto,
  CreateUserConversationTopicDto,
  UserConversationTopicStatus,
} from './dto/create-user-conversation-topic.dto';
import { UpdateUserConversationTopicDto } from './dto/update-user-conversation-topic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from '../../../../../../shared/modules/routes/core.service';
import { Repository } from 'typeorm';
import { UserConversationTopic } from './entities/user-conversation-topic.entity';
import { AuthRequest } from '../../../../../auth/interface/auth-request.interface';
import { FindRequestDto } from '../../../../../../shared/dto/find-request.dto';
import { UserConversationTopicLogService } from '../user-conversation-topic-log/user-conversation-topic-log.service';
import { CreateUserConversationTopicLogDto } from '../user-conversation-topic-log/dto/create-user-conversation-topic-log.dto';
import { UserConversationTopicHistoryService } from '../../history/user-conversation-topic-history/user-conversation-topic-history.service';

@Injectable()
export class UserConversationTopicService extends CoreService<UserConversationTopic> {
  constructor(
    @InjectRepository(UserConversationTopic)
    private readonly userConversationTopicRepository: Repository<UserConversationTopic>,

    @Inject(forwardRef(() => UserConversationTopicHistoryService))
    private readonly userConversationTopicHistoryService: UserConversationTopicHistoryService,

    private readonly userConversationTopicLogService: UserConversationTopicLogService,
  ) {
    super(userConversationTopicRepository);
  }

  async create(
    createUserConversationTopicBaseDto: CreateUserConversationTopicBaseDto,
    req: AuthRequest,
  ) {
    const userId = this.preCheckAuth(req);

    const createUserConversationTopicDto = new CreateUserConversationTopicDto();
    createUserConversationTopicDto.name =
      createUserConversationTopicBaseDto.name;
    createUserConversationTopicDto.scenario =
      createUserConversationTopicBaseDto.scenario;
    createUserConversationTopicDto.systemRole =
      createUserConversationTopicBaseDto.systemRole;
    createUserConversationTopicDto.userRole =
      createUserConversationTopicBaseDto.userRole;
    createUserConversationTopicDto.type =
      createUserConversationTopicBaseDto.type;

    createUserConversationTopicDto.userId = userId;

    const userConversationTopic = await this.createCoreService(
      [createUserConversationTopicDto],
      'system',
    );

    return userConversationTopic[0];
  }

  async findAll(req: AuthRequest) {
    const userId = this.preCheckAuth(req);

    const findRequestDto = new FindRequestDto(req);
    findRequestDto.filter['userId'] = {
      operator: '=',
      value: userId,
    };

    const data = await this.findAllCoreServiceByFindRequestDto(findRequestDto);

    return data;
  }

  async findOne(id: number, req: AuthRequest) {
    const userId = this.preCheckAuth(req);

    return await this.userConversationTopicRepository.findOne({
      where: {
        id,
        userId,
      },
    });
  }

  async update(
    id: number,
    updateUserConversationTopicDto: UpdateUserConversationTopicDto,
    req: AuthRequest,
  ) {
    const userId = this.preCheckAuth(req);

    const existed = await this.userConversationTopicRepository.findOneBy({
      id,
      userId,
    });

    if (existed) {
      delete updateUserConversationTopicDto.userId;

      return await this.updateCoreService(
        { id },
        updateUserConversationTopicDto,
        'system',
      );
    } else {
      throw new BadRequestException('User conversation topic not found');
    }
  }

  async remove(id: number, req: AuthRequest) {
    const userId = this.preCheckAuth(req);

    const removeEntity = await this.userConversationTopicRepository.findOneBy({
      id,
      userId,
    });

    if (removeEntity) {
      const log = await this.userConversationTopicLogService.create(
        CreateUserConversationTopicLogDto.fromEntity(removeEntity),
      );

      if (log) {
        return await this.userConversationTopicRepository.remove(removeEntity);
      } else {
        throw new BadRequestException(
          'Error delete user conversation topic history',
        );
      }
    } else {
      throw new BadRequestException('User conversation topic not found');
    }
  }

  async removeHistory(id: number, req: AuthRequest) {
    const userId = this.preCheckAuth(req);

    const topic = await this.userConversationTopicRepository.findOneBy({
      id,
      userId,
    });

    if (topic) {
      const history = await this.userConversationTopicHistoryService
        .getRepository()
        .findBy({
          userConversationTopicId: topic.id,
        });

      const result =
        await this.userConversationTopicHistoryService.createLogAndRemove(
          history,
        );

      await this.update(
        topic.id,
        { status: UserConversationTopicStatus.new },
        req,
      );

      return result;
    } else {
      throw new BadRequestException('User conversation topic not found');
    }
  }
}
