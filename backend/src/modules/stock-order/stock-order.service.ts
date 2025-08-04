import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNotEmpty } from 'class-validator';
import {
  formatPrice,
  formatVolume,
  getPercentage,
  getPortfolioPercentage,
} from 'src/utils/financeUtils';
import { Repository } from 'typeorm';
import { FindRequestDto } from '../../shared/dto/find-request.dto';
import { CoreService } from '../../shared/modules/routes/core.service';
import { AppConfigService } from '../app-config/app-config.service';
import { AppConfigName } from '../app-config/dto/create-app-config.dto';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { UpdatePortfolioDto } from '../portfolio/dto/update-portfolio.dto';
import { Portfolio } from '../portfolio/entities/portfolio.entity';
import { PortfolioService } from '../portfolio/portfolio.service';
import { StockOrderTransactionService } from '../stock-transaction/stock-order-transaction.service';
import { SlackService } from '../third-party/slack/slack.service';
import { UserDataDto } from '../user/user/dto/create-user.dto';
import { UserService } from '../user/user/user.service';
import { CreateStockOrderDto } from './dto/create-stock-order.dto';
import { UpdateStockOrderDto } from './dto/update-stock-order.dto';
import { StockOrder, StockOrderSide } from './entities/stock-order.entity';

@Injectable()
// @UseGuards(AdminAuthGuard)
export class StockOrderService extends CoreService<StockOrder> {
  constructor(
    @InjectRepository(StockOrder)
    private readonly stockOrderRepository: Repository<StockOrder>,

    @Inject(forwardRef(() => PortfolioService))
    private readonly portfolioService: PortfolioService,

    private readonly userService: UserService,
    private readonly slackService: SlackService,
    private readonly stockOrderTransactionService: StockOrderTransactionService,
    private readonly appConfigService: AppConfigService,
  ) {
    super(stockOrderRepository);
  }

  async create(createStockOrderDto: CreateStockOrderDto, req: AuthRequest) {
    const { stockCode, side, volume, price } = createStockOrderDto;
    if (volume % 100 !== 0) {
      throw new BadRequestException('Volume must be a multiple of 100');
    }

    const feeConfig = await this.appConfigService.findOneByName(
      AppConfigName.FEE,
    );

    const feeRate = Number(feeConfig.value);

    const processPrice = parseInt((price * 1000 * (1 + feeRate)).toString());

    const user = await this.userService.currentUser(req);

    const newStockOrder = {
      ...createStockOrderDto,
      price: processPrice,
    };
    await this.createCoreService([newStockOrder], req.user.userId);

    let prevPortfolio: Portfolio = null;
    let updatedPortfolio: Portfolio = null;

    // check out of money
    if (side === StockOrderSide.BUY.toString()) {
      prevPortfolio = await this.portfolioService.findOneByStockCode(
        stockCode,
        req,
      );
      let updatedPortfolioDto: UpdatePortfolioDto;
      if (!prevPortfolio) {
        updatedPortfolioDto = {
          stockCode,
          volume,
          price: processPrice,
          t0Volume: volume,
          t1Volume: 0,
          t2Volume: 0,
          t3Volume: 0,
        };
      } else {
        updatedPortfolioDto = {
          stockCode,
          volume: prevPortfolio.volume + volume,
          price: Math.round(
            (prevPortfolio.price * prevPortfolio.volume +
              processPrice * volume) /
              (prevPortfolio.volume + volume),
          ),
          t0Volume: (prevPortfolio.t0Volume ?? 0) + volume,
          t1Volume: prevPortfolio.t1Volume ?? 0,
          t2Volume: prevPortfolio.t2Volume ?? 0,
          t3Volume: prevPortfolio.t3Volume ?? 0,
        };
      }
      const newPortfolio = await this.portfolioService.updateByStockCode(
        updatedPortfolioDto,
        req,
      );

      updatedPortfolio = newPortfolio;
    } else if (side === StockOrderSide.SELL.toString()) {
      prevPortfolio = await this.portfolioService.findOneByStockCode(
        stockCode,
        req,
      );
      if (!prevPortfolio) {
        throw new BadRequestException('Stock code not found');
      }

      if (prevPortfolio.volume < volume) {
        throw new BadRequestException('Insufficient volume');
      }
      let remain = volume;
      let newT3Volume = 0;
      let newT2Volume = prevPortfolio.t2Volume;
      let newT1Volume = prevPortfolio.t1Volume;
      let newT0Volume = prevPortfolio.t0Volume;

      if (prevPortfolio.t3Volume >= remain) {
        newT3Volume = prevPortfolio.t3Volume - remain;
      } else {
        newT3Volume = 0;
        remain = remain - prevPortfolio.t3Volume;
        if (prevPortfolio.t2Volume >= remain) {
          newT2Volume = prevPortfolio.t2Volume - remain;
        } else {
          newT2Volume = 0;
          remain = remain - prevPortfolio.t2Volume;
          if (prevPortfolio.t1Volume >= remain) {
            newT1Volume = prevPortfolio.t1Volume - remain;
          } else {
            newT1Volume = 0;
            remain = remain - prevPortfolio.t1Volume;
            newT0Volume = prevPortfolio.t0Volume - remain;
          }
        }
      }

      const updatedPortfolioDto: UpdatePortfolioDto = {
        stockCode,
        volume: prevPortfolio.volume - volume,
        price: prevPortfolio.price,
        t3Volume: newT3Volume,
        t2Volume: newT2Volume,
        t1Volume: newT1Volume,
        t0Volume: newT0Volume,
      };

      updatedPortfolio = await this.portfolioService.updateByStockCode(
        updatedPortfolioDto,
        req,
      );
    }

    await this.stockOrderTransactionService.createByStockOrder(
      createStockOrderDto,
      prevPortfolio,
      updatedPortfolio,
      req,
    );

    await this.sendStockSignalMessage(
      createStockOrderDto,
      updatedPortfolio,
      user,
    );

    return true;
  }

  // async createOrUpdateConfig(
  //   createStockOrderDto: CreateStockOrderDto,
  //   req: AuthRequest,
  // ) {
  //   const existed = await this.findOneByName(createStockOrderDto);

  //   if (existed) {
  //     await this.update(existed.id, createAppConfigDto, req);
  //     return await this.findOneByName(createAppConfigDto.name);
  //   } else {
  //     return await this.create(createAppConfigDto, req);
  //   }
  // }

  async findAll(req: AuthRequest) {
    const findRequestDto = new FindRequestDto(req);

    const data = await this.findAllCoreServiceByFindRequestDto(findRequestDto, {
      where: {
        createdUser: req.user.userId,
      },
    });

    return data;
  }

  async findOne(id: number) {
    return await this.stockOrderRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateStockOrderDto: UpdateStockOrderDto,
    req: AuthRequest,
  ) {
    const existed = await this.findOne(id);

    if (existed) {
      return await this.updateCoreService(
        { id },
        updateStockOrderDto,
        req.user.userId,
      );
    } else {
      throw new BadRequestException('Stock order not existed');
    }
  }

  async remove(id: number) {
    const removeEntity = await this.stockOrderRepository.findOneBy({ id });

    if (removeEntity) {
      return await this.stockOrderRepository.remove(removeEntity);
    } else {
      throw new BadRequestException('Stock order not existed');
    }
  }

  async searchStockCode(query: string) {
    const url = `https://iboard-query.ssi.com.vn/stock/stock-info?limit=25&query=${query}&exchange=&language=vi&types[]=s`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json, text/plain, */*',
          origin: 'https://iboard.ssi.com.vn',
          referer: 'https://iboard.ssi.com.vn/',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        },
      });

      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Proxy error:', error);
      return { error: 'Failed to fetch data' + error.message };
    }
  }

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

      const portfolios = await this.portfolioService.find({
        where: {
          createdUser: user.id,
        },
      });

      const portfolioValue = portfolios.reduce((pre, current) => {
        return pre + current.price * current.volume;
      }, 0);

      const portfolioValuePercent = getPercentage(portfolioValue, nav);

      const previewText = `${sideVi}: ${stockOrder.stockCode} - KL: ${formatVolume(stockOrder.volume)} - Giá: ${formatPrice(processPrice)} - %NAV: ${navPercent} - ${note} - %CP/NAV: ${portfolioValuePercent}`;
      const detail =
        `_*${sideVi}:*_ ${stockOrder.stockCode}\n` +
        `*KL:* ${formatVolume(stockOrder.volume)} — *Giá:* ${formatPrice(
          processPrice,
        )}\n` +
        `*%NAV:* ${navPercent} - _${note}_ \n` +
        `*%CP/NAV:* ${portfolioValuePercent}`;

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

      return await this.slackService.sendMessage(data, slackWebhookUrl);
    } catch (error) {
      console.error(error);
    }
  }
}
