import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConvexService } from './convex.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../../../decorators/public.decorator';

@Public()
@Controller('convex')
export class ConvexController {
  constructor(private readonly convexService: ConvexService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const storageId = await this.convexService.handleUploadFile(file.buffer);

    return {
      convexUrl: `${process.env.CONVEX_HTTP_ACTION_URL}/getFile?storageId=${storageId}`,
    };
  }
}
