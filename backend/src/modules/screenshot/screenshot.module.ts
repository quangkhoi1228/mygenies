import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreenshotController } from './screenshot.controller';
import { ScreenshotService } from './screenshot.service';
import { Screenshot } from './entities/screenshot.entity';
import { ConvexModule } from '../third-party/convex/convex.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Screenshot]), ConvexModule],
  controllers: [ScreenshotController],
  providers: [ScreenshotService],
  exports: [ScreenshotService],
})
export class ScreenshotModule {}
