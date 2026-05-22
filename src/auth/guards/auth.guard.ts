import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const headers = request.headers;
    const authorization = headers.authorization || '';
    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const payload = this.authService.verifyToken(token);
    request.user = await this.usersService.findById(payload.sub);

    return true;
  }
}
