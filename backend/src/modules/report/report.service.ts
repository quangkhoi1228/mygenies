import { Injectable } from '@nestjs/common';
import { getPortfolioPercentage } from 'src/utils/financeUtils';
import { PortfolioService } from '../portfolio/portfolio.service';
import { SlackService } from '../third-party/slack/slack.service';
import { UserDataDto } from '../user/user/dto/create-user.dto';
import { UserService } from '../user/user/user.service';
import { PortfolioReportType } from '../third-party/slack/types/portfolio-report.type';

@Injectable()
// @UseGuards(AdminAuthGuard)
export class ReportService {
  constructor(
    private readonly userService: UserService,
    private readonly slackService: SlackService,
    private readonly portfolioService: PortfolioService,
  ) {}

  async processReportPortfolioAndSellProfitCron() {
    try {
      const users = await this.userService.getRepository().find({
        ...this.userService.createDefaultFindOption(),
      });

      for (const user of users) {
        const dataDto = this.userService.convertDataToResponse(user);

        const reportPortfolios = await this.getReportPortfolio(dataDto);

        console.log('portfolios', JSON.stringify(reportPortfolios, null, 2));

        // await this.slackService.sendPortfolioSignalMessage(portfolios, dataDto);

        // const now = new Date();
        // const start = new Date();
        // start.setDate(start.getDate() - 7);

        // const orders = await this.stockOrderService.getRepository().find({
        //   where: {
        //     createdUser: dataDto.id,
        //     side: StockOrderSide.SELL,
        //     createdAt: And(MoreThan(start), LessThanOrEqual(now)),
        //   },
        //   order: {
        //     stockCode: 'desc',
        //   },
        // });
        // await this.slackService.sendSellProfitSignalMessage(
        //   portfolios,
        //   orders,
        //   dataDto,
        // );
      }
    } catch (error) {
      console.error('Error in processMonthlyCron', error);
    }
  }

  async getReportPortfolio(user: UserDataDto) {
    const portfolios = await this.portfolioService.find({
      where: {
        createdUser: user.id,
      },
      order: {
        stockCode: 'desc',
      },
    });
    const reportPortfolios: PortfolioReportType[] = portfolios.map(
      (portfolio) => {
        return {
          ...portfolio,
          percent: getPortfolioPercentage(
            portfolio.price,
            portfolio.volume,
            user.userInfo.nav,
          ),
          status: 'Nắm giữ',
        };
      },
    );

    return reportPortfolios;
  }
}
