import { PartialType } from '@nestjs/mapped-types';
import { CreateStockOrderDto } from './create-stock-order.dto';

export class UpdateStockOrderDto extends PartialType(CreateStockOrderDto) {}
