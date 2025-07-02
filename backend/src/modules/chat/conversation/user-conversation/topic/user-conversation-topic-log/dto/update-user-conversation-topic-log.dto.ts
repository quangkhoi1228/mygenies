import { PartialType } from '@nestjs/swagger';
import { CreateUserConversationTopicLogDto } from './create-user-conversation-topic-log.dto';

export class UpdateUserConversationTopicLogDto extends PartialType(
  CreateUserConversationTopicLogDto,
) {}
