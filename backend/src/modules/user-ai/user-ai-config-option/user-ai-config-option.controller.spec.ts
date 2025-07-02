import { Test, TestingModule } from '@nestjs/testing';
import { UserAiConfigOptionController } from './user-ai-config-option.controller';
import { UserAiConfigOptionService } from './user-ai-config-option.service';

describe('UserAiConfigOptionController', () => {
  let controller: UserAiConfigOptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAiConfigOptionController],
      providers: [UserAiConfigOptionService],
    }).compile();

    controller = module.get<UserAiConfigOptionController>(
      UserAiConfigOptionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
