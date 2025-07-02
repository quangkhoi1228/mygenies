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
import { UserConversationTopicService } from './user-conversation-topic.service';
import {
  CreateUserConversationTopicBaseDto,
  UserConversationTopicStatus,
  UserConversationTopicType,
} from './dto/create-user-conversation-topic.dto';
import { UpdateUserConversationTopicDto } from './dto/update-user-conversation-topic.dto';
import { AuthRequest } from '../../../../../auth/interface/auth-request.interface';
import { ApiBearerAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { UserConversationTopic } from './entities/user-conversation-topic.entity';
import { Public } from 'src/decorators/public.decorator';
import { PaginationDto } from 'src/shared/dto/find-request.dto';

@Controller('userConversationTopic')
@ApiBearerAuth()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer access token',
  required: true,
})
export class UserConversationTopicController {
  constructor(
    private readonly userConversationTopicService: UserConversationTopicService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Created record',
    type: UserConversationTopic,
  })
  create(
    @Body()
    createUserConversationTopicBaseDto: CreateUserConversationTopicBaseDto,
    @Req() req: AuthRequest,
  ) {
    return this.userConversationTopicService.create(
      createUserConversationTopicBaseDto,
      req,
    );
  }

  @Get()
  findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
    return this.userConversationTopicService.findAll(req);
  }

  @Public()
  @Get('config')
  async getConfig() {
    const userConversationTopicType = Object.entries(
      UserConversationTopicType,
    ).reduce(
      (a, v) => ({
        ...a,
        [v[0]]: v[1],
      }),
      {},
    );

    const userConversationTopicStatus = Object.entries(
      UserConversationTopicStatus,
    ).reduce(
      (a, v) => ({
        ...a,
        [v[0]]: v[1],
      }),
      {},
    );

    return { userConversationTopicType, userConversationTopicStatus };
  }

  @Get(':id')
  @ApiResponse({
    description: 'Record has ID',
    type: UserConversationTopic,
  })
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.userConversationTopicService.findOne(+id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserConversationTopicDto: UpdateUserConversationTopicDto,
    @Req() req: AuthRequest,
  ) {
    return this.userConversationTopicService.update(
      +id,
      updateUserConversationTopicDto,
      req,
    );
  }

  @Delete('history/:id')
  removeHistory(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.userConversationTopicService.removeHistory(+id, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.userConversationTopicService.remove(+id, req);
  }
}
