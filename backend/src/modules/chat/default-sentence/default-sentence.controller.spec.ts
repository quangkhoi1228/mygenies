import { Test, TestingModule } from '@nestjs/testing';
import { DefaultSentenceController } from './default-sentence.controller';
import { DefaultSentenceService } from './default-sentence.service';

describe('DefaultSentenceController', () => {
  let controller: DefaultSentenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefaultSentenceController],
      providers: [DefaultSentenceService],
    }).compile();

    controller = module.get<DefaultSentenceController>(
      DefaultSentenceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
