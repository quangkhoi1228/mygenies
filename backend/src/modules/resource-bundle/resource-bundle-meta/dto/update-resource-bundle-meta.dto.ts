import { PartialType } from '@nestjs/swagger';
import { CreateResourceBundleMetaDto } from './create-resource-bundle-meta.dto';

export class UpdateResourceBundleMetaDto extends PartialType(
  CreateResourceBundleMetaDto,
) {}
