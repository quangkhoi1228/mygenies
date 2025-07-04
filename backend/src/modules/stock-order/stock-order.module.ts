import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOrder } from './entities/stock-order.entity';
import { StockOrderController } from './stock-order.controller';
import { StockOrderService } from './stock-order.service';
import { UserModule } from '../user/user/user.module';
import { PortfolioModule } from '../portfolio/portfolio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockOrder]),
    forwardRef(() => PortfolioModule),
    UserModule,
  ],
  controllers: [StockOrderController],
  providers: [StockOrderService],
  exports: [StockOrderService],
})
export class StockOrderModule {}
