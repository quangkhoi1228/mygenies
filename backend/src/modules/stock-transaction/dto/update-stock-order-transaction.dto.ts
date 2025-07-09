import { PartialType } from '@nestjs/mapped-types';
import { CreateStockOrderTransactionDto } from './create-stock-order-transaction.dto';

export class UpdateStockOrderTransactionDto extends PartialType(
  CreateStockOrderTransactionDto,
) {}
