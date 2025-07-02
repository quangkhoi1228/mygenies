import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserConversationTopicHistoryLogService } from './user-conversation-topic-history-log.service';
import { CreateUserConversationTopicHistoryLogDto } from './dto/create-user-conversation-topic-history-log.dto';
import { UpdateUserConversationTopicHistoryLogDto } from './dto/update-user-conversation-topic-history-log.dto';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';

@Controller('userConversationTopicHistoryLog')
export class UserConversationTopicHistoryLogController {
  constructor(
    private readonly userConversationTopicHistoryLogService: UserConversationTopicHistoryLogService,
  ) {}

  // @Post()
  // create(
  //   @Body()
  //   createUserConversationTopicHistoryLogDto: CreateUserConversationTopicHistoryLogDto,
  // ) {
  //   return this.userConversationTopicHistoryLogService.create(
  //     createUserConversationTopicHistoryLogDto,
  //   );
  // }

  // @Get()
  // findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
  //   return this.userConversationTopicHistoryLogService.findAll(req);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userConversationTopicHistoryLogService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body()
  //   updateUserConversationTopicHistoryLogDto: UpdateUserConversationTopicHistoryLogDto,
  // ) {
  //   return this.userConversationTopicHistoryLogService.update(
  //     +id,
  //     updateUserConversationTopicHistoryLogDto,
  //   );
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userConversationTopicHistoryLogService.remove(+id);
  // }
}
