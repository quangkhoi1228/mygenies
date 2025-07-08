import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateScreenshotDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  selector: string;
}
