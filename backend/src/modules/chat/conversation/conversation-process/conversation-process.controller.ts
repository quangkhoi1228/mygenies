import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ConversationProcessService } from './conversation-process.service';
import { CreateConversationProcessDto } from './dto/conversation-process.dto';
import { Public } from '../../../../decorators/public.decorator';

@Public()
@Controller('conversation')
export class ConversationProcessController {
  constructor(
    private readonly conversationService: ConversationProcessService,
  ) {}

  @Post()
  create(@Body() createChatMessageDto: CreateConversationProcessDto) {
    // Validate input
    if (!createChatMessageDto.topic) {
      throw new BadRequestException('Topic is required');
    }

    if (!createChatMessageDto.userRole) {
      throw new BadRequestException('User role is required');
    }

    if (!createChatMessageDto.systemRole) {
      throw new BadRequestException('System role is required');
    }

    return this.conversationService.getConversationProcess(
      createChatMessageDto,
    );
  }
}
