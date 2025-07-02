import { Test, TestingModule } from '@nestjs/testing';
import { UserConversationTopicHistoryLogService } from './user-conversation-topic-history-log.service';

describe('UserConversationTopicHistoryLogService', () => {
  let service: UserConversationTopicHistoryLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserConversationTopicHistoryLogService],
    }).compile();

    service = module.get<UserConversationTopicHistoryLogService>(
      UserConversationTopicHistoryLogService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
