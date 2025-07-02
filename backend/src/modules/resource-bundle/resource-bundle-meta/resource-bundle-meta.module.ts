import { Module } from '@nestjs/common';
import { ResourceBundleMetaService } from './resource-bundle-meta.service';
import { ResourceBundleMetaController } from './resource-bundle-meta.controller';
import { ResourceBundleMeta } from './entities/resource-bundle-meta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceBundleMeta])],
  controllers: [ResourceBundleMetaController],
  providers: [ResourceBundleMetaService],
  exports: [ResourceBundleMetaService],
})
export class ResourceBundleMetaModule {}
