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
import { OnboardPhaseService } from './onboard-phase.service';
import { CreateOnboardPhaseDto } from './dto/create-onboard-phase.dto';
import { UpdateOnboardPhaseDto } from './dto/update-onboard-phase.dto';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { OnboardPhase } from './entities/onboard-phase.entity';
import { ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { PaginationDto } from 'src/shared/dto/find-request.dto';

@Public()
@Controller('onboardPhase')
export class OnboardPhaseController {
  constructor(private readonly onboardPhaseService: OnboardPhaseService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Created record',
    type: OnboardPhase,
  })
  create(
    @Body() createOnboardPhaseDto: CreateOnboardPhaseDto,
    @Req() req: AuthRequest,
  ) {
    return this.onboardPhaseService.create(createOnboardPhaseDto, req);
  }

  @Get()
  findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
    return this.onboardPhaseService.findAll(req);
  }

  @Get(':id')
  @ApiResponse({
    description: 'Record has ID',
    type: OnboardPhase,
  })
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    if (isNaN(+id)) {
      return this.onboardPhaseService.findOneByName(id, req);
    } else {
      return this.onboardPhaseService.findOne(+id, req);
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOnboardPhaseDto: UpdateOnboardPhaseDto,
    @Req() req: AuthRequest,
  ) {
    return this.onboardPhaseService.update(+id, updateOnboardPhaseDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.onboardPhaseService.remove(+id, req);
  }
}
