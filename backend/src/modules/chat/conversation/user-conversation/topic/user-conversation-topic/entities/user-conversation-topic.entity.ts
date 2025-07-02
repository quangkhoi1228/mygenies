import { ApiProperty } from '@nestjs/swagger';
import { CoreEntityHasPrimaryId } from '../../../../../../../shared/modules/routes/entity/core.entity';
import { Column, Entity } from 'typeorm';
import {
  UserConversationTopicStatus,
  UserConversationTopicType,
} from '../dto/create-user-conversation-topic.dto';

@Entity()
export class UserConversationTopic extends CoreEntityHasPrimaryId {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  scenario: string;

  @ApiProperty()
  @Column()
  userRole: string;

  @ApiProperty()
  @Column()
  systemRole: string;

  @ApiProperty({
    enum: UserConversationTopicType,
    enumName: 'UserConversationTopicType',
  })
  @Column({ default: UserConversationTopicType.customization })
  type: UserConversationTopicType;

  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @Column({ default: UserConversationTopicStatus.new })
  status: UserConversationTopicStatus;
}
