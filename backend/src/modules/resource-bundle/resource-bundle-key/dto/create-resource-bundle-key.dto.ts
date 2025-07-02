import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateResourceBundleKeyDto {
  @ApiProperty()
  @IsString()
  key: string;
}
