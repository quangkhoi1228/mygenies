import { CoreEntityHasPrimaryId } from '../../../../shared/modules/routes/entity/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Relation,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { MetaType } from '../../../../shared/interfaces/objectMeta.interface';

@Unique(['key', 'user'])
@Entity()
export class UserInfo extends CoreEntityHasPrimaryId {
  @Column()
  key: string;

  @Column()
  type: MetaType;

  @Column({ nullable: true })
  value: string;

  @ManyToOne(() => User, (user) => user.userInfo, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Relation<User>;
}
