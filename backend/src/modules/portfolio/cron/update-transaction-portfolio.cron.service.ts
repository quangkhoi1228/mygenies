import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { PortfolioService } from '../portfolio.service';

@Injectable()
export class UpdateTransactionPortfolioCronService {
  constructor(
    private readonly portfolioService: PortfolioService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    // this.weeklyCron();
  }

  @Cron('0 0 * * 1-5', {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  // @Cron('* * * * *')
  async updateTransactionPortfolioCron() {
    /**
     * Send email link to attend and link to create annual leave request
     */
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('------> Cron portfolio run <------');
    const check = new Date();
    console.log('Start', `- ${check} -> ${check.getTime()}`);
    await this.portfolioService.updateTransactionPortfolio();
    console.log('End', `- ${new Date().getTime() - check.getTime()}`);
  }
}
