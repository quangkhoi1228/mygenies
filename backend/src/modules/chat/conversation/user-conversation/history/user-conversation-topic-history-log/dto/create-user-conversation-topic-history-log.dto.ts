import { ApiProperty } from '@nestjs/swagger';
import { CreateUserConversationTopicHistoryDto } from '../../user-conversation-topic-history/dto/create-user-conversation-topic-history.dto';
import { UserConversationTopicHistory } from '../../user-conversation-topic-history/entities/user-conversation-topic-history.entity';
import { IsNumber } from 'class-validator';

export class CreateUserConversationTopicHistoryLogDto extends CreateUserConversationTopicHistoryDto {
  @ApiProperty()
  @IsNumber()
  refId: number;

  static fromEntity(
    userConversationTopicHistory: UserConversationTopicHistory,
  ): CreateUserConversationTopicHistoryLogDto {
    const dto = new CreateUserConversationTopicHistoryLogDto();

    dto.role = userConversationTopicHistory.role;
    dto.sentence = userConversationTopicHistory.sentence;
    dto.order = userConversationTopicHistory.order;
    dto.userConversationTopicId =
      userConversationTopicHistory.userConversationTopicId;

    dto.refId = userConversationTopicHistory.id;

    return dto;
  }
}
