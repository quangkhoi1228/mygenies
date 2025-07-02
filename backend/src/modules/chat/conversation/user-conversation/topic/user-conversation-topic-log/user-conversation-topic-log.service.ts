import { BadRequestException, Injectable } from '@nestjs/common';
import { UserConversationTopicLog } from './entities/user-conversation-topic-log.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { FindRequestDto } from 'src/shared/dto/find-request.dto';
import { CoreService } from 'src/shared/modules/routes/core.service';
import { CreateUserConversationTopicLogDto } from './dto/create-user-conversation-topic-log.dto';
import { UpdateUserConversationTopicLogDto } from './dto/update-user-conversation-topic-log.dto';

@Injectable()
export class UserConversationTopicLogService extends CoreService<UserConversationTopicLog> {
  constructor(
    @InjectRepository(UserConversationTopicLog)
    private readonly userConversationTopicRepository: Repository<UserConversationTopicLog>,
  ) {
    super(userConversationTopicRepository);
  }

  async create(
    createUserConversationTopicLogDto: CreateUserConversationTopicLogDto,
  ) {
    const userConversationTopic = await this.createCoreService(
      [createUserConversationTopicLogDto],
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

  async findOne(id: number) {
    return await this.userConversationTopicRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateUserConversationTopicLogDto: UpdateUserConversationTopicLogDto,
  ) {
    const existed = await this.userConversationTopicRepository.findOneBy({
      id,
    });

    if (existed) {
      delete updateUserConversationTopicLogDto.userId;

      return await this.updateCoreService(
        { id },
        updateUserConversationTopicLogDto,
        'system',
      );
    } else {
      throw new BadRequestException('User conversation topic log not found');
    }
  }

  async remove(id: number) {
    const removeEntity = await this.userConversationTopicRepository.findOneBy({
      id,
    });

    if (removeEntity) {
      return await this.userConversationTopicRepository.remove(removeEntity);
    } else {
      throw new BadRequestException('User conversation topic log not found');
    }
  }
}
