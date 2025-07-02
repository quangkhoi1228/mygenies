import { Test, TestingModule } from '@nestjs/testing';
import { UserConversationTopicHistoryLogController } from './user-conversation-topic-history-log.controller';
import { UserConversationTopicHistoryLogService } from './user-conversation-topic-history-log.service';

describe('UserConversationTopicHistoryLogController', () => {
  let controller: UserConversationTopicHistoryLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserConversationTopicHistoryLogController],
      providers: [UserConversationTopicHistoryLogService],
    }).compile();

    controller = module.get<UserConversationTopicHistoryLogController>(
      UserConversationTopicHistoryLogController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
