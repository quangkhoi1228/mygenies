import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { UserAiService } from './user-ai.service';
import { CreateUserAiRawDto } from './dto/create-user-ai.dto';
import { UpdateUserAiDto } from './dto/update-user-ai.dto';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { PaginationDto } from 'src/shared/dto/find-request.dto';

@Controller('userAi')
export class UserAiController {
  constructor(private readonly userAiService: UserAiService) {}

  @Post()
  create(
    @Body() createUserAiRawDto: CreateUserAiRawDto,
    @Req() req: AuthRequest,
  ) {
    return this.userAiService.createByRaw(createUserAiRawDto, req);
  }

  @Get()
  findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
    return this.userAiService.findAll(req);
  }

  @Get('translate/:id')
  translateUserAiInfo(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.userAiService.translateUserAiInfoRaw(+id, req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.userAiService.findOne(+id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserAiDto: UpdateUserAiDto,
    @Req() req: AuthRequest,
  ) {
    return this.userAiService.update(+id, updateUserAiDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.userAiService.remove(+id, req);
  }
}
