import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { CoreEntityHasPrimaryId } from '../../../shared/modules/routes/entity/core.entity';

export enum StockOrderSide {
  BUY = 'buy',
  SELL = 'sell',
}

export enum StockOrderType {
  LO = 'lo',
}

@Entity()
export class StockOrder extends CoreEntityHasPrimaryId {
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
  volume: number;

  @ApiProperty()
  @Column()
  price: number;
}
