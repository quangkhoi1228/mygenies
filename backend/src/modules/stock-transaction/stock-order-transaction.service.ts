import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindRequestDto } from '../../shared/dto/find-request.dto';
import { CoreService } from '../../shared/modules/routes/core.service';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { Portfolio } from '../portfolio/entities/portfolio.entity';
import { CreateStockOrderDto } from '../stock-order/dto/create-stock-order.dto';
import { CreateStockOrderTransactionDto } from './dto/create-stock-order-transaction.dto';
import { UpdateStockOrderTransactionDto } from './dto/update-stock-order-transaction.dto';
import { StockOrderTransaction } from './entities/stock-order-transaction.entity';
import { AppConfigService } from '../app-config/app-config.service';
import { AppConfigName } from '../app-config/dto/create-app-config.dto';
import { StockOrderSide } from '../stock-order/entities/stock-order.entity';

@Injectable()
// @UseGuards(AdminAuthGuard)
export class StockOrderTransactionService extends CoreService<StockOrderTransaction> {
  constructor(
    @InjectRepository(StockOrderTransaction)
    private readonly stockOrderTransactionRepository: Repository<StockOrderTransaction>,
    private readonly appConfigService: AppConfigService,
  ) {
    super(stockOrderTransactionRepository);
  }

  async create(
    createStockOrderTransactionDto: CreateStockOrderTransactionDto,
    req: AuthRequest,
  ) {
    try {
      const taxConfig = await this.appConfigService.findOneByName(
        AppConfigName.TAX,
      );
      const feeConfig = await this.appConfigService.findOneByName(
        AppConfigName.FEE,
      );

      const taxRate = Number(taxConfig.value);
      const feeRate = Number(feeConfig.value);

      const orderValue =
        createStockOrderTransactionDto.orderPrice *
        createStockOrderTransactionDto.orderVolume;

      const fee = orderValue * feeRate;

      const tax =
        createStockOrderTransactionDto.side === StockOrderSide.SELL
          ? orderValue * taxRate
          : 0;

      const newStockOrderTransaction = {
        ...createStockOrderTransactionDto,
        orderValue,
        tax,
        fee,
      };

      const items = await this.createCoreService(
        newStockOrderTransaction,
        req.user.userId,
      );

      return items[0];
    } catch (error) {
      console.error(error);
    }
  }

  async createByStockOrder(
    stockOrder: CreateStockOrderDto,
    prevPortfolio: Portfolio,
    updatedPortfolio: Portfolio,
    req: AuthRequest,
  ) {
    const transaction = new StockOrderTransaction();
    transaction.stockCode = stockOrder.stockCode;
    transaction.side = stockOrder.side;
    transaction.type = stockOrder.type;
    transaction.orderVolume = stockOrder.volume;
    transaction.orderPrice = stockOrder.price * 1000;
    if (prevPortfolio) {
      transaction.prevVolume = prevPortfolio.volume;
      transaction.prevPrice = prevPortfolio.price;
    } else {
      transaction.prevVolume = 0;
      transaction.prevPrice = 0;
    }
    transaction.avgVolume = updatedPortfolio.volume;
    transaction.avgPrice = updatedPortfolio.price;
    return await this.create(transaction, req);
  }

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
    return await this.stockOrderTransactionRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateStockOrderTransactionDto: UpdateStockOrderTransactionDto,
    req: AuthRequest,
  ) {
    const existed = await this.findOne(id);

    if (existed) {
      return await this.updateCoreService(
        { id },
        updateStockOrderTransactionDto,
        req.user.userId,
      );
    } else {
      throw new BadRequestException('Stock order transaction not existed');
    }
  }

  async remove(id: number) {
    const removeEntity = await this.stockOrderTransactionRepository.findOneBy({
      id,
    });

    if (removeEntity) {
      return await this.stockOrderTransactionRepository.remove(removeEntity);
    } else {
      throw new BadRequestException('Stock order transaction not existed');
    }
  }
}
