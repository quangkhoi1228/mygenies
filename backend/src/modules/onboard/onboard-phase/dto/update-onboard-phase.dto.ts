import { PartialType } from '@nestjs/swagger';
import { CreateOnboardPhaseDto } from './create-onboard-phase.dto';

export class UpdateOnboardPhaseDto extends PartialType(CreateOnboardPhaseDto) {}
