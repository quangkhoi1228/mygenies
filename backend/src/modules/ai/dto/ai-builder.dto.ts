import { ChatMessageType } from 'src/modules/chat/chat-message/dto/create-chat-message.dto';

export class AIBuilderDto {
  role: string;
  taskOverview: string;
  taskDetail: string;
  input: string;
  outputFormat: string;
  outputStrict?: string = '';
  language?: string = 'English';
}

export class AIAudioBuilderDto {
  buffer: Buffer;
  prompt: string = '';
  language?: string = 'English';
}

export class AIConversationBuilderDto {
  quantity: number;
  roleBased: boolean;
  hintQuantity?: number;
  context: {
    topic: string;
    systemRole: string;
    userRole: string;
  };
  chatHistory: ChatMessageType[];
}
