import { Test, TestingModule } from '@nestjs/testing';
import { StockOrderTransactionController } from './stock-order-transaction.controller';
import { StockOrderTransactionService } from './stock-order-transaction.service';

describe('StockOrderTransactionController', () => {
  let controller: StockOrderTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockOrderTransactionController],
      providers: [StockOrderTransactionService],
    }).compile();

    controller = module.get<StockOrderTransactionController>(
      StockOrderTransactionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
