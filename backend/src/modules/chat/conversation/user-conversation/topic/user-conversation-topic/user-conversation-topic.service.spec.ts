import { Test, TestingModule } from '@nestjs/testing';
import { UserConversationTopicService } from './user-conversation-topic.service';
import { UserConversationTopic } from './entities/user-conversation-topic.entity';
import {
  defaultEntityData,
  mockAuthRequest,
  mockPaginationMeta,
} from '../../../../../../test/mockData';
import { FindResponseDto } from '../../../../../../shared/dto/find-response.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockUser } from '../../../../../user/user.spec';

describe('UserConversationTopicService', () => {
  let service: UserConversationTopicService;
  let repo: Repository<UserConversationTopic>;

  const mockData: UserConversationTopic = {
    ...defaultEntityData,
    name: '',
    scenario: '',
    userRole: '',
    systemRole: '',
    userId: mockUser.id,
    id: 1,
  };

  const mockPaginationData: FindResponseDto<UserConversationTopic> = {
    data: [mockData],
    meta: {
      ...mockPaginationMeta,
      filter: {
        userId: {
          operator: '=',
          value: mockUser.id,
        },
      },
    },
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
        UserConversationTopicService,
        {
          provide: getRepositoryToken(UserConversationTopic),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UserConversationTopicService>(
      UserConversationTopicService,
    );
    repo = module.get<Repository<UserConversationTopic>>(
      getRepositoryToken(UserConversationTopic),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  it('should create a userConversationTopic', async () => {
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

  it('should find one userConversationTopic by ID', async () => {
    const result = await service.findOne(1, mockAuthRequest);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
    expect(result).toEqual(mockData);
  });

  it('should update a userConversationTopic', async () => {
    const result = await service.update(
      1,
      { name: 'Updated' },
      mockAuthRequest,
    );
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
    expect(repo.update).toHaveBeenCalledWith(
      { id: 1 },
      {
        name: 'Updated',
        updatedAt: expect.any(Date),
        updatedUser: 0,
      },
    );
    expect(result).toEqual({ affected: 1 });
  });

  it('should delete a userConversationTopic', async () => {
    const result = await service.remove(1, mockAuthRequest);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1, userId: 1 });
    expect(repo.remove).toHaveBeenCalledWith(mockData);
    expect(result).toEqual({ affected: 1 });
  });
});
