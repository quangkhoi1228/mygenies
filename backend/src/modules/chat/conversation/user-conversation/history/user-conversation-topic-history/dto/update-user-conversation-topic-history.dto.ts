import { PartialType } from '@nestjs/swagger';
import { CreateUserConversationTopicHistoryDto } from './create-user-conversation-topic-history.dto';

export class UpdateUserConversationTopicHistoryDto extends PartialType(CreateUserConversationTopicHistoryDto) {}
