import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export enum ConversationRoleEnum {
  system = 'system',
  user = 'user',
}

export class CreateUserConversationTopicHistoryBaseDto {
  @ApiProperty({ enum: ConversationRoleEnum, enumName: 'ConversationRoleEnum' })
  @IsString()
  role: ConversationRoleEnum;

  @ApiProperty()
  @IsString()
  sentence: string;

  @ApiProperty()
  @IsNumber()
  order: number;
}

export class CreateUserConversationTopicHistoryDto extends CreateUserConversationTopicHistoryBaseDto {
  @ApiProperty()
  @IsNumber()
  userConversationTopicId: number;
}
