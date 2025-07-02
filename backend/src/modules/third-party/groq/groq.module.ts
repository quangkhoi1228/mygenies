import { Global, Module } from '@nestjs/common';
import { GroqService } from './groq.service';
import { GroqController } from './groq.controller';

@Global()
@Module({
  imports: [],
  controllers: [GroqController],
  providers: [GroqService],
  exports: [GroqService],
})
export class GroqModule {}
