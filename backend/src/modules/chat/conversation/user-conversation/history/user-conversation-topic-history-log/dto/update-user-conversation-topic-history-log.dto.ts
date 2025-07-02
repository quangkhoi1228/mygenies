import { PartialType } from '@nestjs/swagger';
import { CreateUserConversationTopicHistoryLogDto } from './create-user-conversation-topic-history-log.dto';

export class UpdateUserConversationTopicHistoryLogDto extends PartialType(CreateUserConversationTopicHistoryLogDto) {}
