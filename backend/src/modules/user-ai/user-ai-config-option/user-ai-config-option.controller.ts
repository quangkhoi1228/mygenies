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
import { UserAiConfigOptionService } from './user-ai-config-option.service';
import { CreateUserAiConfigOptionRawDto } from './dto/create-user-ai-config-option.dto';
import { UpdateUserAiConfigOptionDto } from './dto/update-user-ai-config-option.dto';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { PaginationDto } from 'src/shared/dto/find-request.dto';

@Controller('userAiConfigOption')
export class UserAiConfigOptionController {
  constructor(
    private readonly userAiConfigOptionService: UserAiConfigOptionService,
  ) {}

  @Post()
  create(
    @Body() createUserAiConfigOptionRawDto: CreateUserAiConfigOptionRawDto,
  ) {
    return this.userAiConfigOptionService.createRaw(
      createUserAiConfigOptionRawDto,
    );
  }

  @Get()
  findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
    return this.userAiConfigOptionService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAiConfigOptionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserAiConfigOptionDto: UpdateUserAiConfigOptionDto,
  ) {
    return this.userAiConfigOptionService.update(
      +id,
      updateUserAiConfigOptionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAiConfigOptionService.remove(+id);
  }
}
