import { CoreEntityHasPrimaryId } from 'src/shared/modules/routes/entity/core.entity';
import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  Relation,
  Unique,
} from 'typeorm';
import { LangCodesEnum } from '../../resource-bundle/entities/resource-bundle.entity';
import { ResourceBundleKey } from '../../resource-bundle-key/entities/resource-bundle-key.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['langCode', 'resourceBundleKey'])
export class ResourceBundleMeta extends CoreEntityHasPrimaryId {
  @ApiProperty()
  @Column()
  langCode: LangCodesEnum;

  @ApiProperty()
  @Column()
  value: string;

  @ManyToOne(
    () => ResourceBundleKey,
    (resourceBundleKey) => resourceBundleKey.resourceBundleMeta,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  resourceBundleKey: Relation<ResourceBundleKey>;

  @ApiProperty()
  @Column({ nullable: true })
  resourceBundleKeyKey: string;
}
