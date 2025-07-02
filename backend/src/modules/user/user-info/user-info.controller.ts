import { Controller } from '@nestjs/common';
import { UserInfoService } from './user-info.service';

@Controller('userInfo')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}
}
