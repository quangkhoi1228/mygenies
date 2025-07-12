import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOrder } from './entities/stock-order.entity';
import { StockOrderController } from './stock-order.controller';
import { StockOrderService } from './stock-order.service';
import { UserModule } from '../user/user/user.module';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { StockOrderTransactionModule } from '../stock-transaction/stock-order-transaction.module';
import { AppConfigModule } from '../app-config/app-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockOrder]),
    forwardRef(() => PortfolioModule),
    UserModule,
    StockOrderTransactionModule,
    AppConfigModule,
  ],
  controllers: [StockOrderController],
  providers: [StockOrderService],
  exports: [StockOrderService],
})
export class StockOrderModule {}
