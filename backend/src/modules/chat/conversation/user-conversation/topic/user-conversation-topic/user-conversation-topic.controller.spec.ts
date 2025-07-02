import { Test, TestingModule } from '@nestjs/testing';
import { UserConversationTopicController } from './user-conversation-topic.controller';
import { UserConversationTopicService } from './user-conversation-topic.service';

describe('UserConversationTopicController', () => {
  let controller: UserConversationTopicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserConversationTopicController],
      providers: [UserConversationTopicService],
    }).compile();

    controller = module.get<UserConversationTopicController>(
      UserConversationTopicController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
