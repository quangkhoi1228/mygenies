import { CoreEntityHasPrimaryId } from '../../../shared/modules/routes/entity/core.entity';
import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Screenshot extends CoreEntityHasPrimaryId {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  url: string;

  @ApiProperty()
  @Column()
  selector: string;
}
