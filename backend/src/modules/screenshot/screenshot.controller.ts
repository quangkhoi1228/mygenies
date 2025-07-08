import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PaginationDto } from 'src/shared/dto/find-request.dto';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { CreateScreenshotDto } from './dto/create-screenshot.dto';
import { UpdateScreenshotDto } from './dto/update-screenshot.dto';
import { ScreenshotService } from './screenshot.service';

@Controller('screenshot')
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) {}

  @Post()
  // @UseGuards(AdminAuthGuard)
  create(
    @Body() createScreenshotDto: CreateScreenshotDto,
    @Req() req: AuthRequest,
  ) {
    return this.screenshotService.create(createScreenshotDto, req);
  }

  @Get()
  findAll(@Query() query: PaginationDto, @Req() req: AuthRequest) {
    return this.screenshotService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (isNaN(+id)) {
      return this.screenshotService.findOneByName(id);
    } else {
      return this.screenshotService.findOne(+id);
    }
  }

  @Patch(':id')
  // @UseGuards(AdminAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateScreenshotDto: UpdateScreenshotDto,
    @Req() req: AuthRequest,
  ) {
    return this.screenshotService.update(+id, updateScreenshotDto, req);
  }

  @Delete(':id')
  // @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.screenshotService.remove(+id);
  }
}
