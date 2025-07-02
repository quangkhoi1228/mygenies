import { ApiProperty } from '@nestjs/swagger';
import { CoreEntityHasPrimaryId } from 'src/shared/modules/routes/entity/core.entity';
import { Column, Entity } from 'typeorm';
import { ConversationRoleEnum } from '../dto/create-user-conversation-topic-history.dto';

@Entity()
export class UserConversationTopicHistory extends CoreEntityHasPrimaryId {
  @ApiProperty()
  @Column()
  role: ConversationRoleEnum;

  @ApiProperty()
  @Column()
  sentence: string;

  @ApiProperty()
  @Column()
  order: number;

  @ApiProperty()
  @Column()
  userConversationTopicId: number;
}
