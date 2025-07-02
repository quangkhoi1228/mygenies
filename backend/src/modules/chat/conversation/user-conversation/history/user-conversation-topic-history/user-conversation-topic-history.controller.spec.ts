import { Test, TestingModule } from '@nestjs/testing';
import { UserConversationTopicHistoryController } from './user-conversation-topic-history.controller';
import { UserConversationTopicHistoryService } from './user-conversation-topic-history.service';

describe('UserConversationTopicHistoryController', () => {
  let controller: UserConversationTopicHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserConversationTopicHistoryController],
      providers: [UserConversationTopicHistoryService],
    }).compile();

    controller = module.get<UserConversationTopicHistoryController>(
      UserConversationTopicHistoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
