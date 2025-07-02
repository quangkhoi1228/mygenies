import { Test, TestingModule } from '@nestjs/testing';
import { ResourceBundleService } from './resource-bundle.service';

describe('ResourceBundleService', () => {
  let service: ResourceBundleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceBundleService],
    }).compile();

    service = module.get<ResourceBundleService>(ResourceBundleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
