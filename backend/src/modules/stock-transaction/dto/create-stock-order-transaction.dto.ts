import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import {
  StockOrderSide,
  StockOrderType,
} from 'src/modules/stock-order/entities/stock-order.entity';

export class CreateStockOrderTransactionDto {
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
  prevVolume: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  prevPrice: number;

  @ApiProperty()
  @IsNumber()
  orderVolume: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  orderPrice: number;

  @ApiProperty()
  @IsNumber()
  avgVolume: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  avgPrice: number;
}
