import { Global, Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { SlackController } from './slack.controller';

@Global()
@Module({
  imports: [],
  controllers: [SlackController],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
