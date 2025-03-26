import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UNAUTHORIZED } from '../../../common/constants/errorMessages.constant';
import { TokenService } from 'src/modules/auth/services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private tokenService: TokenService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check publick endpoints
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    let token: string;

    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    }
    if (!token) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    const decoded = await this.tokenService.verifyAccessToken(token);
    const decodedData = JSON.stringify(decoded);

    // add auth user id in request
    request.user = {
      id: JSON.parse(decodedData).id,
    };
    return true;
  }
}
