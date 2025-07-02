import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AudioService } from './audio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { checkExistAndCreateFileName } from 'src/utils/string.utils';

const uploadPath = './uploads/audio';

@Public()
@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadPath, // folder to save files
        filename: (req, file, cb) => {
          // const uniqueName = `${generateUniqueId(file.originalname.replace(path.extname(file.originalname), ''))}${path.extname(file.originalname)}`;
          const uniqueName = checkExistAndCreateFileName(
            uploadPath,
            file.originalname,
          );
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'audio/mpeg',
          'audio/wav',
          'audio/mp3',
          'audio/wave',
        ];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only audio files are allowed!'), false);
        }
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    }),
  )
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    return {
      url: this.audioService.generateFileUrl(
        checkExistAndCreateFileName(uploadPath, file.originalname, false),
      ),
    };
  }

  @Get(':fileName')
  async Download(
    @Param('fileName') fileName: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const file = await this.audioService.getFile(fileName);

    // Set response headers
    res.setHeader('Content-Type', file.fileType.mime);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.fileName}.${file.fileType.ext}"`,
    );

    // Send the buffer as the response
    return new StreamableFile(file.buffer);
  }
}
