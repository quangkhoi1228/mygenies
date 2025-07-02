import { Module } from '@nestjs/common';
import { ResourceBundleKeyService } from './resource-bundle-key.service';
import { ResourceBundleKeyController } from './resource-bundle-key.controller';
import { ResourceBundleKey } from './entities/resource-bundle-key.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceBundleKey])],
  controllers: [ResourceBundleKeyController],
  providers: [ResourceBundleKeyService],
  exports: [ResourceBundleKeyService],
})
export class ResourceBundleKeyModule {}
