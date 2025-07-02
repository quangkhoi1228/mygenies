import { EntityBaseType } from "../shared/types/entity-base.type";

export type UserAiType = {
  name: string;
  avatar: string;
  tone: string[];
  voice: string;
  ability: string[];
  maxCharacter: number;
  maxHintCharacter: number;
};

export type UserAiListType = EntityBaseType & {
  targetInfo: UserAiType;
  userAiInfo: UserAiType;
  userId: number;
};
