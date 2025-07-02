import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest } from './interface/auth-request.interface';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

@Controller('auth')
@ApiBearerAuth()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer access token',
  required: true,
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('checkAuthen')
  async checkAuthen(@Req() req: AuthRequest) {
    if (req.user && req.user.clerkUserId) {
      return true;
    } else {
      return false;
    }
  }

  @Get('profile')
  getProfile(@Req() req: AuthRequest) {
    return req.user;
  }
}
