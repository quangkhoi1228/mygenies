import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { formatPrice, getPortfolioPercentage } from 'src/utils/financeUtils';
import { And, LessThanOrEqual, MoreThan } from 'typeorm';
import { PortfolioService } from '../portfolio/portfolio.service';
import { StockOrderSide } from '../stock-order/entities/stock-order.entity';
import { StockOrderTransactionService } from '../stock-transaction/stock-order-transaction.service';
import { SlackService } from '../third-party/slack/slack.service';
import { UserDataDto } from '../user/user/dto/create-user.dto';
import { UserService } from '../user/user/user.service';
import { PortfolioReportType } from './types/portfolio-report.type';
import {
  SellProfitReportTransactionType,
  SellProfitReportType,
} from './types/sell-profit-report.type';
import { UploadImageReportResType } from './types/upload-image-report-res.type';
import { SlackMessageType } from './types/slack-block.type';

@Injectable()
// @UseGuards(AdminAuthGuard)
export class ReportService {
  constructor(
    private readonly userService: UserService,
    private readonly slackService: SlackService,
    private readonly portfolioService: PortfolioService,
    private readonly stockOrderTransactionService: StockOrderTransactionService,
  ) {}

  async processReportPortfolioAndSellProfitCron() {
    try {
      const users = await this.userService.find({
        ...this.userService.createDefaultFindOption(),
      });

      for (const user of users) {
        const dataDto = this.userService.convertDataToResponse(user);
        if (!dataDto.userInfo.slackWebhookUrl) {
          continue;
        }
        const slackWebhookUrl = dataDto.userInfo.slackWebhookUrl;

        const reportData: SlackMessageType = {
          text: `CẬP NHẬT DANH MỤC TUẦN`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `Team NTH Invest gửi đến quý nhà đầu tư, danh mục đầu tư trong tuần của team để anh/chị có thể theo dõi. `,
              },
            },
          ],
        };
        const reportPortfoliosImageUrl = await this.getReportPortfolio(dataDto);
        console.log(reportPortfoliosImageUrl);
        if (reportPortfoliosImageUrl) {
          reportData.blocks.push({
            type: 'image',
            image_url: reportPortfoliosImageUrl,
            alt_text: 'Danh mục đầu tư trong tuần',
          });
        } else {
          reportData.blocks.push({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Hiện tại không có mã cổ phiếu nào trong danh mục',
            },
          });
        }

        const reportSellProfitImageUrl =
          await this.getReportSellProfit(dataDto);
        if (reportSellProfitImageUrl) {
          reportData.blocks.push({
            type: 'image',
            image_url: reportSellProfitImageUrl,
            alt_text: 'Báo cáo lãi/lỗ trong tuần',
          });
        } else {
          reportData.blocks.push({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Hiện tại không có lệnh bán nào trong tuần',
            },
          });
        }

        console.log(reportData.blocks);

        await this.slackService.sendMessage(reportData, slackWebhookUrl);
      }
      return true;
    } catch (error) {
      console.error('Error in processMonthlyCron', error.message);
      return false;
    }
  }

  async getReportPortfolio(user: UserDataDto) {
    try {
      const portfolios = await this.portfolioService.find({
        where: {
          createdUser: user.id,
        },
        order: {
          stockCode: 'desc',
        },
      });

      if (portfolios.length === 0) {
        return null;
      }

      const reportPortfolios: PortfolioReportType[] = portfolios.map(
        (portfolio) => {
          return {
            ...portfolio,
            price: Number(formatPrice(portfolio.price)),
            percent: getPortfolioPercentage(
              portfolio.price,
              portfolio.volume,
              user.userInfo.nav,
            ),
            status: 'Nắm giữ',
          };
        },
      );

      const res: AxiosResponse<UploadImageReportResType> = await axios.post(
        `${process.env.NEST_PUBLIC_REPORT_URL}/generate-portfolio-report`,
        reportPortfolios,
      );

      return res.data.url;
    } catch (error) {
      console.error('Error in report portfolio', error.message);
      return null;
    }
  }

  async getReportSellProfit(user: UserDataDto) {
    try {
      const now = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);

      const transactions = await this.stockOrderTransactionService.find({
        where: {
          createdUser: user.id,
          side: StockOrderSide.SELL,
          createdAt: And(MoreThan(start), LessThanOrEqual(now)),
        },
        order: {
          stockCode: 'desc',
        },
      });

      if (transactions.length === 0) {
        return null;
      }

      const sellProfitTransactions: SellProfitReportTransactionType[] =
        transactions.map((transaction) => {
          const profit =
            (transaction.orderPrice - transaction.avgPrice) *
              transaction.orderVolume -
            transaction.tax -
            transaction.fee;

          const profitPercent =
            (profit / (transaction.avgPrice * transaction.orderVolume)) * 100;

          return {
            stockCode: transaction.stockCode,
            avgPrice: Number(formatPrice(transaction.avgPrice)),
            sellPrice: Number(formatPrice(transaction.orderPrice)),
            volume: transaction.orderVolume,
            status: 'Đã bán',
            profit,
            profitPercent,
          };
        });

      const totalProfit = sellProfitTransactions.reduce(
        (acc, transaction) => acc + transaction.profit,
        0,
      );
      const totalProfitPercent = (totalProfit / user.userInfo.nav) * 100;

      const reportSellProfit: SellProfitReportType = {
        totalProfit,
        totalProfitPercent,
        transactions: sellProfitTransactions,
      };

      const res: AxiosResponse<UploadImageReportResType> = await axios.post(
        `${process.env.NEST_PUBLIC_REPORT_URL}/generate-sell-profit-report`,
        reportSellProfit,
      );

      return res.data.url;
    } catch (error) {
      console.error('Error in report sell profit', error);
      return null;
    }
  }
}
