import { Global, Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';

@Global()
@Module({
  imports: [],
  controllers: [SlackController],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
