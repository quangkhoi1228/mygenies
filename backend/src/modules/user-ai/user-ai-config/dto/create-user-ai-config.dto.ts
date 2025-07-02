import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateUserAiConfigOptionBaseDto } from '../../user-ai-config-option/dto/create-user-ai-config-option.dto';

export enum UserAiConfigKey {
  name = 'name',
  avatar = 'avatar',
  tone = 'tone',
  voice = 'voice',
  ability = 'ability',
  maxCharacter = 'maxCharacter',
  maxHintCharacter = 'maxHintCharacter',
}

export enum UserAiConfigType {
  input = 'input',
  imageSelect = 'imageSelect',
  singleChoiceQuestion = 'singleChoiceQuestion',
  multipleChoiceQuestion = 'multipleChoiceQuestion',
}

export class CreateUserAiConfigDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: UserAiConfigKey, enumName: 'UserAiConfigKey' })
  @IsString()
  key: UserAiConfigKey;

  @ApiProperty({ enum: UserAiConfigType, enumName: 'UserAiConfigType' })
  @IsString()
  type: UserAiConfigType;

  @ApiProperty()
  @IsNumber()
  maxSelection: number;

  @ApiPropertyOptional({ type: CreateUserAiConfigOptionBaseDto, isArray: true })
  @IsOptional()
  @IsArray()
  options: CreateUserAiConfigOptionBaseDto[];
}
