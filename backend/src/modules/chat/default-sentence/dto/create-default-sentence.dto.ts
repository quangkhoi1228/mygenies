import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export enum SentenceType {
  hello = 'hello',
}

export class SentenceAudio {
  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  convexUrl: string;
}

export class CreateDefaultSentenceBaseDto {
  @ApiProperty()
  @IsString()
  type: SentenceType;

  @ApiProperty()
  @IsString()
  sentence: string;
}

export class CreateDefaultSentenceDto extends CreateDefaultSentenceBaseDto {
  @ApiProperty()
  @IsString()
  translate: string;

  @ApiProperty({ type: SentenceAudio })
  @IsObject()
  audio: SentenceAudio;

  @ApiProperty()
  @IsString()
  hint: string;
}
