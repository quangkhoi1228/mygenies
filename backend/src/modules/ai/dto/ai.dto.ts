import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageType } from '../../chat/chat-message/dto/create-chat-message.dto';

export class AIDto {
  @ApiProperty()
  audioUrl: string;

  @ApiProperty()
  prompt: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  userSentence: string;

  @ApiProperty()
  expectedSentence: string;

  @ApiProperty()
  count: number;
}

export class RefineUserSentenceDto {
  userSentence: string;
  topic?: string;
  systemRole?: string;
  userRole?: string;
  chatHistory?: ChatMessageType[];
}

export class GenerateSayHelloSentenceDto {
  quantity: number;
  hintQuantity: number;
  topic?: string;
  systemRole?: string;
  userRole?: string;
  chatHistory: ChatMessageType[];
  roleBased?: boolean;
}

export class DetectMispronunciationDto {
  expectedSentence: string;
  userSentence: string;
}

export class GenerateSentencesFromIdeaDto {
  text: string;
  count?: number;
}
