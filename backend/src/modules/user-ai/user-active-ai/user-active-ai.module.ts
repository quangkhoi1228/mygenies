import { forwardRef, Module } from '@nestjs/common';
import { UserActiveAiService } from './user-active-ai.service';
import { UserActiveAiController } from './user-active-ai.controller';
import { UserActiveAi } from './entities/user-active-ai.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAiModule } from '../user-ai/user-ai.module';
import { UserModule } from 'src/modules/user/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserActiveAi]),
    UserModule,
    forwardRef(() => UserAiModule),
  ],
  controllers: [UserActiveAiController],
  providers: [UserActiveAiService],
  exports: [UserActiveAiService],
})
export class UserActiveAiModule {}
