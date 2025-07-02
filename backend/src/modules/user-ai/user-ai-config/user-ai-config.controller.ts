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
import { UserAiConfigService } from './user-ai-config.service';
import { CreateUserAiConfigDto } from './dto/create-user-ai-config.dto';
import { UpdateUserAiConfigDto } from './dto/update-user-ai-config.dto';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { PaginationDto } from 'src/shared/dto/find-request.dto';

@Controller('userAiConfig')
export class UserAiConfigController {
  constructor(private readonly userAiConfigService: UserAiConfigService) {}

  @Post()
  create(@Body() createUserAiConfigDto: CreateUserAiConfigDto) {
    return this.userAiConfigService.create(createUserAiConfigDto);
  }

  @Get()
  findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
    return this.userAiConfigService.findAll(req);
  }

  @Get('listConfig')
  getListConfig(@Req() req: AuthRequest) {
    return this.userAiConfigService.getListConfig(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAiConfigService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserAiConfigDto: UpdateUserAiConfigDto,
  ) {
    return this.userAiConfigService.update(+id, updateUserAiConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAiConfigService.remove(+id);
  }
}
