import { Test, TestingModule } from '@nestjs/testing';
import { UserActiveAiController } from './user-active-ai.controller';
import { UserActiveAiService } from './user-active-ai.service';

describe('UserActiveAiController', () => {
  let controller: UserActiveAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserActiveAiController],
      providers: [UserActiveAiService],
    }).compile();

    controller = module.get<UserActiveAiController>(UserActiveAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
