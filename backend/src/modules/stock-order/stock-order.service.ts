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
import { PortfolioService } from '../portfolio/portfolio.service';
import { CreateStockOrderDto } from './dto/create-stock-order.dto';
import { UpdateStockOrderDto } from './dto/update-stock-order.dto';
import { StockOrder, StockOrderSide } from './entities/stock-order.entity';
import { UpdatePortfolioDto } from '../portfolio/dto/update-portfolio.dto';
import { SlackService } from '../third-party/slack/slack.service';
import { UserService } from '../user/user/user.service';
import { Portfolio } from '../portfolio/entities/portfolio.entity';
import { StockOrderTransactionService } from '../stock-transaction/stock-order-transaction.service';

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
  ) {
    super(stockOrderRepository);
  }

  async create(createStockOrderDto: CreateStockOrderDto, req: AuthRequest) {
    const { stockCode, side, volume, price } = createStockOrderDto;
    if (volume % 100 !== 0) {
      throw new BadRequestException('Volume must be a multiple of 100');
    }

    const processPrice = price * 1000;

    const user = await this.userService.currentUser(req);

    const order = await this.createCoreService(
      [createStockOrderDto],
      req.user.userId,
    );

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

      const updatedPortfolioDto: UpdatePortfolioDto = {
        stockCode,
        volume: prevPortfolio.volume - volume,
        price: prevPortfolio.price,
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

    this.slackService.sendStockSignalMessage(order[0], updatedPortfolio, user);

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
}
