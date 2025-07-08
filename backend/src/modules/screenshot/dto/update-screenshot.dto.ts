import { PartialType } from '@nestjs/mapped-types';
import { CreateScreenshotDto } from './create-screenshot.dto';

export class UpdateScreenshotDto extends PartialType(CreateScreenshotDto) {}
