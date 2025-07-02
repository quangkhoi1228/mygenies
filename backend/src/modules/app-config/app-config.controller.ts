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
import { AppConfigService } from './app-config.service';
import { ConfigType, CreateAppConfigDto } from './dto/create-app-config.dto';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { Public } from 'src/decorators/public.decorator';
import { PaginationDto } from 'src/shared/dto/find-request.dto';

@Public()
@Controller('appConfig')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Post()
  // @UseGuards(AdminAuthGuard)
  create(
    @Body() createAppConfigDto: CreateAppConfigDto,
    @Req() req: AuthRequest,
  ) {
    return this.appConfigService.createOrUpdateConfig(createAppConfigDto, req);
  }

  @Get()
  findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
    return this.appConfigService.findAll(req);
  }

  @Public()
  @Get('config')
  async getContractConfig() {
    const configType = Object.entries(ConfigType).reduce(
      (a, v) => ({
        ...a,
        [v[0]]: v[1],
      }),
      {},
    );

    return { configType };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (isNaN(+id)) {
      return this.appConfigService.findOneByName(id);
    } else {
      return this.appConfigService.findOne(+id);
    }
  }

  @Patch(':id')
  // @UseGuards(AdminAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAppConfigDto: UpdateAppConfigDto,
    @Req() req: AuthRequest,
  ) {
    return this.appConfigService.update(+id, updateAppConfigDto, req);
  }

  @Delete(':id')
  // @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.appConfigService.remove(+id, req);
  }
}
