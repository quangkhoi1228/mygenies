import { Test, TestingModule } from '@nestjs/testing';
import { ResourceBundleController } from './resource-bundle.controller';
import { ResourceBundleService } from './resource-bundle.service';

describe('ResourceBundleController', () => {
  let controller: ResourceBundleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceBundleController],
      providers: [ResourceBundleService],
    }).compile();

    controller = module.get<ResourceBundleController>(ResourceBundleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
