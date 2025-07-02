import { PartialType } from '@nestjs/swagger';
import { CreateResourceBundleKeyDto } from './create-resource-bundle-key.dto';

export class UpdateResourceBundleKeyDto extends PartialType(
  CreateResourceBundleKeyDto,
) {}
