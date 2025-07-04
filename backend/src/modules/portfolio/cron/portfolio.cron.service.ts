import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PortfolioService } from '../portfolio.service';

@Injectable()
export class PortfolioCronService {
  constructor(
    private readonly portfolioService: PortfolioService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    // this.dailyCron();
  }
  // run everyday at 8:45 am
  // @Cron('0 45 8 * * *')
  @Cron(CronExpression.EVERY_WEEK)
  async dailyCron() {
    /**
     * Send email link to attend and link to create annual leave request
     */
    console.log('------> Cron portfolio run <------');
    const check = new Date();
    console.log('Start', `- ${check} -> ${check.getTime()}`);
    await this.portfolioService.processMonthlyCron();
    console.log('End', `- ${new Date().getTime() - check.getTime()}`);
  }
}
