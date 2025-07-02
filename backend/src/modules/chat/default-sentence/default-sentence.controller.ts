import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { DefaultSentenceService } from './default-sentence.service';
import { CreateDefaultSentenceBaseDto } from './dto/create-default-sentence.dto';
import { UpdateDefaultSentenceDto } from './dto/update-default-sentence.dto';
import { Public } from '../../../decorators/public.decorator';
import { AuthRequest } from '../../auth/interface/auth-request.interface';
import { ApiResponse } from '@nestjs/swagger';
import { DefaultSentence } from './entities/default-sentence.entity';
import { PaginationDto } from 'src/shared/dto/find-request.dto';

@Public()
@Controller('defaultSentence')
export class DefaultSentenceController {
  constructor(
    private readonly defaultSentenceService: DefaultSentenceService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Created record',
    type: DefaultSentence,
  })
  create(@Body() createDefaultSentenceBaseDto: CreateDefaultSentenceBaseDto) {
    return this.defaultSentenceService.create(createDefaultSentenceBaseDto);
  }

  @Get()
  findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
    return this.defaultSentenceService.findAll(req);
  }

  @Get(':id')
  @ApiResponse({
    description: 'Record has ID',
    type: DefaultSentence,
  })
  findOne(@Param('id') id: string) {
    return this.defaultSentenceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDefaultSentenceDto: UpdateDefaultSentenceDto,
  ) {
    return this.defaultSentenceService.update(+id, updateDefaultSentenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.defaultSentenceService.remove(+id);
  }
}
