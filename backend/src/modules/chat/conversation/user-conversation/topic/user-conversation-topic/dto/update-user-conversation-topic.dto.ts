import { PartialType } from '@nestjs/mapped-types';
import { CreateUserConversationTopicDto } from './create-user-conversation-topic.dto';

export class UpdateUserConversationTopicDto extends PartialType(
  CreateUserConversationTopicDto,
) {}
