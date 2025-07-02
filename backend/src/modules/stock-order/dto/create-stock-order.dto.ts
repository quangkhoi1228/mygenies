import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
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
  @Min(100)
  volume: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  price: number;
}
