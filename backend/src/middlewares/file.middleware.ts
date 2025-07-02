import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction, Request } from 'express';

@Injectable()
export class FileMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...file');
    console.log(req);

    if (req.params.filename && req.params.filename.split('.').pop() === 'zip') {
    }

    next();
  }
}
