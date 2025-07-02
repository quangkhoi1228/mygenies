import { Module } from '@nestjs/common';
import { UserConversationTopicLogService } from './user-conversation-topic-log.service';
import { UserConversationTopicLogController } from './user-conversation-topic-log.controller';
import { UserConversationTopicLog } from './entities/user-conversation-topic-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserConversationTopicLog])],
  controllers: [UserConversationTopicLogController],
  providers: [UserConversationTopicLogService],
  exports: [UserConversationTopicLogService],
})
export class UserConversationTopicLogModule {}
