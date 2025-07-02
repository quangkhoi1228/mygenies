import { Global, Module } from '@nestjs/common';
import { ConvexService } from './convex.service';
import { ConvexController } from './convex.controller';

@Global()
@Module({
  imports: [],
  controllers: [ConvexController],
  providers: [ConvexService],
  exports: [ConvexService],
})
export class ConvexModule {}
