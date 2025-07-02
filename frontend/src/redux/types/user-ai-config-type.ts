import { EntityBaseType } from "../shared/types/entity-base.type";

export enum UserAiConfigKeyEnum {
  name = "name",
  avatar = "avatar",
  tone = "tone",
  voice = "voice",
  ability = "ability",
  maxCharacter = "maxCharacter",
  maxHintCharacter = "maxHintCharacter",
}

export enum UserAiConfigTypeEnum {
  input = "input",
  imageSelect = "imageSelect",
  singleChoiceQuestion = "singleChoiceQuestion",
  multipleChoiceQuestion = "multipleChoiceQuestion",
}

export type UserAiConfigOptionType = EntityBaseType & {
  name: string;
  value: string;
  url?: string;
};

export type UserAiConfigType = EntityBaseType & {
  name: string;

  key: UserAiConfigKeyEnum;

  type: UserAiConfigTypeEnum;

  maxSelection: number;

  options?: UserAiConfigOptionType[];
};
