import { NextFunction, Request, Response } from 'express';

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     console.log('Request...', req.body);
//     next();
//   }
// }

export function findAllRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.query?.page) {
    req.query.page = '1';
  }

  if (!req.query?.count) {
    req.query.count = '12';
  }

  if (!req.query?.filters) {
    req.query.filters = [];
  }

  if (!req.query?.sorts) {
    req.query.sorts = [];
  }

  console.log('middle ware', req.query);

  next();
}
