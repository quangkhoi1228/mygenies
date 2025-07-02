import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class CreateUserActiveAiDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  userAiId: number;
}
