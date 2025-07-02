import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { OnboardProcessService } from './onboard-process.service';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { ApiBearerAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { OnboardProcessStatusDto } from './dto/onboard-process.dto';
// import { Public } from 'src/decorators/public.decorator';
import { OnboardPhase } from '../onboard-phase/entities/onboard-phase.entity';
import { ReturnMessageDto } from 'src/shared/dto/return-message.dto';

@ApiBearerAuth()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer access token',
  required: true,
})
// @Public()
@Controller('onboardProcess')
export class OnboardProcessController {
  constructor(private readonly onboardProcessService: OnboardProcessService) {}

  @Post('setup')
  @ApiResponse({
    description: 'Setup after onboard',
    type: ReturnMessageDto,
  })
  async setup(@Req() req: AuthRequest) {
    return this.onboardProcessService.setup(req);
  }

  @Get('status')
  @ApiResponse({
    description: 'Step in the onboard process',
    type: OnboardProcessStatusDto,
  })
  async getOnboardStatus(@Req() req: AuthRequest) {
    return this.onboardProcessService.getOnboardStatus(req);
  }

  @Get('status/:code')
  @ApiResponse({
    description: 'Step in the onboard process',
    type: OnboardProcessStatusDto,
  })
  async getOnboardStatusByCode(
    @Param('code') code: string,
    @Req() req: AuthRequest,
  ) {
    return this.onboardProcessService.getOnboardStatusByCode(code, req);
  }

  @Get('detail/:code')
  @ApiResponse({
    description: 'Step in the onboard process',
    type: OnboardPhase,
  })
  async getDetailStepOnboardProcess(
    @Param('code') code: string,
    @Req() req: AuthRequest,
  ) {
    return this.onboardProcessService.getDetailStepOnboardProcess(code, req);
  }
}
