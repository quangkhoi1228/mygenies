import { Test, TestingModule } from '@nestjs/testing';
import { UserAiConfigService } from './user-ai-config.service';

describe('UserAiConfigService', () => {
  let service: UserAiConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAiConfigService],
    }).compile();

    service = module.get<UserAiConfigService>(UserAiConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
