import { Test, TestingModule } from '@nestjs/testing';
import { UserConversationTopicLogController } from './user-conversation-topic-log.controller';
import { UserConversationTopicLogService } from './user-conversation-topic-log.service';

describe('UserConversationTopicLogController', () => {
  let controller: UserConversationTopicLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserConversationTopicLogController],
      providers: [UserConversationTopicLogService],
    }).compile();

    controller = module.get<UserConversationTopicLogController>(
      UserConversationTopicLogController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
