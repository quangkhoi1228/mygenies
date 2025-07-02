import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  CreateResourceBundleDto,
  ToActionMeta,
} from './create-resource-bundle.dto';
import { IsArray } from 'class-validator';

export class UpdateResourceBundleDto extends PartialType(
  CreateResourceBundleDto,
) {
  @ApiProperty({ type: ToActionMeta, isArray: true })
  @IsArray()
  toUpdateMeta: ToActionMeta[];
}
