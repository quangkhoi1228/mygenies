import { IsString } from 'class-validator';
import { MetaType } from '../../../../shared/interfaces/objectMeta.interface';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInfoBaseDto {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  type: MetaType;

  @ApiProperty()
  @IsString()
  value: string;
}

export class CreateUserInfoDto extends CreateUserInfoBaseDto {
  user: User;
}
