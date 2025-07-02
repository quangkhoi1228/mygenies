import { Test, TestingModule } from '@nestjs/testing';
import { ResourceBundleKeyController } from './resource-bundle-key.controller';
import { ResourceBundleKeyService } from './resource-bundle-key.service';

describe('ResourceBundleKeyController', () => {
  let controller: ResourceBundleKeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceBundleKeyController],
      providers: [ResourceBundleKeyService],
    }).compile();

    controller = module.get<ResourceBundleKeyController>(ResourceBundleKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
