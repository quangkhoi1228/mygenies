import { Controller, Post, Body, Req, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserRawDto } from './dto/create-user.dto';
import { AuthRequest } from '../../auth/interface/auth-request.interface';
import { UpdateUserRawDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

@Controller('user')
@ApiBearerAuth()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer access token',
  required: true,
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('createByToken')
  createByToken(@Req() req: AuthRequest) {
    return this.userService.createByToken(req);
  }

  @Post('createByRaw')
  createByRaw(@Body() createUserRawDto: CreateUserRawDto) {
    return this.userService.createByRaw(createUserRawDto);
  }

  @Get('currentUser')
  currentUser(@Req() req: AuthRequest) {
    return this.userService.currentUser(req);
  }

  @Patch()
  updateUser(
    @Body() updateUserRawDto: UpdateUserRawDto,
    @Req() req: AuthRequest,
  ) {
    return this.userService.updateUser(updateUserRawDto, req);
  }

  @Get('checkUserIsWhitelist')
  checkUserIsWhitelist(@Req() req: AuthRequest) {
    return this.userService.checkUserIsWhitelist(req);
  }
}
