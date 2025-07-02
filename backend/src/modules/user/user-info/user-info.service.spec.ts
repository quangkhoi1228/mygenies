import { Test, TestingModule } from '@nestjs/testing';
import { UserInfoService } from './user-info.service';
import { UserInfo } from './entities/user-info.entity';
import { UserService } from '../user/user.service';
import { MetaType } from '../../../shared/interfaces/objectMeta.interface';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockUser, mockUserInfoData } from '../user.spec';

describe('UserInfoService', () => {
  let service: UserInfoService;
  let repo: Repository<UserInfo>;
  let userService: UserService;

  const mockUserService = {
    findOneBy: jest.fn().mockResolvedValue(mockUser),
  };

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockUserInfoData[0]),
    save: jest.fn().mockResolvedValue([mockUserInfoData[0]]),
    find: jest.fn(),
    findAndCount: jest.fn().mockResolvedValue([[mockUserInfoData], 1]),
    findOneBy: jest.fn().mockResolvedValue(mockUserInfoData),
    findOne: jest.fn().mockResolvedValue(mockUserInfoData),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserInfoService,
        { provide: getRepositoryToken(UserInfo), useValue: mockRepo },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<UserInfoService>(UserInfoService);
    repo = module.get<Repository<UserInfo>>(getRepositoryToken(UserInfo));
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should create a userInfo', async () => {
    const result = await service.create(mockUserInfoData[0]);

    expect(repo.create).toHaveBeenCalledWith([mockUserInfoData[0]]);
    expect(repo.save).toHaveBeenCalledWith(mockUserInfoData[0], {
      transaction: true,
    });
    expect(result).toEqual([mockUserInfoData[0]]);
  });

  it('should find all by user', async () => {
    mockRepo.find.mockResolvedValue([
      mockUserInfoData.filter((item) => item.user === mockUser),
    ]);

    const result = await service.findAllByUser(mockUser.id, mockUser.clerkId);
    expect(repo.find).toHaveBeenCalledWith({
      where: {
        user: {
          clerkId: mockUser.clerkId,
          id: mockUser.id,
        },
      },
    });
    expect(result).toEqual([
      mockUserInfoData.filter((item) => item.user === mockUser),
    ]);
  });

  it('should update a appConfig', async () => {
    const result = await service.update(mockUser.id, mockUser.clerkId, {
      key: MetaType.string,
      value: 'Updated',
    });
    expect(repo.update).toHaveBeenCalledWith(
      {
        key: MetaType.string,
        user: {
          id: mockUser.id,
          clerkId: mockUser.clerkId,
        },
      },
      {
        key: MetaType.string,
        value: 'Updated',
        updatedAt: expect.any(Date),
        updatedUser: mockUser.id,
      },
    );
    expect(result).toEqual({ affected: 1 });
  });
});
