import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';
import { ClerkService } from '../third-party/clerk/clerk.service';
import { UserService } from '../user/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly clerkService: ClerkService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('__AuthGuard__');

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token && !isPublic) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.clerkService.verifyToken(token);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      request.user = {
        clerkUserId: payload.sub,
        sessionId: payload.sid,
        // fva: payload.fva,
        // v: payload.v,
        // iss: payload.iss,
        // iat: payload.iat,
        // nbf: payload.nbf,
      };

      let user = await this.userService.findOneByClerkId(payload.sub);

      if (!user) {
        console.log('[AuthGuard] > User not found, creating new user');
        // auto create user
        user = await this.userService.createByToken(request);

        console.log('[AuthGuard] > User created:', user.id);
      }

      request.user.userId = user.id;

      // // add function permission
      // const userFunctionPermission =
      //   await this.userFunctionPermissionService.findByUserId(
      //     request.user.userId,
      //     request,
      //   );

      // if (userFunctionPermission) {
      //   request.userFunctionPermission =
      //     userFunctionPermission.customPermission ??
      //     userFunctionPermission.defaultPermission;
      // }
    } catch (error) {
      if (!isPublic) {
        console.error(error);
        throw new UnauthorizedException();
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
