import { Test, TestingModule } from '@nestjs/testing';
import { OnboardPhaseController } from './onboard-phase.controller';
import { OnboardPhaseService } from './onboard-phase.service';

describe('OnboardPhaseController', () => {
  let controller: OnboardPhaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnboardPhaseController],
      providers: [OnboardPhaseService],
    }).compile();

    controller = module.get<OnboardPhaseController>(OnboardPhaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
