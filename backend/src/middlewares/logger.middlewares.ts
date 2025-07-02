import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { formatDateToYYYYMMDDHHMM } from '../utils/date.util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log('------[Receive request log]-----------------------------\n');

    console.log(
      formatDateToYYYYMMDDHHMM(new Date()),
      ' - ',
      req.method,
      req.baseUrl,
      req.method === 'GET' ? req.query : req.body,
    );

    const checkDate = new Date();

    console.log(
      '\n------[End of Receive request log]----------------------\n\n',
    );

    const originalSend = res.send;

    // Override the send method to log the response
    res.send = function (body: any): Response {
      console.log('\n------[Response request log]----------------------\n\n');

      console.log(
        `\nProcess time: ${new Date().getTime() - checkDate.getTime()}ms\n\n`,
      );
      console.log(
        formatDateToYYYYMMDDHHMM(new Date()),
        ' - ',
        req.method,
        req.originalUrl,
        req.method === 'GET' ? req.query : JSON.parse(JSON.stringify(req.body)),
      );
      console.log(
        formatDateToYYYYMMDDHHMM(new Date()),
        ' - ',
        'API Response',
        body,
      );

      console.log(
        '\n------[End of Response request log]----------------------\n\n',
      );

      // Call the original send method
      // eslint-disable-next-line prefer-rest-params
      return originalSend.apply(this, arguments);
    };

    next();
  }
}
