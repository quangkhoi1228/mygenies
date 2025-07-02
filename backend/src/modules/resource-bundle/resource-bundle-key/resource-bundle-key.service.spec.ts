import { Test, TestingModule } from '@nestjs/testing';
import { ResourceBundleKeyService } from './resource-bundle-key.service';

describe('ResourceBundleKeyService', () => {
  let service: ResourceBundleKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceBundleKeyService],
    }).compile();

    service = module.get<ResourceBundleKeyService>(ResourceBundleKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
