import { PartialType } from '@nestjs/swagger';
import { CreateUserAiDto, CreateUserAiRawDto } from './create-user-ai.dto';

export class UpdateUserAiRawDto extends PartialType(CreateUserAiRawDto) {}

export class UpdateUserAiDto extends PartialType(CreateUserAiDto) {}
