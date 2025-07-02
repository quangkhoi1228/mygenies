export class DetectPronunciationType {
  expect: string;
  userInput: string;
  resultExpect: {
    word: string;
    analysis: {
      [key: string]: number;
    };
  }[];
}

export class ChatMessageType {
  role: string;
  sentence: string;
  order: number;
  detectPronunciation?: DetectPronunciationType;
}

export class CreateChatMessageDto {}
