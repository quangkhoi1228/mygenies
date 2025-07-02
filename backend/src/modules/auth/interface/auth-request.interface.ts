import { Request } from 'express';
import { JwtUserInfo } from './jwt-payload.interface';

// Create a new type that extends express.Request
export type AuthRequest = Request & {
  user: JwtUserInfo;
};
