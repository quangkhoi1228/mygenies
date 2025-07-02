import { Test, TestingModule } from '@nestjs/testing';
import { OnboardProcessService } from './onboard-process.service';

describe('OnboardProcessService', () => {
  let service: OnboardProcessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnboardProcessService],
    }).compile();

    service = module.get<OnboardProcessService>(OnboardProcessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
