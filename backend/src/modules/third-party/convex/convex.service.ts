import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConvexHttpClient, ConvexClient } from 'convex/browser';
import axios from 'axios';
import * as ft from 'file-type';

@Injectable()
export class ConvexService {
  constructor() {}

  getConvexHttpClient() {
    return new ConvexHttpClient(process.env.CONVEX_URL);
  }

  getConvexClient() {
    return new ConvexClient(process.env.CONVEX_URL);
  }

  async handleUploadFile(buffer: Buffer) {
    try {
      const fileType = await ft.fromBuffer(buffer);

      const sendFileUrl = new URL(
        `${process.env.CONVEX_HTTP_ACTION_URL}/sendFile`,
      );
      sendFileUrl.searchParams.set('author', 'KuDo Backend');

      const response = await axios.post(sendFileUrl.toString(), buffer, {
        headers: {
          'Content-Type': fileType?.mime ? fileType.mime : 'image/png',
        },
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
