import { Module } from '@nestjs/common';
import { UserAiConfigService } from './user-ai-config.service';
import { UserAiConfigController } from './user-ai-config.controller';
import { UserAiConfig } from './entities/user-ai-config.entity';
import { UserAiConfigOptionModule } from '../user-ai-config-option/user-ai-config-option.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/modules/user/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAiConfig]),
    UserAiConfigOptionModule,
    UserModule,
  ],
  controllers: [UserAiConfigController],
  providers: [UserAiConfigService],
  exports: [UserAiConfigService],
})
export class UserAiConfigModule {}
