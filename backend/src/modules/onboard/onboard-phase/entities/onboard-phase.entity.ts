import { CoreEntityHasPrimaryId } from '../../../../shared/modules/routes/entity/core.entity';
import { Column, Entity, Unique } from 'typeorm';
import {
  OnboardContent,
  OnboardPhaseTemplateEnum,
} from '../dto/create-onboard-phase.dto';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['code'])
export class OnboardPhase extends CoreEntityHasPrimaryId {
  @ApiProperty()
  @Column()
  code: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column({
    type: 'jsonb',
  })
  content: OnboardContent;

  @ApiProperty()
  @Column({ default: OnboardPhaseTemplateEnum.question })
  template: OnboardPhaseTemplateEnum;

  @ApiProperty()
  @Column()
  order: number;
}
