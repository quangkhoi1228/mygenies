import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfoModule } from '../user-info/user-info.module';
import { User } from './entities/user.entity';
import { AppConfigModule } from 'src/modules/app-config/app-config.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserInfoModule, AppConfigModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
