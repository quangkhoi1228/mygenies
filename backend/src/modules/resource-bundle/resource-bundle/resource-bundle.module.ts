import { Global, Module } from '@nestjs/common';
import { ResourceBundleService } from './resource-bundle.service';
import { ResourceBundleController } from './resource-bundle.controller';
import { ResourceBundleKeyModule } from '../resource-bundle-key/resource-bundle-key.module';
import { ResourceBundleMetaModule } from '../resource-bundle-meta/resource-bundle-meta.module';

@Global()
@Module({
  imports: [ResourceBundleKeyModule, ResourceBundleMetaModule],
  controllers: [ResourceBundleController],
  providers: [ResourceBundleService],
  exports: [ResourceBundleService],
})
export class ResourceBundleModule {}
