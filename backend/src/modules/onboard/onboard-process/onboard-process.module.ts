import { forwardRef, Module } from '@nestjs/common';
import { OnboardProcessService } from './onboard-process.service';
import { OnboardProcessController } from './onboard-process.controller';
import { OnboardPhaseModule } from '../onboard-phase/onboard-phase.module';
import { UserModule } from 'src/modules/user/user/user.module';
import { AIModule } from 'src/modules/ai/ai.module';
import { UserConversationTopicModule } from 'src/modules/chat/conversation/user-conversation/topic/user-conversation-topic/user-conversation-topic.module';

@Module({
  imports: [
    OnboardPhaseModule,
    UserModule,
    UserConversationTopicModule,
    forwardRef(() => AIModule),
  ],
  controllers: [OnboardProcessController],
  providers: [OnboardProcessService],
  exports: [OnboardProcessService],
})
export class OnboardProcessModule {}
