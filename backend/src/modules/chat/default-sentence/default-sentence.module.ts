import { Module } from '@nestjs/common';
import { DefaultSentenceService } from './default-sentence.service';
import { DefaultSentenceController } from './default-sentence.controller';
import { DefaultSentence } from './entities/default-sentence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIModule } from 'src/modules/ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([DefaultSentence]), AIModule],
  controllers: [DefaultSentenceController],
  providers: [DefaultSentenceService],
  exports: [DefaultSentenceService],
})
export class DefaultSentenceModule {}
