import { Test, TestingModule } from '@nestjs/testing';
import { OnboardProcessController } from './onboard-process.controller';
import { OnboardProcessService } from './onboard-process.service';

describe('OnboardProcessController', () => {
  let controller: OnboardProcessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnboardProcessController],
      providers: [OnboardProcessService],
    }).compile();

    controller = module.get<OnboardProcessController>(OnboardProcessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
