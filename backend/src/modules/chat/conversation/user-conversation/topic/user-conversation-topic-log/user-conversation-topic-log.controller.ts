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
import { UserConversationTopicLogService } from './user-conversation-topic-log.service';
import { CreateUserConversationTopicLogDto } from './dto/create-user-conversation-topic-log.dto';
import { UpdateUserConversationTopicLogDto } from './dto/update-user-conversation-topic-log.dto';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';

@Controller('userConversationTopicLog')
export class UserConversationTopicLogController {
  constructor(
    private readonly userConversationTopicLogService: UserConversationTopicLogService,
  ) {}

  // @Post()
  // create(
  //   @Body()
  //   createUserConversationTopicLogDto: CreateUserConversationTopicLogDto,
  // ) {
  //   return this.userConversationTopicLogService.create(
  //     createUserConversationTopicLogDto,
  //   );
  // }

  // @Get()
  // findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
  //   return this.userConversationTopicLogService.findAll(req);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userConversationTopicLogService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body()
  //   updateUserConversationTopicLogDto: UpdateUserConversationTopicLogDto,
  // ) {
  //   return this.userConversationTopicLogService.update(
  //     +id,
  //     updateUserConversationTopicLogDto,
  //   );
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userConversationTopicLogService.remove(+id);
  // }
}
