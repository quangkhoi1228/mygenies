import { Test, TestingModule } from '@nestjs/testing';
import { ConvexController } from './convex.controller';
import { ConvexService } from './convex.service';

describe('ConvexController', () => {
  let controller: ConvexController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConvexController],
      providers: [ConvexService],
    }).compile();

    controller = module.get<ConvexController>(ConvexController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
