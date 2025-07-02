import { Module } from '@nestjs/common';
import { UserConversationTopicHistoryLogService } from './user-conversation-topic-history-log.service';
import { UserConversationTopicHistoryLogController } from './user-conversation-topic-history-log.controller';
import { UserConversationTopicHistoryLog } from './entities/user-conversation-topic-history-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserConversationTopicHistoryLog])],
  controllers: [UserConversationTopicHistoryLogController],
  providers: [UserConversationTopicHistoryLogService],
  exports: [UserConversationTopicHistoryLogService],
})
export class UserConversationTopicHistoryLogModule {}
