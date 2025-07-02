import { Test, TestingModule } from '@nestjs/testing';
import { StockOrderController } from './stock-order.controller';
import { StockOrderService } from './stock-order.service';

describe('StockOrderController', () => {
  let controller: StockOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockOrderController],
      providers: [StockOrderService],
    }).compile();

    controller = module.get<StockOrderController>(StockOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
