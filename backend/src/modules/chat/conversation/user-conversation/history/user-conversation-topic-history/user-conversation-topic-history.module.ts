import { forwardRef, Module } from '@nestjs/common';
import { UserConversationTopicHistoryService } from './user-conversation-topic-history.service';
import { UserConversationTopicHistoryController } from './user-conversation-topic-history.controller';
import { UserConversationTopicHistory } from './entities/user-conversation-topic-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConversationTopicModule } from '../../topic/user-conversation-topic/user-conversation-topic.module';
import { UserConversationTopicHistoryLogModule } from '../user-conversation-topic-history-log/user-conversation-topic-history-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserConversationTopicHistory]),
    UserConversationTopicHistoryLogModule,
    forwardRef(() => UserConversationTopicModule),
  ],
  controllers: [UserConversationTopicHistoryController],
  providers: [UserConversationTopicHistoryService],
  exports: [UserConversationTopicHistoryService],
})
export class UserConversationTopicHistoryModule {}
