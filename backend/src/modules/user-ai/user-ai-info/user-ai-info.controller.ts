import { Controller } from '@nestjs/common';
import { UserAiInfoService } from './user-ai-info.service';

@Controller('userAiInfo')
export class UserAiInfoController {
  constructor(private readonly userAiInfoService: UserAiInfoService) {}
}
