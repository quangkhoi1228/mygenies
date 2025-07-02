import { Test, TestingModule } from '@nestjs/testing';
import { UserAiController } from './user-ai.controller';
import { UserAiService } from './user-ai.service';

describe('UserAiController', () => {
  let controller: UserAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAiController],
      providers: [UserAiService],
    }).compile();

    controller = module.get<UserAiController>(UserAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
