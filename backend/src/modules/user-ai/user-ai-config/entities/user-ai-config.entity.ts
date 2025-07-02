import { ApiProperty } from '@nestjs/swagger';
import { CoreEntityHasPrimaryId } from 'src/shared/modules/routes/entity/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import {
  UserAiConfigKey,
  UserAiConfigType,
} from '../dto/create-user-ai-config.dto';
import { UserAiConfigOption } from '../../user-ai-config-option/entities/user-ai-config-option.entity';

@Entity()
export class UserAiConfig extends CoreEntityHasPrimaryId {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ enum: UserAiConfigKey, enumName: 'UserAiConfigKey' })
  @PrimaryColumn()
  key: UserAiConfigKey;

  @ApiProperty({ enum: UserAiConfigType, enumName: 'UserAiConfigType' })
  @Column()
  type: UserAiConfigType;

  @ApiProperty()
  @Column({ default: 1 })
  maxSelection: number;

  @OneToMany(
    () => UserAiConfigOption,
    (userAiConfigOption) => userAiConfigOption.config,
  )
  @JoinColumn()
  options: Relation<UserAiConfigOption[]>;
}
