import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOrderTransaction } from './entities/stock-order-transaction.entity';
import { StockOrderTransactionController } from './stock-order-transaction.controller';
import { StockOrderTransactionService } from './stock-order-transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockOrderTransaction])],
  controllers: [StockOrderTransactionController],
  providers: [StockOrderTransactionService],
  exports: [StockOrderTransactionService],
})
export class StockOrderTransactionModule {}
