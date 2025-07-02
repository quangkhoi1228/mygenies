import { PartialType } from '@nestjs/swagger';
import { CreateUserAiConfigDto } from './create-user-ai-config.dto';

export class UpdateUserAiConfigDto extends PartialType(CreateUserAiConfigDto) {}
