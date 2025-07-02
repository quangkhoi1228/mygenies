import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindRequestDto } from '../../shared/dto/find-request.dto';
import { CoreService } from '../../shared/modules/routes/core.service';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { CreateStockOrderDto } from './dto/create-stock-order.dto';
import { UpdateStockOrderDto } from './dto/update-stock-order.dto';
import { StockOrder } from './entities/stock-order.entity';

@Injectable()
// @UseGuards(AdminAuthGuard)
export class StockOrderService extends CoreService<StockOrder> {
  constructor(
    @InjectRepository(StockOrder)
    private readonly stockOrderRepository: Repository<StockOrder>,
  ) {
    super(stockOrderRepository);
  }

  async create(createStockOrderDto: CreateStockOrderDto, req: AuthRequest) {
    const stockOrder = await this.createCoreService(
      [createStockOrderDto],
      req.user.userId,
    );

    return stockOrder[0];
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
