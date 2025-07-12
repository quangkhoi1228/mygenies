import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Portfolio } from 'src/modules/portfolio/entities/portfolio.entity';
import {
  StockOrder,
  StockOrderSide,
} from 'src/modules/stock-order/entities/stock-order.entity';
import {
  SlackWebhookUrlType,
  UserDataDto,
} from 'src/modules/user/user/dto/create-user.dto';
import { formatDateToDDMMYYYY } from 'src/utils/date.util';
import {
  formatPrice,
  formatVolume,
  getPortfolioPercentage,
} from 'src/utils/financeUtils';
import { isNotEmpty } from 'src/utils/object.util';
import { ConvexService } from '../convex/convex.service';
import { CreateStockOrderDto } from 'src/modules/stock-order/dto/create-stock-order.dto';

@Injectable()
export class SlackService {
  constructor(private readonly convexService: ConvexService) {}
  async sendStockSignalMessage(
    stockOrder: CreateStockOrderDto,
    portfolio: Portfolio,
    user: UserDataDto,
  ) {
    try {
      const { slackWebhookUrl, nav } = user.userInfo;

      console.log(stockOrder, portfolio, user);
      const processPrice = stockOrder.price * 1000;

      if (!isNotEmpty(slackWebhookUrl)) {
        console.warn('Slack webhook URL not set');
        return;
      }

      const navPercent = getPortfolioPercentage(
        processPrice,
        stockOrder.volume,
        nav,
      );
      const sideVi = stockOrder.side === StockOrderSide.BUY ? 'MUA' : 'BÁN';
      const note =
        stockOrder.side === StockOrderSide.BUY
          ? portfolio.volume === stockOrder.volume
            ? 'Mới'
            : 'Thêm'
          : portfolio.volume === 0
            ? 'Hết'
            : 'Giảm';

      const previewText = `${sideVi}: ${stockOrder.stockCode} - KL: ${formatVolume(stockOrder.volume)} - Giá: ${formatPrice(processPrice)} - %NAV: ${navPercent} - ${note}`;
      const detail =
        `_*${sideVi}:*_ ${stockOrder.stockCode}\n` +
        `*KL:* ${formatVolume(stockOrder.volume)} — *Giá:* ${formatPrice(
          processPrice,
        )}\n` +
        `*%NAV:* ${navPercent} - _${note}_`;

      const data = {
        text: previewText,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: detail,
            },
          },
        ],
      };

      return await this.sendMessage(data, slackWebhookUrl);
    } catch (error) {
      console.error(error);
    }
  }

  // async sendPortfolioSignalMessage(portfolios: Portfolio[], user: UserDataDto) {
  //   try {
  //     console.log('sendPortfolioSignalMessage', portfolios);
  //     const { slackWebhookUrl, nav } = user.userInfo;

  //     if (!slackWebhookUrl) {
  //       console.warn('Slack webhook URL not set');
  //       return;
  //     }

  //     const portfolioReportData: PortfolioReportType[] = portfolios.reduce(
  //       (pre, current) => {
  //         const reportPortfolioItem: PortfolioReportType = {
  //           ...current,
  //           percent: '',
  //         };
  //         const navPercent = getPortfolioPercentage(
  //           reportPortfolioItem.price,
  //           reportPortfolioItem.volume,
  //           nav,
  //         );

  //         reportPortfolioItem.percent = navPercent;

  //         pre.push(reportPortfolioItem);

  //         return pre;
  //       },
  //       [],
  //     );

  //     console.log(portfolioReportData);
  //     if (portfolioReportData.length > 0) {
  //     }
  //     const response = await axios.post(
  //       `${process.env.NEST_PUBLIC_REPORT_URL}/generate-portfolio-report`,
  //       portfolioReportData,
  //     );

  //     console.log(response.data);

  //     return await this.sendMessage(
  //       {
  //         text: `Báo cáo portfolio ${formatDateToDDMMYYYY(new Date())}`,
  //         blocks: [
  //           {
  //             type: 'image',
  //             image_url: response.data.url,
  //             alt_text: 'Mô tả ảnh',
  //           },
  //         ],
  //       },
  //       slackWebhookUrl,
  //     );
  //   } catch (error) {
  //     console.error(error);
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  async sendSellProfitSignalMessage(
    portfolios: Portfolio[],
    orders: StockOrder[],
    user: UserDataDto,
  ) {
    const { slackWebhookUrl, nav } = user.userInfo;

    if (!slackWebhookUrl) {
      console.warn('Slack webhook URL not set');
      return;
    }

    const profitReportData = portfolios.reduce((a, v) => {
      const sellOrders = orders.filter(
        (item) => item.stockCode === v.stockCode,
      );

      if (sellOrders.length > 0) {
        const sellVolume = sellOrders.reduce((sa, sv) => {
          return (sa += sv.volume);
        }, 0);
        const sellPrice =
          sellOrders.reduce((sa, sv) => {
            return (sa += sv.price * sv.volume);
          }, 0) / sellVolume;

        const profit = (sellPrice - v.price) * sellVolume;
        const profitPercent = (profit / nav) * 100;

        const str = `${v.stockCode} - ${formatPrice(v.price * 1000)} - ${formatPrice(sellPrice * 1000)} - ${formatVolume(sellVolume)} - ${formatPrice(profit)} - ${profitPercent}\n`;

        a += `${str}\n`;
      }

      return a;
    }, ``);

    const data = {
      text:
        `Báo cáo lãi lỗ ${formatDateToDDMMYYYY(new Date())}:\n\n` +
        `Mã - Giá vốn - Giá bán - KL - Lãi - Lãi/NAV\n` +
        '```' +
        `${profitReportData}` +
        '```',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text:
              `Báo cáo lãi lỗ ${formatDateToDDMMYYYY(new Date())}:\n\n` +
              `Mã - Giá vốn - Giá bán - KL - Lãi - Lãi/NAV\n` +
              '```' +
              `${profitReportData}` +
              '```',
          },
        },
      ],
    };

    return await this.sendMessage(data, slackWebhookUrl);
  }

  async sendMessage(detail: any, webhooks: SlackWebhookUrlType[]) {
    for (const webhook of webhooks) {
      if (webhook.url) {
        try {
          const result = await axios.post(webhook.url, detail);

          return result;
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}
