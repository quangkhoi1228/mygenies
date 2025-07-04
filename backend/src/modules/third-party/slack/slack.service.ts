import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Portfolio } from 'src/modules/portfolio/entities/portfolio.entity';
import {
  StockOrder,
  StockOrderSide,
} from 'src/modules/stock-order/entities/stock-order.entity';
import { UserDataDto } from 'src/modules/user/user/dto/create-user.dto';
import { formatDateToDDMMYYYY } from 'src/utils/date.util';
import { numberWithCommas } from 'src/utils/number.utils';

const NAV = 2000000;
@Injectable()
export class SlackService {
  async sendStockSignalMessage(
    stockOrder: StockOrder,
    portfolio: Portfolio,
    user: UserDataDto,
  ) {
    const { slackWebhookUrl } = user.userInfo;

    if (!slackWebhookUrl) {
      console.warn('Slack webhook URL not set');
      return;
    }

    const navPercent = (stockOrder.price * stockOrder.volume) / NAV;
    const sideVi =
      stockOrder.side === StockOrderSide.BUY
        ? 'MUA'
        : stockOrder.side === StockOrderSide.SELL
          ? 'BÁN'
          : 'BÁN';
    const note =
      stockOrder.side === StockOrderSide.BUY
        ? portfolio.volume === stockOrder.volume
          ? 'Mới'
          : 'Thêm'
        : portfolio.volume === 0
          ? 'Hết'
          : 'Một phần';

    const text =
      `_*${sideVi}:*_ ${stockOrder.stockCode}\n` +
      `*KL:* ${numberWithCommas(stockOrder.volume)} — *Giá:* ${numberWithCommas(stockOrder.price)}\n` +
      `*%NAV:* ${numberWithCommas(navPercent)}% - _${note}_`;

    return await this.sendMessage(text, slackWebhookUrl);
  }

  async sendPortfolioSignalMessage(portfolios: Portfolio[], user: UserDataDto) {
    const { slackWebhookUrl } = user.userInfo;

    if (!slackWebhookUrl) {
      console.warn('Slack webhook URL not set');
      return;
    }

    const data = portfolios
      .filter((item) => item.volume > 0)
      .reduce((a, v) => {
        const navPercent = (v.price * v.volume) / NAV;

        const str = `${v.stockCode} - ${numberWithCommas(v.price)} - ${numberWithCommas(v.volume)} - ${numberWithCommas(navPercent)}%\n`;

        a += `${str}\n`;

        return a;
      }, ``);

    return await this.sendMessage(
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
    const { slackWebhookUrl } = user.userInfo;

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
        const profitPercent = profit / NAV;

        const str = `${v.stockCode} - ${numberWithCommas(v.price)} - ${numberWithCommas(sellPrice)} - ${numberWithCommas(profit)} - ${numberWithCommas(profitPercent)}%\n`;

        a += `${str}\n`;
      }

      return a;
    }, ``);

    return await this.sendMessage(
      `Sell profit ${formatDateToDDMMYYYY(new Date())}:\n\n` +
        `Mã - Giá vốn - Giá bán - KL - Lãi - Lãi/NAV\n` +
        '```' +
        `${data}` +
        '```',
      slackWebhookUrl,
    );
  }

  async sendMessage(text: string, webhook: string) {
    try {
      const result = await axios.post(webhook, {
        text,
      });

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
