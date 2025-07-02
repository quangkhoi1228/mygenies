import { Module } from '@nestjs/common';
import { UserAiInfoService } from './user-ai-info.service';
import { UserAiInfoController } from './user-ai-info.controller';
import { UserAiInfo } from './entities/user-ai-info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserAiInfo])],
  controllers: [UserAiInfoController],
  providers: [UserAiInfoService],
  exports: [UserAiInfoService],
})
export class UserAiInfoModule {}
