import { Test, TestingModule } from '@nestjs/testing';
import { ConversationProcessController } from './conversation-process.controller';
import { ConversationProcessService } from './conversation-process.service';
import { GroqModule } from 'src/modules/third-party/groq/groq.module';

describe('ConversationProcessController', () => {
  let controller: ConversationProcessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GroqModule],
      controllers: [ConversationProcessController],
      providers: [ConversationProcessService],
    }).compile();

    controller = module.get<ConversationProcessController>(
      ConversationProcessController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
