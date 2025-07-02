import { CoreEntityHasPrimaryId } from '../../../../shared/modules/routes/entity/core.entity';
import { Column, Entity } from 'typeorm';
import {
  SentenceAudio,
  SentenceType,
} from '../dto/create-default-sentence.dto';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class DefaultSentence extends CoreEntityHasPrimaryId {
  @ApiProperty()
  @Column()
  type: SentenceType;

  @ApiProperty()
  @Column()
  sentence: string;

  @ApiProperty()
  @Column()
  translate: string;

  @ApiProperty()
  @Column({
    type: 'jsonb',
  })
  audio: SentenceAudio;

  @ApiProperty()
  @Column({ default: '' })
  hint: string;
}
