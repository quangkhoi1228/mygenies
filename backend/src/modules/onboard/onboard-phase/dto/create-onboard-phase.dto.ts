import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export enum OnboardContentTypeEnum {
  static = 'static',
  singleChoiceQuestion = 'singleChoiceQuestion',
  multipleChoiceQuestion = 'multipleChoiceQuestion',
}

export enum OnboardPhaseTemplateEnum {
  landingPage = 'landingPage',
  question = 'question',
  questionWithChart = 'questionWithChart',
}

export class OnboardContentOption {
  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty()
  @IsString()
  defaultSelected: boolean;

  @ApiProperty()
  @IsBoolean()
  isOptional: boolean;
}

export class OnboardContent {
  @ApiProperty()
  @IsString()
  type: OnboardContentTypeEnum;

  @ApiProperty({ type: OnboardContentOption, isArray: true })
  @IsArray()
  options: OnboardContentOption[];
}

export class CreateOnboardPhaseBaseDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: OnboardContent })
  @IsObject()
  content: OnboardContent;

  @ApiProperty()
  @IsNumber()
  order: number;
}

export class CreateOnboardPhaseDto extends CreateOnboardPhaseBaseDto {}
