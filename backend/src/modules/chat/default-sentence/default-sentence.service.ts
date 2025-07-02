import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateDefaultSentenceBaseDto,
  CreateDefaultSentenceDto,
} from './dto/create-default-sentence.dto';
import {
  UpdateDefaultSentenceBaseDto,
  UpdateDefaultSentenceDto,
} from './dto/update-default-sentence.dto';
import { DefaultSentence } from './entities/default-sentence.entity';
import { ConvexService } from '../../third-party/convex/convex.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from '../../../shared/modules/routes/core.service';
import { Repository } from 'typeorm';
import { GroqService } from '../../third-party/groq/groq.service';
import { AIService } from '../../ai/ai.service';
import { FindRequestDto } from '../../../shared/dto/find-request.dto';
import { AuthRequest } from '../../auth/interface/auth-request.interface';
import { AIDto } from '../../ai/dto/ai.dto';

@Injectable()
export class DefaultSentenceService extends CoreService<DefaultSentence> {
  constructor(
    @InjectRepository(DefaultSentence)
    private readonly defaultSentenceRepository: Repository<DefaultSentence>,
    private readonly aiService: AIService,
    private readonly groqService: GroqService,
    private readonly chatProcessService: AIService,
    private readonly convexService: ConvexService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super(defaultSentenceRepository);
  }

  async create(createDefaultSentenceBaseDto: CreateDefaultSentenceBaseDto) {
    const createDefaultSentenceDto = new CreateDefaultSentenceDto();
    createDefaultSentenceDto.sentence = createDefaultSentenceBaseDto.sentence;
    createDefaultSentenceDto.type = createDefaultSentenceBaseDto.type;

    // translate
    const translate = await this.chatProcessService.translate({
      text: createDefaultSentenceBaseDto.sentence,
    });
    createDefaultSentenceDto.translate = translate.translatedText;

    const chatProcessDto = new AIDto();
    chatProcessDto.text = createDefaultSentenceBaseDto.sentence;

    // audio
    const audio = await this.chatProcessService.generateSpeech(chatProcessDto);
    createDefaultSentenceDto.audio = audio;

    // hint
    const hint = await this.chatProcessService.getContext({
      quantity: 20,
      chatHistory: [
        {
          role: 'system',
          sentence: createDefaultSentenceBaseDto.sentence,
          order: 0,
        },
      ],
      roleBased: true,
      hintQuantity: 1,
    });
    createDefaultSentenceDto.hint = hint.hintSentences[0] ?? '';

    const defaultSentence = await this.createCoreService(
      [createDefaultSentenceDto],
      'system',
    );

    return defaultSentence[0];
  }

  async findAll(req: AuthRequest) {
    const findRequestDto = new FindRequestDto(req);

    const data = await this.findAllCoreServiceByFindRequestDto(findRequestDto);

    return data;
  }

  async findOne(id: number) {
    return await this.defaultSentenceRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateDefaultSentenceBaseDto: UpdateDefaultSentenceBaseDto,
  ) {
    const existed = await this.defaultSentenceRepository.findOneBy({
      id,
    });

    if (existed) {
      const updateDefaultSentenceDto = new UpdateDefaultSentenceDto();
      updateDefaultSentenceDto.type =
        updateDefaultSentenceBaseDto.type ?? existed.type;

      if (
        updateDefaultSentenceBaseDto.sentence &&
        updateDefaultSentenceBaseDto.sentence !== existed.sentence
      ) {
        updateDefaultSentenceDto.sentence =
          updateDefaultSentenceBaseDto.sentence;

        const translate = await this.aiService.translate({
          text: updateDefaultSentenceBaseDto.sentence,
        });
        updateDefaultSentenceDto.translate = translate.translatedText;

        const chatProcessDto = new AIDto();
        chatProcessDto.text = updateDefaultSentenceBaseDto.sentence;

        const audio =
          await this.chatProcessService.generateSpeech(chatProcessDto);
        updateDefaultSentenceDto.audio = audio;

        // hint
        const hint = await this.chatProcessService.getContext({
          quantity: 20,
          chatHistory: [
            {
              role: 'system',
              sentence: updateDefaultSentenceBaseDto.sentence,
              order: 0,
            },
          ],
          roleBased: false,
          hintQuantity: 1,
        });
        updateDefaultSentenceDto.hint = hint.hintSentences[0];
      }

      return await this.updateCoreService(
        { id },
        updateDefaultSentenceDto,
        'system',
      );
    } else {
      throw new BadRequestException('Default sentence not found');
    }
  }

  async remove(id: number) {
    const removeEntity = await this.defaultSentenceRepository.findOneBy({
      id,
    });

    if (removeEntity) {
      return await this.defaultSentenceRepository.remove(removeEntity);
    } else {
      throw new BadRequestException('Default sentence not found');
    }
  }
}
