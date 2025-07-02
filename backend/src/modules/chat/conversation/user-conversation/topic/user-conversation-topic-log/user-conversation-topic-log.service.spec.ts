import { Test, TestingModule } from '@nestjs/testing';
import { UserConversationTopicLogService } from './user-conversation-topic-log.service';

describe('UserConversationTopicLogService', () => {
  let service: UserConversationTopicLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserConversationTopicLogService],
    }).compile();

    service = module.get<UserConversationTopicLogService>(
      UserConversationTopicLogService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
