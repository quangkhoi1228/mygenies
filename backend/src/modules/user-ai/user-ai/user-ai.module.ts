import { forwardRef, Module } from '@nestjs/common';
import { UserAiService } from './user-ai.service';
import { UserAiController } from './user-ai.controller';
import { UserAi } from './entities/user-ai.entity';
import { UserAiInfoModule } from '../user-ai-info/user-ai-info.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/modules/user/user/user.module';
import { UserAiConfigModule } from '../user-ai-config/user-ai-config.module';
import { UserActiveAiModule } from '../user-active-ai/user-active-ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAi]),
    UserAiInfoModule,
    UserModule,
    UserAiConfigModule,
    forwardRef(() => UserActiveAiModule),
  ],
  controllers: [UserAiController],
  providers: [UserAiService],
  exports: [UserAiService],
})
export class UserAiModule {}
