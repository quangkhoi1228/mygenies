import { Test, TestingModule } from '@nestjs/testing';
import { UserActiveAiService } from './user-active-ai.service';

describe('UserActiveAiService', () => {
  let service: UserActiveAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserActiveAiService],
    }).compile();

    service = module.get<UserActiveAiService>(UserActiveAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
