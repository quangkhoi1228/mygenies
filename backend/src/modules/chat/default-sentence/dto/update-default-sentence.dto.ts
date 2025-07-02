import { PartialType } from '@nestjs/mapped-types';
import {
  CreateDefaultSentenceBaseDto,
  CreateDefaultSentenceDto,
} from './create-default-sentence.dto';

export class UpdateDefaultSentenceDto extends PartialType(
  CreateDefaultSentenceDto,
) {}

export class UpdateDefaultSentenceBaseDto extends PartialType(
  CreateDefaultSentenceBaseDto,
) {}
