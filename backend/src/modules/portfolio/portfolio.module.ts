import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PortfolioCronService } from './cron/portfolio.cron.service';
import { UserModule } from '../user/user/user.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Portfolio]), UserModule],
  controllers: [PortfolioController],
  providers: [PortfolioService, PortfolioCronService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
