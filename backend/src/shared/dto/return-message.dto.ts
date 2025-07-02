import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnMessageDto<T> {
  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data?: T;
}
