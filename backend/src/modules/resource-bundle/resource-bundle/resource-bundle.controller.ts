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
import { ResourceBundleService } from './resource-bundle.service';
import { CreateResourceBundleDto } from './dto/create-resource-bundle.dto';
import { UpdateResourceBundleDto } from './dto/update-resource-bundle.dto';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
import { LangCodes, LangCodesEnum } from './entities/resource-bundle.entity';
import { Public } from 'src/decorators/public.decorator';
import { PaginationDto } from 'src/shared/dto/find-request.dto';

@Public()
@Controller('resourceBundle')
export class ResourceBundleController {
  constructor(private readonly resourceBundleService: ResourceBundleService) {}

  @Post()
  create(
    @Body() createResourceBundleDto: CreateResourceBundleDto,
    @Req() req: AuthRequest,
  ) {
    return this.resourceBundleService.create(createResourceBundleDto, req);
  }

  @Get()
  findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
    return this.resourceBundleService.findAll(req);
  }

  @Public()
  @Get('config')
  async getContractConfig() {
    return { LangCodes };
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    let keyValueOnly = false;
    if (req.query['keyValueOnly'] && req.query['keyValueOnly'] === '1') {
      keyValueOnly = true;
    }

    if (Object.keys(LangCodesEnum).includes(id)) {
      return this.resourceBundleService.findAllByLangCode(
        id as LangCodesEnum,
        keyValueOnly,
      );
    } else {
      return this.resourceBundleService.findOne(+id, req);
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResourceBundleDto: UpdateResourceBundleDto,
    @Req() req: AuthRequest,
  ) {
    return this.resourceBundleService.update(+id, updateResourceBundleDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.resourceBundleService.remove(+id, req);
  }
}
