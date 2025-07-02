import { Test, TestingModule } from '@nestjs/testing';
import { UserAiInfoService } from './user-ai-info.service';

describe('UserAiInfoService', () => {
  let service: UserAiInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAiInfoService],
    }).compile();

    service = module.get<UserAiInfoService>(UserAiInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
