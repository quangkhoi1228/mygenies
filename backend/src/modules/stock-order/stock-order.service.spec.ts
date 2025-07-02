import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindResponseDto } from '../../shared/dto/find-response.dto';
import {
  defaultEntityData,
  mockAuthRequest,
  mockPaginationMeta,
} from '../../test/mockData';
import { StockOrderService } from './stock-order.service';
import {
  StockOrder,
  StockOrderSide,
  StockOrderType,
} from './entities/stock-order.entity';

describe('StockOrderService', () => {
  let service: StockOrderService;
  let repo: Repository<StockOrder>;

  const mockData: StockOrder = {
    stockCode: 'stockCode',
    side: StockOrderSide.BUY,
    type: StockOrderType.LO,
    volume: 1,
    price: 1,
    id: 1,
    ...defaultEntityData,
  };

  const mockPaginationData: FindResponseDto<StockOrder> = {
    data: [mockData],
    meta: mockPaginationMeta,
  };

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockData),
    save: jest.fn().mockResolvedValue([mockData]),
    findAndCount: jest.fn().mockResolvedValue([[mockData], 1]),
    findOneBy: jest.fn().mockResolvedValue(mockData),
    findOne: jest.fn().mockResolvedValue(mockData),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockOrderService,
        { provide: getRepositoryToken(StockOrder), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<StockOrderService>(StockOrderService);
    repo = module.get<Repository<StockOrder>>(getRepositoryToken(StockOrder));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  it('should create a appConfig', async () => {
    const result = await service.create(mockData, mockAuthRequest);

    expect(repo.create).toHaveBeenCalledWith([mockData]);
    expect(repo.save).toHaveBeenCalledWith(mockData, { transaction: true });
    expect(result).toEqual(mockData);
  });

  it('should find pagination', async () => {
    const result = await service.findAll(mockAuthRequest);
    expect(result.data).toEqual([mockData]);
    expect(result).toEqual(mockPaginationData);
  });

  it('should find one appConfig by ID', async () => {
    const result = await service.findOne(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockData);
  });

  it('should update a appConfig', async () => {
    const result = await service.update(
      1,
      { stockCode: 'Updated' },
      mockAuthRequest,
    );
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.update).toHaveBeenCalledWith(
      { id: 1 },
      { stockCode: 'Updated', updatedAt: expect.any(Date), updatedUser: 0 },
    );
    expect(result).toEqual({ affected: 1 });
  });

  it('should delete a appConfig', async () => {
    const result = await service.remove(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.remove).toHaveBeenCalledWith(mockData);
    expect(result).toEqual({ affected: 1 });
  });
});
