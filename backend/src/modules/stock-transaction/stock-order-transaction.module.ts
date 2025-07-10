import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOrderTransaction } from './entities/stock-order-transaction.entity';
import { StockOrderTransactionController } from './stock-order-transaction.controller';
import { StockOrderTransactionService } from './stock-order-transaction.service';
import { AppConfigModule } from '../app-config/app-config.module';

@Module({
  imports: [TypeOrmModule.forFeature([StockOrderTransaction]), AppConfigModule],
  controllers: [StockOrderTransactionController],
  providers: [StockOrderTransactionService],
  exports: [StockOrderTransactionService],
})
export class StockOrderTransactionModule {}
