import { Test, TestingModule } from '@nestjs/testing';
import { ConversationProcessService } from './conversation-process.service';

describe('ConversationProcessService', () => {
  let service: ConversationProcessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationProcessService],
    }).compile();

    service = module.get<ConversationProcessService>(
      ConversationProcessService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
