import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { UserActiveAiService } from './user-active-ai.service';
import { CreateUserActiveAiDto } from './dto/create-user-active-ai.dto';
import { UpdateUserActiveAiDto } from './dto/update-user-active-ai.dto';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';

@Controller('userActiveAi')
export class UserActiveAiController {
  constructor(private readonly userActiveAiService: UserActiveAiService) {}

  @Post()
  create(
    @Body() createUserActiveAiDto: CreateUserActiveAiDto,
    @Req() req: AuthRequest,
  ) {
    return this.userActiveAiService.create(createUserActiveAiDto, req);
  }

  // @Get()
  // findAll() {
  //   return this.userActiveAiService.findAll();
  // }

  @Get()
  findActiveByUser(@Req() req: AuthRequest) {
    return this.userActiveAiService.findActiveByUser(req);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userActiveAiService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserActiveAiDto: UpdateUserActiveAiDto,
    @Req() req: AuthRequest,
  ) {
    return this.userActiveAiService.update(+id, updateUserActiveAiDto, req);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userActiveAiService.remove(+id);
  // }
}
