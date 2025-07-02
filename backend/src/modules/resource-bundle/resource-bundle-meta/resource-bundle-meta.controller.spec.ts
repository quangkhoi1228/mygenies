import { Test, TestingModule } from '@nestjs/testing';
import { ResourceBundleMetaController } from './resource-bundle-meta.controller';
import { ResourceBundleMetaService } from './resource-bundle-meta.service';

describe('ResourceBundleMetaController', () => {
  let controller: ResourceBundleMetaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceBundleMetaController],
      providers: [ResourceBundleMetaService],
    }).compile();

    controller = module.get<ResourceBundleMetaController>(ResourceBundleMetaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
