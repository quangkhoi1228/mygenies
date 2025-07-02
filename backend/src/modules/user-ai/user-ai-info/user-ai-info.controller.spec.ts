import { Test, TestingModule } from '@nestjs/testing';
import { UserAiInfoController } from './user-ai-info.controller';
import { UserAiInfoService } from './user-ai-info.service';

describe('UserAiInfoController', () => {
  let controller: UserAiInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAiInfoController],
      providers: [UserAiInfoService],
    }).compile();

    controller = module.get<UserAiInfoController>(UserAiInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
