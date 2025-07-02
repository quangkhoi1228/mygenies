import { Test, TestingModule } from '@nestjs/testing';
import { UserAiConfigOptionService } from './user-ai-config-option.service';

describe('UserAiConfigOptionService', () => {
  let service: UserAiConfigOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAiConfigOptionService],
    }).compile();

    service = module.get<UserAiConfigOptionService>(UserAiConfigOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
