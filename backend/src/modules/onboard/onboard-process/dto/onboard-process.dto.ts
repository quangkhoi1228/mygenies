import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { OnboardPhase } from '../../onboard-phase/entities/onboard-phase.entity';

export class OnboardProcessProcessDto {
  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsNumber()
  current: number;
}

export class OnboardProcessItemStatusDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  value?: boolean | string | string[];
}

export class OnboardProcessStageDto {
  @ApiProperty({ type: OnboardPhase, isArray: true })
  @IsArray()
  steps: OnboardPhase[];

  @ApiProperty()
  @IsNumber()
  total: number;
}

export class OnboardProcessStatusDto {
  @ApiProperty({ type: OnboardProcessProcessDto, isArray: true })
  @IsArray()
  process: OnboardProcessProcessDto[];

  @ApiProperty({ type: OnboardProcessItemStatusDto, isArray: true })
  @IsArray()
  itemStatus: OnboardProcessItemStatusDto[];

  @ApiProperty()
  @IsBoolean()
  done: boolean;

  @ApiProperty({ type: OnboardPhase })
  @IsObject()
  previous: OnboardPhase;

  @ApiProperty({ type: OnboardPhase })
  @IsObject()
  current: OnboardPhase;

  @ApiProperty({ type: OnboardPhase })
  @IsObject()
  next: OnboardPhase;
}
