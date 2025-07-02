import { forwardRef, Module } from '@nestjs/common';
import { UserConversationTopicService } from './user-conversation-topic.service';
import { UserConversationTopicController } from './user-conversation-topic.controller';
import { UserConversationTopic } from './entities/user-conversation-topic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConversationTopicLogModule } from '../user-conversation-topic-log/user-conversation-topic-log.module';
import { UserConversationTopicHistoryModule } from '../../history/user-conversation-topic-history/user-conversation-topic-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserConversationTopic]),
    UserConversationTopicLogModule,
    forwardRef(() => UserConversationTopicHistoryModule),
  ],
  controllers: [UserConversationTopicController],
  providers: [UserConversationTopicService],
  exports: [UserConversationTopicService],
})
export class UserConversationTopicModule {}
