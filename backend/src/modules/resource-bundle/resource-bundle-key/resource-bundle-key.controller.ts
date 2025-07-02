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
import { ResourceBundleKeyService } from './resource-bundle-key.service';
import { CreateResourceBundleKeyDto } from './dto/create-resource-bundle-key.dto';
import { UpdateResourceBundleKeyDto } from './dto/update-resource-bundle-key.dto';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';

@Controller('resource-bundle-key')
export class ResourceBundleKeyController {
  constructor(
    private readonly resourceBundleKeyService: ResourceBundleKeyService,
  ) {}

  // @Post()
  // create(
  //   @Body() createResourceBundleKeyDto: CreateResourceBundleKeyDto,
  //   @Req() req: AuthRequest,
  // ) {
  //   return this.resourceBundleKeyService.create(
  //     createResourceBundleKeyDto,
  //     req,
  //   );
  // }

  // @Get()
  // findAll(@Req() req: AuthRequest) {
  //   return this.resourceBundleKeyService.findAll(req);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string, @Req() req: AuthRequest) {
  //   return this.resourceBundleKeyService.findOne(+id, req);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateResourceBundleKeyDto: UpdateResourceBundleKeyDto,
  // ) {
  //   return this.resourceBundleKeyService.update(
  //     +id,
  //     updateResourceBundleKeyDto,
  //   );
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.resourceBundleKeyService.remove(+id);
  // }
}
