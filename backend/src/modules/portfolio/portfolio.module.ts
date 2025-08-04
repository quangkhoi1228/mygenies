import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { UserModule } from '../user/user/user.module';
import { StockOrderModule } from '../stock-order/stock-order.module';
import { UpdateTransactionPortfolioCronService } from './cron/update-transaction-portfolio.cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio]),
    forwardRef(() => StockOrderModule),
    UserModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService, UpdateTransactionPortfolioCronService],
  exports: [PortfolioService, UpdateTransactionPortfolioCronService],
})
export class PortfolioModule {}
