import { Test, TestingModule } from '@nestjs/testing';
import { OnboardPhaseService } from './onboard-phase.service';
import { OnboardPhase } from './entities/onboard-phase.entity';
import {
  OnboardContent,
  OnboardPhaseTemplateEnum,
} from './dto/create-onboard-phase.dto';
import {
  defaultEntityData,
  mockAuthRequest,
  mockPaginationMeta,
} from '../../../test/mockData';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindResponseDto } from '../../../shared/dto/find-response.dto';

describe('OnboardPhaseService', () => {
  let service: OnboardPhaseService;
  let repo: Repository<OnboardPhase>;

  const mockData: OnboardPhase = {
    code: '1',
    title: '',
    description: '',
    content: new OnboardContent(),
    template: OnboardPhaseTemplateEnum.landingPage,
    order: 0,
    id: 1,
    ...defaultEntityData,
  };

  const mockPaginationData: FindResponseDto<OnboardPhase> = {
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
        OnboardPhaseService,
        { provide: getRepositoryToken(OnboardPhase), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<OnboardPhaseService>(OnboardPhaseService);
    repo = module.get<Repository<OnboardPhase>>(
      getRepositoryToken(OnboardPhase),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  it('should create a onboardPhase', async () => {
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

  it('should find one onboardPhase by ID', async () => {
    const result = await service.findOne(1, mockAuthRequest);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockData);
  });

  it('should update a onboardPhase', async () => {
    const result = await service.update(
      1,
      { title: 'Updated' },
      mockAuthRequest,
    );
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.update).toHaveBeenCalledWith(
      { id: 1 },
      { title: 'Updated', updatedAt: expect.any(Date), updatedUser: 0 },
    );
    expect(result).toEqual({ affected: 1 });
  });

  it('should delete a onboardPhase', async () => {
    const result = await service.remove(1, mockAuthRequest);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.remove).toHaveBeenCalledWith(mockData);
    expect(result).toEqual({ affected: 1 });
  });
});
