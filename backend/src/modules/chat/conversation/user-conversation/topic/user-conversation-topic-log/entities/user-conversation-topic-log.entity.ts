import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { UserConversationTopic } from '../../user-conversation-topic/entities/user-conversation-topic.entity';

@Entity()
export class UserConversationTopicLog extends UserConversationTopic {
  @ApiProperty()
  @Column()
  refId: number;
}
