import { Column, Entity } from 'typeorm';
import { UserConversationTopicHistory } from '../../user-conversation-topic-history/entities/user-conversation-topic-history.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserConversationTopicHistoryLog extends UserConversationTopicHistory {
  @ApiProperty()
  @Column()
  refId: number;
}
