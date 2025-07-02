import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as ft from 'file-type';
import { generateUniqueId } from '../third-party/groq/groq.service';

@Injectable()
export class AudioService {
  private audioFolder = path.join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'uploads/audio',
  );

  async createFile(buffer: Buffer, tempName: string) {
    if (!fs.existsSync(this.audioFolder)) {
      fs.mkdirSync(this.audioFolder, { recursive: true });
    }

    const uniqueName = `${generateUniqueId(tempName)}`;
    const fileType = await ft.fromBuffer(buffer);
    const fileName = `${uniqueName}.${fileType.ext}`;
    const filePath = path.join(this.audioFolder, `${fileName}`);

    fs.writeFileSync(filePath, buffer);
    console.log('File saved:', filePath);

    // Optionally return public URL if served statically
    return {
      name: fileName,
      url: this.generateFileUrl(fileName),
    };
  }

  async getFile(fileUniqueName: string) {
    const filePath = path.join(this.audioFolder, `${fileUniqueName}`);

    const file = fs.readFileSync(filePath);

    const fileType = await ft.fromBuffer(file);

    return {
      buffer: file,
      fileName: fileUniqueName,
      fileType,
    };
  }

  generateFileUrl(filename: string): string {
    return `${process.env.SERVER_DOMAIN}audio/${filename}`;
  }

  generateFileData(file: Express.Multer.File) {
    const url = this.generateFileUrl(file.originalname);
    const ext = file.originalname.split('.').at(-1);

    return {
      url,
      fileType: {
        mimetype: file.mimetype,
        ext,
      },
    };
  }
}
