import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationProcessDto {
  @ApiProperty()
  topic: string;

  @ApiProperty()
  userRole: string;

  @ApiProperty()
  systemRole: string;
}
