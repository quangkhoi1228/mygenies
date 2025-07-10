import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { CoreEntityHasPrimaryId } from '../../../shared/modules/routes/entity/core.entity';
import {
  StockOrderSide,
  StockOrderType,
} from 'src/modules/stock-order/entities/stock-order.entity';

@Entity()
export class StockOrderTransaction extends CoreEntityHasPrimaryId {
  @ApiProperty()
  @Column()
  stockCode: string;

  @ApiProperty()
  @Column()
  side: StockOrderSide;

  @ApiProperty()
  @Column()
  type: StockOrderType;

  @ApiProperty()
  @Column()
  prevVolume: number;

  @ApiProperty()
  @Column()
  prevPrice: number;

  @ApiProperty()
  @Column()
  orderVolume: number;

  @ApiProperty()
  @Column()
  orderPrice: number;

  @ApiProperty()
  @Column({ nullable: true })
  orderValue: number;

  @ApiProperty()
  @Column()
  avgVolume: number;

  @ApiProperty()
  @Column()
  avgPrice: number;
}
