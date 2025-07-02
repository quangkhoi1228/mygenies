import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export enum UserConversationTopicType {
  general = 'general',
  customization = 'customization',
}

export enum UserConversationTopicStatus {
  new = 'new',
  chatting = 'chatting',
  ended = 'ended',
}

export class CreateUserConversationTopicBaseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  scenario: string;

  @ApiProperty()
  @IsString()
  userRole: string;

  @ApiProperty()
  @IsString()
  systemRole: string;

  @ApiProperty({
    enum: UserConversationTopicStatus,
    enumName: 'UserConversationTopicStatus',
  })
  @IsString()
  status: UserConversationTopicStatus;

  @ApiProperty({
    enum: UserConversationTopicType,
    enumName: 'UserConversationTopicType',
  })
  @IsOptional()
  @IsString()
  type: UserConversationTopicType;
}

export class CreateUserConversationTopicDto extends CreateUserConversationTopicBaseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  userId: number;
}
