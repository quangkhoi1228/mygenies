import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { StockOrderSide, StockOrderType } from '../entities/stock-order.entity';

export class CreateStockOrderDto {
  @ApiProperty()
  @IsString()
  stockCode: string;

  @ApiProperty()
  @IsEnum(StockOrderSide)
  side: StockOrderSide;

  @ApiProperty()
  @IsEnum(StockOrderType)
  type: StockOrderType;

  @ApiProperty()
  @IsNumber()
  volume: number;

  @ApiProperty()
  @IsNumber()
  price: number;
}
