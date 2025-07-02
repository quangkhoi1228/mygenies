import { Test, TestingModule } from '@nestjs/testing';
import { ResourceBundleMetaService } from './resource-bundle-meta.service';

describe('ResourceBundleMetaService', () => {
  let service: ResourceBundleMetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceBundleMetaService],
    }).compile();

    service = module.get<ResourceBundleMetaService>(ResourceBundleMetaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
