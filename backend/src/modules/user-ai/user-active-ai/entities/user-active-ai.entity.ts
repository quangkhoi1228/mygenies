import { ApiProperty } from '@nestjs/swagger';
import { CoreEntityHasPrimaryId } from '../../../../shared/modules/routes/entity/core.entity';
import { Entity, Unique, Column } from 'typeorm';

@Entity()
@Unique(['userId', 'userAiId'])
export class UserActiveAi extends CoreEntityHasPrimaryId {
  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @Column()
  userAiId: number;
}
