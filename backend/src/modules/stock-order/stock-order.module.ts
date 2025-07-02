import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOrder } from './entities/stock-order.entity';
import { StockOrderController } from './stock-order.controller';
import { StockOrderService } from './stock-order.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([StockOrder])],
  controllers: [StockOrderController],
  providers: [StockOrderService],
  exports: [StockOrderService],
})
export class StockOrderModule {}
