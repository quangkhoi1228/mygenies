import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { MetaType } from 'src/shared/interfaces/objectMeta.interface';
import { UserAi } from '../../user-ai/entities/user-ai.entity';

export class CreateUserAiInfoBaseDto {
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

export class CreateUserAiInfoDto extends CreateUserAiInfoBaseDto {
  userAi: UserAi;
}
