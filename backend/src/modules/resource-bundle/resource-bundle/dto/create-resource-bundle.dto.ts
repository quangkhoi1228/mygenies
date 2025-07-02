import { IsArray, IsString } from 'class-validator';
import { LangCodesEnum } from '../entities/resource-bundle.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ToActionMeta {
  @ApiProperty()
  @IsString()
  langCode: LangCodesEnum;

  @ApiProperty()
  @IsString()
  value: string;
}

export class CreateResourceBundleDto {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty({ type: ToActionMeta, isArray: true })
  @IsArray()
  toAddMeta: ToActionMeta[];
}
