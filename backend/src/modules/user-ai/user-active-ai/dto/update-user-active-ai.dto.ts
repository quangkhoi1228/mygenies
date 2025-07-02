import { PartialType } from '@nestjs/swagger';
import { CreateUserActiveAiDto } from './create-user-active-ai.dto';

export class UpdateUserActiveAiDto extends PartialType(CreateUserActiveAiDto) {}
