import { CoreEntityHasPrimaryId } from 'src/shared/modules/routes/entity/core.entity';
import {
  Unique,
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { UserAi } from '../../user-ai/entities/user-ai.entity';
import { MetaType } from 'src/shared/interfaces/objectMeta.interface';

@Unique(['key', 'userAi'])
@Entity()
export class UserAiInfo extends CoreEntityHasPrimaryId {
  @Column()
  key: string;

  @Column()
  type: MetaType;

  @Column({ nullable: true })
  value: string;

  @ManyToOne(() => UserAi, (userAi) => userAi.userAiInfo, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userAi: Relation<UserAi>;
}
