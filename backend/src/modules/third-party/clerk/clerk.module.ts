import { Global, Module } from '@nestjs/common';
import { ClerkService } from './clerk.service';
import { ClerkController } from './clerk.controller';

@Global()
@Module({
  imports: [],
  controllers: [ClerkController],
  providers: [ClerkService],
  exports: [ClerkService],
})
export class ClerkModule {}
