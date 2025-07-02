import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigService } from './app-config.service';
import { AppConfig } from './entities/app-config.entity';
import {
  defaultEntityData,
  mockAuthRequest,
  mockPaginationMeta,
} from '../../test/mockData';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindResponseDto } from '../../shared/dto/find-response.dto';
import { ConfigType } from './dto/create-app-config.dto';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let repo: Repository<AppConfig>;

  const mockData: AppConfig = {
    name: 'name',
    description: '',
    value: '',
    type: ConfigType.string,
    id: 1,
    ...defaultEntityData,
  };

  const mockPaginationData: FindResponseDto<AppConfig> = {
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
        AppConfigService,
        { provide: getRepositoryToken(AppConfig), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
    repo = module.get<Repository<AppConfig>>(getRepositoryToken(AppConfig));
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
    const result = await service.findOne(1, mockAuthRequest);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockData);
  });

  it('should find one appConfig by name', async () => {
    const result = await service.findOneByName('name', mockAuthRequest);
    expect(repo.findOneBy).toHaveBeenCalledWith({ name: 'name' });
    expect(result).toEqual(mockData);
  });

  it('should update a appConfig', async () => {
    const result = await service.update(
      1,
      { description: 'Updated' },
      mockAuthRequest,
    );
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.update).toHaveBeenCalledWith(
      { id: 1 },
      { description: 'Updated', updatedAt: expect.any(Date), updatedUser: 0 },
    );
    expect(result).toEqual({ affected: 1 });
  });

  it('should delete a appConfig', async () => {
    const result = await service.remove(1, mockAuthRequest);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.remove).toHaveBeenCalledWith(mockData);
    expect(result).toEqual({ affected: 1 });
  });
});
