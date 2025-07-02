import { CoreEntityHasPrimaryId } from 'src/shared/modules/routes/entity/core.entity';
import { OneToMany, JoinColumn, Relation, Entity, Column } from 'typeorm';
import { UserAiInfo } from '../../user-ai-info/entities/user-ai-info.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserAi extends CoreEntityHasPrimaryId {
  @ApiProperty()
  @Column()
  userId: number;

  @OneToMany(() => UserAiInfo, (userAiInfo) => userAiInfo.userAi)
  @JoinColumn()
  userAiInfo: Relation<UserAiInfo[]>;
}
