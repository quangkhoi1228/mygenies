import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ReportService } from '../report.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ReportCronService {
  constructor(
    private readonly reportService: ReportService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    // this.weeklyCron();
  }

  @Cron('0 17 * * 5', {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  // @Cron('* * * * *')
  async reportPortfolioAndSellProfitCron() {
    /**
     * Send email link to attend and link to create annual leave request
     */
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('------> Cron portfolio run <------');
    const check = new Date();
    console.log('Start', `- ${check} -> ${check.getTime()}`);
    await this.reportService.processReportPortfolioAndSellProfitCron();
    console.log('End', `- ${new Date().getTime() - check.getTime()}`);
  }
}
