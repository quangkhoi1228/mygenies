import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, CreateUserRawDto } from './create-user.dto';

export class UpdateUserRawDto extends PartialType(CreateUserRawDto) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
