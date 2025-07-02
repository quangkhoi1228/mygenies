import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserInfoService } from '../user-info/user-info.service';
import { ClerkService } from '../../third-party/clerk/clerk.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { mockUser, mockUserInfoData } from '../user.spec';
import { UserDataDto } from './dto/create-user.dto';
import { parseByMetaType } from '../../../utils/string.utils';

describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<Repository<User>>;
  let userInfoService: UserInfoService;

  const userInfoData = mockUserInfoData
    .filter((item) => item.user.clerkId === mockUser.clerkId)
    .reduce((a, v) => {
      a[v.key] = parseByMetaType(v.value, v.type);

      return a;
    }, {});

  const mockData: UserDataDto = {
    id: mockUser.id,
    clerkId: mockUser.clerkId,
    userInfo: mockUserInfoData.filter(
      (item) => item.user.clerkId === mockUser.clerkId,
    ),
  };

  const mockDataConvert: UserDataDto = {
    id: mockUser.id,
    clerkId: mockUser.clerkId,
    userInfo: userInfoData,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn().mockResolvedValue(mockData),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserInfoService = {
    findByAuthorId: jest.fn().mockResolvedValue(mockUserInfoData),
  };

  const mockCacheManager = () => ({
    get: jest.fn(),
    set: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserInfoService,
        ClerkService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: UserInfoService,
          useValue: mockUserInfoService,
        },
        { provide: CACHE_MANAGER, useValue: mockCacheManager() },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get(getRepositoryToken(User));
    userInfoService = module.get<UserInfoService>(UserInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
    expect(userInfoService).toBeDefined();
  });

  it('should find one user by ID', async () => {
    const result = await service.findOne(mockUser.id);
    expect(repo.findOne).toHaveBeenCalledWith({
      ...service.createDefaultFindOption(),
      where: {
        id: mockUser.id,
      },
    });
    expect(result).toEqual(mockDataConvert);
  });

  // it('should update a user', async () => {
  //   const result = await service.updateUser(
  //     { description: 'Updated' },
  //     mockAuthRequest,
  //   );
  //   expect(repo.findOne).toHaveBeenCalledWith({ id: 1 });
  //   expect(repo.update).toHaveBeenCalledWith(
  //     { id: 1 },
  //     { description: 'Updated', updatedAt: expect.any(Date), updatedUser: 0 },
  //   );
  //   expect(result).toEqual({ affected: 1 });
  // });
});
