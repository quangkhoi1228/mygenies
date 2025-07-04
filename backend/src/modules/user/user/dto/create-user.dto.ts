import { IsArray, IsString } from 'class-validator';
import { CreateUserInfoBaseDto } from '../../user-info/dto/create-user-info.dto';
import { MetaType } from '../../../../shared/interfaces/objectMeta.interface';
import { ApiProperty } from '@nestjs/swagger';

export enum OnboardKeyEnum {
  NATIVE_LANGUAGE = 'nativeLanguage',
  LANGUAGE_TO_LEARN = 'languageToLearn',
  LANGUAGE_LEVEL = 'languageLevel',
  LEARNING_HISTORY = 'learningHistory',
  LEARNING_PURPOSE = 'learningPurpose',
  AREA_OF_EXPERTISE = 'areaOfExpertise',
  LANGUAGE_LEARNING_FREQUENCY = 'languageLearningFrequency',
}

export class UserDataDto {
  id: number;
  clerkId: string;
  userInfo: {
    [K: string]: any;
  };
}

export class CreateUserBaseDto {
  @ApiProperty()
  @IsString()
  clerkId: string;
}

export class CreateUserRawDto extends CreateUserBaseDto {
  [K: string]: any;
}

export class CreateUserDto extends CreateUserBaseDto {
  @ApiProperty({ type: CreateUserInfoBaseDto, isArray: true })
  @IsArray()
  userInfo: CreateUserInfoBaseDto[];
}

export const UserInfoDataConfig = [
  // default
  {
    key: 'email',
    type: MetaType.string,
  },
  {
    key: 'firstName',
    type: MetaType.string,
  },
  {
    key: 'lastName',
    type: MetaType.string,
  },
  {
    key: 'imageUrl',
    type: MetaType.string,
  },

  // user info
  {
    key: 'national',
    type: MetaType.string,
  },

  // onboard data
  {
    key: OnboardKeyEnum.NATIVE_LANGUAGE,
    type: MetaType.string,
  },
  {
    key: OnboardKeyEnum.LANGUAGE_TO_LEARN,
    type: MetaType.string,
  },
  {
    key: OnboardKeyEnum.LANGUAGE_LEVEL,
    type: MetaType.number,
  },
  {
    key: OnboardKeyEnum.LEARNING_HISTORY,
    type: MetaType.array,
  },
  {
    key: OnboardKeyEnum.LEARNING_PURPOSE,
    type: MetaType.array,
  },
  {
    key: OnboardKeyEnum.AREA_OF_EXPERTISE,
    type: MetaType.array,
  },
  {
    key: OnboardKeyEnum.LANGUAGE_LEARNING_FREQUENCY,
    type: MetaType.number,
  },
  //
  {
    key: 'onboardBegin',
    type: MetaType.boolean,
  },
  {
    key: 'onboardInitEnd',
    type: MetaType.boolean,
  },
  {
    key: 'slackWebhookUrl',
    type: MetaType.string,
  },
] as const;

type ConfigItem = (typeof UserInfoDataConfig)[number];
export type UserInfoKeys = ConfigItem['key'];
