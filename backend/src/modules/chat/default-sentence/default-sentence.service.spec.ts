import { Test, TestingModule } from '@nestjs/testing';
import { DefaultSentenceService } from './default-sentence.service';
import { DefaultSentence } from './entities/default-sentence.entity';
import { Repository } from 'typeorm';
import {
  defaultEntityData,
  mockAuthRequest,
  mockPaginationMeta,
} from '../../../test/mockData';
import { SentenceAudio, SentenceType } from './dto/create-default-sentence.dto';
import { FindResponseDto } from '../../../shared/dto/find-response.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AIService } from '../../ai/ai.service';
import { GroqService } from '../../third-party/groq/groq.service';
import { ConvexService } from '../../third-party/convex/convex.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AudioService } from '../../audio/audio.service';
import { AiBuilderService } from '../../ai/ai-builder.service';

describe('DefaultSentenceService', () => {
  let service: DefaultSentenceService;
  let repo: Repository<DefaultSentence>;

  const mockData: DefaultSentence = {
    type: SentenceType.hello,
    sentence: 'hello',
    translate: '',
    audio: new SentenceAudio(),
    hint: '',
    id: 1,
    ...defaultEntityData,
  };

  const mockPaginationData: FindResponseDto<DefaultSentence> = {
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

  const mockCacheManager = () => ({
    get: jest.fn(),
    set: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DefaultSentenceService,
        AIService,
        AiBuilderService,
        GroqService,
        ConvexService,
        AudioService,
        { provide: getRepositoryToken(DefaultSentence), useValue: mockRepo },
        { provide: CACHE_MANAGER, useValue: mockCacheManager() },
      ],
    }).compile();

    service = module.get<DefaultSentenceService>(DefaultSentenceService);
    repo = module.get<Repository<DefaultSentence>>(
      getRepositoryToken(DefaultSentence),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  // it('should create a defaultSentence', async () => {
  //   const result = await service.create(mockData);

  //   expect(repo.create).toHaveBeenCalledWith([mockData]);
  //   expect(repo.save).toHaveBeenCalledWith(mockData, { transaction: true });
  //   expect(result).toEqual(mockData);
  // });

  it('should find pagination', async () => {
    const result = await service.findAll(mockAuthRequest);
    expect(result.data).toEqual([mockData]);
    expect(result).toEqual(mockPaginationData);
  });

  it('should find one defaultSentence by ID', async () => {
    const result = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockData);
  });

  // it('should update a defaultSentence', async () => {
  //   const result = await service.update(1, { sentence: 'Updated' });
  //   expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  //   expect(repo.update).toHaveBeenCalledWith(
  //     { id: 1 },
  //     { title: 'Updated', updatedAt: expect.any(Date), updatedUser: 0 },
  //   );
  //   expect(result).toEqual({ affected: 1 });
  // });

  it('should delete a defaultSentence', async () => {
    const result = await service.remove(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.remove).toHaveBeenCalledWith(mockData);
    expect(result).toEqual({ affected: 1 });
  });
});
