import { IsString } from 'class-validator';
import { ResourceBundleKey } from '../../resource-bundle-key/entities/resource-bundle-key.entity';
import { LangCodesEnum } from '../../resource-bundle/entities/resource-bundle.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceBundleMetaDto {
  @ApiProperty()
  @IsString()
  langCode: LangCodesEnum;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty()
  resourceBundleKey: ResourceBundleKey;
}
