import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { GroqModule } from '../third-party/groq/groq.module';
import { AIService } from './ai.service';
import { AiBuilderService } from './ai-builder.service';
import { UserModule } from '../user/user/user.module';
import { OnboardProcessModule } from '../onboard/onboard-process/onboard-process.module';

@Module({
  imports: [GroqModule, UserModule, OnboardProcessModule],
  controllers: [AIController],
  providers: [AIService, AiBuilderService],
  exports: [AIService, AiBuilderService],
})
export class AIModule {}
