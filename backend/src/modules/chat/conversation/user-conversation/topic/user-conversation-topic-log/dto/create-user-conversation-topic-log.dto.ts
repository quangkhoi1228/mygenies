import { IsNumber } from 'class-validator';
import { CreateUserConversationTopicDto } from '../../user-conversation-topic/dto/create-user-conversation-topic.dto';
import { UserConversationTopic } from '../../user-conversation-topic/entities/user-conversation-topic.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserConversationTopicLogDto extends CreateUserConversationTopicDto {
  @ApiProperty()
  @IsNumber()
  refId: number;

  static fromEntity(
    userConversationTopic: UserConversationTopic,
  ): CreateUserConversationTopicLogDto {
    const dto = new CreateUserConversationTopicLogDto();

    dto.name = userConversationTopic.name;
    dto.scenario = userConversationTopic.scenario;
    dto.systemRole = userConversationTopic.systemRole;
    dto.userRole = userConversationTopic.userRole;
    dto.userId = userConversationTopic.userId;
    dto.type = userConversationTopic.type;

    dto.refId = userConversationTopic.id;

    return dto;
  }
}
