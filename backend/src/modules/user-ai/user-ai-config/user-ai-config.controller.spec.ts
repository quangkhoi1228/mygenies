import { Test, TestingModule } from '@nestjs/testing';
import { UserAiConfigController } from './user-ai-config.controller';
import { UserAiConfigService } from './user-ai-config.service';

describe('UserAiConfigController', () => {
  let controller: UserAiConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAiConfigController],
      providers: [UserAiConfigService],
    }).compile();

    controller = module.get<UserAiConfigController>(UserAiConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
