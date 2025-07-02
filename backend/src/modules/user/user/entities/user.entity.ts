import { CoreEntityHasPrimaryId } from '../../../../shared/modules/routes/entity/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  Relation,
  Unique,
} from 'typeorm';
import { UserInfo } from '../../user-info/entities/user-info.entity';

@Entity()
@Unique(['clerkId'])
export class User extends CoreEntityHasPrimaryId {
  @Column()
  clerkId: string;

  @OneToMany(() => UserInfo, (userInfo) => userInfo.user)
  @JoinColumn()
  userInfo: Relation<UserInfo[]>;
}
