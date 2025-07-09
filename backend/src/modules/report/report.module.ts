import { Module } from '@nestjs/common';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { StockOrderTransactionModule } from '../stock-transaction/stock-order-transaction.module';
import { UserModule } from '../user/user/user.module';
import { ReportCronService } from './cron/report.cron.service';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [UserModule, PortfolioModule, StockOrderTransactionModule],
  controllers: [ReportController],
  providers: [ReportService, ReportCronService],
  exports: [ReportService],
})
export class ReportModule {}
