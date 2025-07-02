import { PartialType } from '@nestjs/swagger';
import { CreateUserAiInfoDto } from './create-user-ai-info.dto';

export class UpdateUserAiInfoDto extends PartialType(CreateUserAiInfoDto) {}
