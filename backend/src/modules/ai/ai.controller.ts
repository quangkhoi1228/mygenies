import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { AIService } from './ai.service';
import {
  AIDto,
  GenerateSayHelloSentenceDto,
  RefineUserSentenceDto,
} from './dto/ai.dto';
import { TranscriptDto } from './dto/transcript.dto';
import { AuthRequest } from '../auth/interface/auth-request.interface';
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('detectMispronunciation')
  detectMispronunciation(@Body() aiDto: AIDto) {
    // Validate input
    if (!aiDto.userSentence) {
      throw new BadRequestException('User sentence is required');
    }
    if (!aiDto.expectedSentence) {
      throw new BadRequestException('Expected sentence is required');
    }

    return this.aiService.detectMispronunciation(aiDto);
  }

  @Post('generateSpeech')
  generateSpeech(@Body() AIDto: AIDto) {
    // Validate input
    if (!AIDto.text) {
      throw new BadRequestException('Text is required');
    }

    return this.aiService.generateSpeech(AIDto);
  }

  @Post('getContext')
  getContext(@Body() generateSayHelloSentenceDto: GenerateSayHelloSentenceDto) {
    return this.aiService.getContext(generateSayHelloSentenceDto);
  }

  @Post('refine')
  refine(@Body() refineUserSentenceDto: RefineUserSentenceDto) {
    return this.aiService.refine(refineUserSentenceDto);
  }

  @Post('transcribe')
  transcript(@Body() input: TranscriptDto) {
    // Validate input
    if (!input.audioUrl) {
      throw new BadRequestException('Audio URL is required');
    }

    return this.aiService.transcript(input);
  }

  @Post('translate')
  translate(@Body() AIDto: AIDto) {
    // Validate input
    if (!AIDto.text) {
      throw new BadRequestException('Text is required');
    }

    return this.aiService.translate(AIDto);
  }

  @Post('generateIdeas')
  generateIdeas(@Body() AIDto: AIDto) {
    // Validate input
    if (!AIDto.text) {
      throw new BadRequestException('Idea is required');
    }

    return this.aiService.generateSentencesFromIdea(AIDto);
  }

  @Post('generate-general-topic')
  generateLetsTalkGeneralTopic(@Req() req: AuthRequest) {
    // Validate input

    return this.aiService.generateLetsTalkGeneralTopic(req);
  }
}
