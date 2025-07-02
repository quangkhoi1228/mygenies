import { PartialType } from '@nestjs/swagger';
import { CreateUserAiConfigOptionDto } from './create-user-ai-config-option.dto';

export class UpdateUserAiConfigOptionDto extends PartialType(
  CreateUserAiConfigOptionDto,
) {}
