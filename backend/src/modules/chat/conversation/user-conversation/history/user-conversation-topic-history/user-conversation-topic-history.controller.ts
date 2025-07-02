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
import { UserConversationTopicHistoryService } from './user-conversation-topic-history.service';
import { CreateUserConversationTopicHistoryDto } from './dto/create-user-conversation-topic-history.dto';
import { UpdateUserConversationTopicHistoryDto } from './dto/update-user-conversation-topic-history.dto';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { PaginationDto } from 'src/shared/dto/find-request.dto';

@Controller('userConversationTopicHistory')
export class UserConversationTopicHistoryController {
  constructor(
    private readonly userConversationTopicHistoryService: UserConversationTopicHistoryService,
  ) {}

  @Post()
  create(
    @Body()
    createUserConversationTopicHistoryDto: CreateUserConversationTopicHistoryDto,
    @Req() req: AuthRequest,
  ) {
    return this.userConversationTopicHistoryService.create(
      createUserConversationTopicHistoryDto,
      req,
    );
  }

  @Get()
  findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
    return this.userConversationTopicHistoryService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.userConversationTopicHistoryService.findOne(+id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateUserConversationTopicHistoryDto: UpdateUserConversationTopicHistoryDto,
    @Req() req: AuthRequest,
  ) {
    return this.userConversationTopicHistoryService.update(
      +id,
      updateUserConversationTopicHistoryDto,
      req,
    );
  }

  @Delete('all/:id')
  removeAllByConversation(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.userConversationTopicHistoryService.removeAllByConversation(
      +id,
      req,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.userConversationTopicHistoryService.remove(+id, req);
  }
}
