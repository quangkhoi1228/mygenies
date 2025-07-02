import { CoreEntityHasPrimaryId } from 'src/shared/modules/routes/entity/core.entity';
import {
  Entity,
  OneToMany,
  JoinColumn,
  Relation,
  Unique,
  PrimaryColumn,
} from 'typeorm';
import { ResourceBundleMeta } from '../../resource-bundle-meta/entities/resource-bundle-meta.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['key'])
export class ResourceBundleKey extends CoreEntityHasPrimaryId {
  @ApiProperty()
  @PrimaryColumn()
  key: string;

  // Meta
  @OneToMany(
    () => ResourceBundleMeta,
    (resourceBundleMeta) => resourceBundleMeta.resourceBundleKey,
  )
  @JoinColumn()
  resourceBundleMeta: Relation<ResourceBundleMeta[]>;
}
