import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ResourceBundleMetaService } from './resource-bundle-meta.service';
import { CreateResourceBundleMetaDto } from './dto/create-resource-bundle-meta.dto';
import { UpdateResourceBundleMetaDto } from './dto/update-resource-bundle-meta.dto';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';

@Controller('resource-bundle-meta')
export class ResourceBundleMetaController {
  constructor(
    private readonly resourceBundleMetaService: ResourceBundleMetaService,
  ) {}

  // @Post()
  // create(
  //   @Body() createResourceBundleMetaDto: CreateResourceBundleMetaDto,
  //   @Req() req: AuthRequest,
  // ) {
  //   return this.resourceBundleMetaService.create(
  //     createResourceBundleMetaDto,
  //     req,
  //   );
  // }

  // @Get()
  // findAll() {
  //   return this.resourceBundleMetaService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.resourceBundleMetaService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateResourceBundleMetaDto: UpdateResourceBundleMetaDto,
  // ) {
  //   return this.resourceBundleMetaService.update(
  //     +id,
  //     updateResourceBundleMetaDto,
  //   );
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.resourceBundleMetaService.remove(+id);
  // }
}
