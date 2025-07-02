import { forwardRef, Module } from '@nestjs/common';
import { UserAiConfigOptionService } from './user-ai-config-option.service';
import { UserAiConfigOptionController } from './user-ai-config-option.controller';
import { UserAiConfigOption } from './entities/user-ai-config-option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAiConfigModule } from '../user-ai-config/user-ai-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAiConfigOption]),
    forwardRef(() => UserAiConfigModule),
  ],
  controllers: [UserAiConfigOptionController],
  providers: [UserAiConfigOptionService],
  exports: [UserAiConfigOptionService],
})
export class UserAiConfigOptionModule {}
