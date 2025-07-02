import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserAiInfoBaseDto } from '../../user-ai-info/dto/create-user-ai-info.dto';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { MetaType } from 'src/shared/interfaces/objectMeta.interface';
import { UserAiConfigKey } from '../../user-ai-config/dto/create-user-ai-config.dto';

export class UserAiDataDto {
  id: number;
  userId: number;
  userAiInfo: {
    [K: string]: any;
  };
  targetInfo?: {
    [K: string]: any;
  };
}

export class CreateUserAiBaseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  userId: number;
}

export class CreateUserAiRawDto extends CreateUserAiBaseDto {
  [K: string]: any;
}

export class CreateUserAiDto extends CreateUserAiBaseDto {
  @ApiProperty({ type: CreateUserAiInfoBaseDto, isArray: true })
  @IsArray()
  userAiInfo: CreateUserAiInfoBaseDto[];
}

export const UserAiInfoDataConfig = [
  // config data
  {
    key: UserAiConfigKey.name,
    type: MetaType.string,
  },

  {
    key: UserAiConfigKey.avatar,
    type: MetaType.string,
  },
  {
    key: UserAiConfigKey.tone,
    type: MetaType.array,
  },
  {
    key: UserAiConfigKey.voice,
    type: MetaType.string,
  },
  {
    key: UserAiConfigKey.ability,
    type: MetaType.array,
  },
  {
    key: UserAiConfigKey.maxCharacter,
    type: MetaType.string,
  },
  {
    key: UserAiConfigKey.maxHintCharacter,
    type: MetaType.string,
  },
  //
] as const;

type ConfigItem = (typeof UserAiInfoDataConfig)[number];
export type UserAiInfoKeys = ConfigItem['key'];
