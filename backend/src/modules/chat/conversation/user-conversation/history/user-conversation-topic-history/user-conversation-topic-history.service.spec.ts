import { Test, TestingModule } from '@nestjs/testing';
import { UserConversationTopicHistoryService } from './user-conversation-topic-history.service';

describe('UserConversationTopicHistoryService', () => {
  let service: UserConversationTopicHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserConversationTopicHistoryService],
    }).compile();

    service = module.get<UserConversationTopicHistoryService>(
      UserConversationTopicHistoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
