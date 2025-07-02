import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CoreEntity } from '../../../shared/modules/routes/entity/core.entity';

@Entity()
export class Portfolio extends CoreEntity {
  @ApiProperty()
  @PrimaryColumn()
  stockCode: string;

  @ApiProperty()
  @Column()
  volume: number;

  @ApiProperty()
  @Column()
  price: number;
}
