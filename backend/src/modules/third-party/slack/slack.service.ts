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

@Injectable()
export class SlackService {
  async sendStockSignalMessage(
    stockOrder: StockOrder,
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
        `*${sideVi}:* ${stockOrder.stockCode}\n` +
        `*KL:* ${formatVolume(stockOrder.volume)} — *Giá:* ${formatPrice(
          processPrice,
        )}\n` +
        `*%NAV:* ${navPercent} - _${note}_`;

      return await this.sendMessage(previewText, detail, slackWebhookUrl);
    } catch (error) {
      console.error(error);
    }
  }

  async sendPortfolioSignalMessage(portfolios: Portfolio[], user: UserDataDto) {
    const { slackWebhookUrl, nav } = user.userInfo;

    if (!slackWebhookUrl) {
      console.warn('Slack webhook URL not set');
      return;
    }

    const data = portfolios
      .filter((item) => item.volume > 0)
      .reduce((a, v) => {
        const navPercent = getPortfolioPercentage(
          v.price * 1000,
          v.volume,
          nav,
        );

        const str = `${v.stockCode} - ${formatPrice(v.price * 1000)} - ${formatVolume(v.volume)} - ${navPercent}\n`;

        a += `${str}\n`;

        return a;
      }, ``);

    return await this.sendMessage(
      `Portfolio ${formatDateToDDMMYYYY(new Date())}`,
      `Portfolio ${formatDateToDDMMYYYY(new Date())}:\n\n` +
        `Mã - Giá - KL - %NAV\n` +
        '```' +
        `${data}` +
        '```',
      slackWebhookUrl,
    );
  }

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

    const data = portfolios.reduce((a, v) => {
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

    return await this.sendMessage(
      `Báo cáo lãi lỗ ${formatDateToDDMMYYYY(new Date())}`,
      `Báo cáo lãi lỗ ${formatDateToDDMMYYYY(new Date())}:\n\n` +
        `Mã - Giá vốn - Giá bán - KL - Lãi - Lãi/NAV\n` +
        '```' +
        `${data}` +
        '```',
      slackWebhookUrl,
    );
  }

  async sendMessage(
    previewText: string,
    detail: string,
    webhooks: SlackWebhookUrlType[],
  ) {
    for (const webhook of webhooks) {
      if (webhook.url) {
        try {
          // const result = await axios.post(webhook.url, {
          //   text,
          // });

          const result = await axios.post(
            webhook.url,
            JSON.stringify({
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
            }),
          );

          return result;
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}
