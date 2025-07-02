import { CoreEntityHasPrimaryId } from 'src/shared/modules/routes/entity/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { UserAiConfig } from '../../user-ai-config/entities/user-ai-config.entity';

@Entity()
export class UserAiConfigOption extends CoreEntityHasPrimaryId {
  @Column()
  name: string;

  @Column()
  value: string;

  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => UserAiConfig, (userAiConfig) => userAiConfig.options, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  config: Relation<UserAiConfig>;
}
