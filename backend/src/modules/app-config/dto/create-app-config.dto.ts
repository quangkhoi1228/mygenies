import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export enum AppConfigName {
  ONBOARD_PHASE_PROCESS = 'ONBOARD_PHASE_PROCESS',
  USER_AI_CONFIG_PROCESS = 'USER_AI_CONFIG_PROCESS',

  ADMIN_UPLOAD_FILE_SIZE = 'ADMIN_UPLOAD_FILE_SIZE',
  CUSTOMER_UPLOAD_FILE_SIZE = 'CUSTOMER_UPLOAD_FILE_SIZE',
}

export class OnboardProcessConfig {
  steps: OnboardProcessConfigItem[];
}

export class OnboardProcessConfigItem {
  code: string;
  type: 'view' | 'action';
}

export enum ConfigType {
  string = 'string',
  number = 'number',
  date = 'date',
  object = 'object',
  array = 'array',
}

export class CreateAppConfigDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty()
  @IsString()
  type: ConfigType;
}
