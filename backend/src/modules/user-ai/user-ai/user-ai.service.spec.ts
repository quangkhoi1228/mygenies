import { Test, TestingModule } from '@nestjs/testing';
import { UserAiService } from './user-ai.service';

describe('UserAiService', () => {
  let service: UserAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAiService],
    }).compile();

    service = module.get<UserAiService>(UserAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
