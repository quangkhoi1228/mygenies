import { Module } from '@nestjs/common';
import { ConversationProcessService } from './conversation-process.service';
import { ConversationProcessController } from './conversation-process.controller';
import { GroqModule } from '../../../third-party/groq/groq.module';
import { AIModule } from 'src/modules/ai/ai.module';

@Module({
  imports: [GroqModule, AIModule],
  controllers: [ConversationProcessController],
  providers: [ConversationProcessService],
  exports: [ConversationProcessService],
})
export class ConversationProcessModule {}
