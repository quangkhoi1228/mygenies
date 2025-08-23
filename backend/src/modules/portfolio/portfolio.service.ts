import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindRequestDto } from '../../shared/dto/find-request.dto';
import { CoreService } from '../../shared/modules/routes/core.service';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { StockOrderService } from '../stock-order/stock-order.service';
import { SlackService } from '../third-party/slack/slack.service';
import { UserService } from '../user/user/user.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';

@Injectable()
// @UseGuards(AdminAuthGuard)
export class PortfolioService extends CoreService<Portfolio> {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,

    @Inject(forwardRef(() => StockOrderService))
    private readonly stockOrderService: StockOrderService,

    private readonly userService: UserService,
    private readonly slackService: SlackService,
  ) {
    super(portfolioRepository);
  }

  async create(createPortfolioDto: CreatePortfolioDto, req: AuthRequest) {
    const portfolio = await this.createCoreService(
      [createPortfolioDto],
      req.user.userId,
    );

    return portfolio[0];
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

    const dataWithProfit = await this.updateProfitData(data.data);
    data.data = dataWithProfit;

    console.log(data);

    return data;
  }

  async findOne(id: number) {
    const data = await this.portfolioRepository.findOneBy({ id });
    const dataWithProfit = await this.updateProfitData([data]);

    return dataWithProfit;
  }

  async findOneByStockCode(stockCode: string, req: AuthRequest) {
    return await this.portfolioRepository.findOneBy({
      stockCode,
      createdUser: req.user.userId,
    });
  }

  async updateByStockCode(
    updatePortfolioDto: UpdatePortfolioDto,
    req: AuthRequest,
  ) {
    try {
      const existed = await this.findOneByStockCode(
        updatePortfolioDto.stockCode,
        req,
      );
      if (existed) {
        await this.updateCoreService(
          { stockCode: updatePortfolioDto.stockCode },
          updatePortfolioDto,
          req.user.userId,
        );
      } else {
        await this.createCoreService([updatePortfolioDto], req.user.userId);
      }

      const currentPortfolio = await this.findOneByStockCode(
        updatePortfolioDto.stockCode,
        req,
      );

      if (updatePortfolioDto.volume <= 0) {
        await this.remove(existed.id);
      }

      return currentPortfolio;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    id: number,
    updatePortfolioDto: UpdatePortfolioDto,
    req: AuthRequest,
  ) {
    const existed = await this.findOne(id);

    if (existed) {
      return await this.updateCoreService(
        { id },
        updatePortfolioDto,
        req.user.userId,
      );
    } else {
      throw new BadRequestException('Portfolio not existed');
    }
  }

  async remove(id: number) {
    const removeEntity = await this.portfolioRepository.findOneBy({ id });

    if (removeEntity) {
      return await this.portfolioRepository.remove(removeEntity);
    } else {
      throw new BadRequestException('Portfolio not existed');
    }
  }

  // async processMonthlyCron() {
  //   try {
  //     const users = await this.userService.getRepository().find({
  //       ...this.userService.createDefaultFindOption(),
  //     });

  //     for (const user of users) {
  //       const dataDto = this.userService.convertDataToResponse(user);

  //       const portfolios = await this.portfolioRepository.find({
  //         where: {
  //           createdUser: dataDto.id,
  //         },
  //         order: {
  //           stockCode: 'desc',
  //         },
  //       });

  //       await this.slackService.sendPortfolioSignalMessage(portfolios, dataDto);

  //       // const now = new Date();
  //       // const start = new Date();
  //       // start.setDate(start.getDate() - 7);

  //       // const orders = await this.stockOrderService.getRepository().find({
  //       //   where: {
  //       //     createdUser: dataDto.id,
  //       //     side: StockOrderSide.SELL,
  //       //     createdAt: And(MoreThan(start), LessThanOrEqual(now)),
  //       //   },
  //       //   order: {
  //       //     stockCode: 'desc',
  //       //   },
  //       // });
  //       // await this.slackService.sendSellProfitSignalMessage(
  //       //   portfolios,
  //       //   orders,
  //       //   dataDto,
  //       // );
  //     }
  //   } catch (error) {
  //     console.error('Error in processMonthlyCron', error);
  //   }
  // }

  async updateTransactionPortfolio() {
    const portfolios = await this.portfolioRepository.find();

    console.log(portfolios);

    for (const portfolio of portfolios) {
      const updatedPortfolio: Portfolio = {
        ...portfolio,
        t0Volume: 0,
        t1Volume: portfolio.t0Volume,
        t2Volume: portfolio.t1Volume,
        t3Volume: portfolio.t3Volume + portfolio.t2Volume,
      };

      await this.updateCoreService(
        { id: portfolio.id },
        updatedPortfolio,
        portfolio.createdUser,
      );
    }
  }

  async searchPriceByStockCode(query: string) {
    const url = `https://iboard-query.ssi.com.vn/stock/${query}`;

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

  async updateProfitData(portfolios: Portfolio[]) {
    const data = await Promise.allSettled(
      portfolios.map((item) => this.searchPriceByStockCode(item.stockCode)),
    );

    const dataMatchedPrice = data
      .filter((item) => item.status === 'fulfilled')
      .reduce((a, v) => {
        if (v.value.data?.stockSymbol && v.value.data?.matchedPrice) {
          a[v.value.data.stockSymbol] = v.value.data.matchedPrice;
        }

        return a;
      }, {});

    const result = portfolios.map((item) => {
      const basePrice = item.price * item.volume;
      const currentPrice =
        (dataMatchedPrice[item.stockCode] ?? item.price) * item.volume;

      const profit = currentPrice - basePrice;
      const profitPercent = +(
        ((currentPrice - basePrice) / basePrice) *
        100
      ).toFixed(2);

      return {
        ...item,
        profit,
        profitPercent,
      };
    });

    return result;
  }
}
