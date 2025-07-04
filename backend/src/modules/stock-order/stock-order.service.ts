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
  ) {
    super(stockOrderRepository);
  }

  async create(createStockOrderDto: CreateStockOrderDto, req: AuthRequest) {
    console.log(createStockOrderDto);
    const { stockCode, side, volume, price } = createStockOrderDto;
    if (volume % 100 !== 0) {
      throw new BadRequestException('Volume must be a multiple of 100');
    }

    const user = await this.userService.currentUser(req);

    const order = await this.createCoreService(
      [createStockOrderDto],
      req.user.userId,
    );

    let toCheckPortfolio = null;

    // check out of money
    if (side === StockOrderSide.BUY.toString()) {
      const portfolio =
        await this.portfolioService.findOneByStockCode(stockCode);
      let updatedPortfolioDto: UpdatePortfolioDto;
      if (!portfolio) {
        updatedPortfolioDto = {
          stockCode,
          volume,
          price,
        };
      } else {
        updatedPortfolioDto = {
          stockCode,
          volume: portfolio.volume + volume,
          price: Math.round(
            (portfolio.price * portfolio.volume + price * volume) /
              (portfolio.volume + volume),
          ),
        };
      }
      const newPortfolio = await this.portfolioService.updateByStockCode(
        updatedPortfolioDto,
        req,
      );

      toCheckPortfolio = newPortfolio;
    } else if (side === StockOrderSide.SELL.toString()) {
      const portfolio =
        await this.portfolioService.findOneByStockCode(stockCode);
      if (!portfolio) {
        throw new BadRequestException('Stock code not found');
      }

      if (portfolio.volume < volume) {
        throw new BadRequestException('Insufficient volume');
      }

      const updatedPortfolioDto: UpdatePortfolioDto = {
        stockCode,
        volume: portfolio.volume - volume,
        price: portfolio.price,
      };

      toCheckPortfolio = await this.portfolioService.updateByStockCode(
        updatedPortfolioDto,
        req,
      );
    }

    await this.slackService.sendStockSignalMessage(
      order[0],
      toCheckPortfolio,
      user,
    );

    return toCheckPortfolio;
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

    const data = await this.findAllCoreServiceByFindRequestDto(findRequestDto);

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
}
