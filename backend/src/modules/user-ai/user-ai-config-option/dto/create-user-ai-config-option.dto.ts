import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { UserAiConfig } from '../../user-ai-config/entities/user-ai-config.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserAiConfigOptionBaseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id: number;
}

export class CreateUserAiConfigOptionDto extends CreateUserAiConfigOptionBaseDto {
  @ApiProperty({ type: UserAiConfig })
  @IsObject()
  config: UserAiConfig;
}

export class CreateUserAiConfigOptionRawDto extends CreateUserAiConfigOptionBaseDto {
  @ApiProperty()
  @IsNumber()
  configId: number;
}
