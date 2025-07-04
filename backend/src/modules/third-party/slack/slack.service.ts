import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Portfolio } from 'src/modules/portfolio/entities/portfolio.entity';
import { StockOrder } from 'src/modules/stock-order/entities/stock-order.entity';
import { UserDataDto } from 'src/modules/user/user/dto/create-user.dto';
import { formatDateToDDMMYYYY } from 'src/utils/date.util';

@Injectable()
export class SlackService {
  async sendStockSignalMessage(stockOrder: StockOrder, user: UserDataDto) {
    const { slackWebhookUrl } = user.userInfo;

    if (!slackWebhookUrl) {
      console.warn('Slack webhook URL not set');
      return;
    }
    const text = `code: ${stockOrder.stockCode}\nside: ${stockOrder.side}\nvolume: ${stockOrder.volume}\nprice: ${stockOrder.price}`;

    return await this.sendMessage(text, slackWebhookUrl);
  }

  async sendPortfolioSignalMessage(portfolios: Portfolio[], user: UserDataDto) {
    const { slackWebhookUrl } = user.userInfo;

    if (!slackWebhookUrl) {
      console.warn('Slack webhook URL not set');
      return;
    }

    const data = portfolios.reduce((a, v) => {
      const str = `code: ${v.stockCode}\nvolume: ${v.volume}\nprice: ${v.price}`;

      a += `\n${str}\n--------------`;

      return a;
    }, '');

    return await this.sendMessage(
      `Portfolio ${formatDateToDDMMYYYY(new Date())}:\n\n${data}`,
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
