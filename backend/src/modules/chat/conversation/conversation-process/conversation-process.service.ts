import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AIService } from 'src/modules/ai/ai.service';
import { CreateConversationProcessDto } from './dto/conversation-process.dto';

@Injectable()
export class ConversationProcessService {
  constructor(private readonly aiService: AIService) {}

  async getConversationProcess(
    createConversationProcessDto: CreateConversationProcessDto,
  ) {
    try {
      // Forward to GROQ
      const response = await this.aiService.generateConversation(
        createConversationProcessDto.topic,
        createConversationProcessDto.userRole,
        createConversationProcessDto.systemRole,
      );

      return response;
    } catch (error) {
      console.error('Chat generation error:', error);

      throw new InternalServerErrorException(
        'Failed to generate chat response',
      );
    }
  }
}
