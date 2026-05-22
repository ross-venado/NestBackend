import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type TokenPayload = {
  sub: string;
  email: string;
  role: string;
  nonce: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async register(data: RegisterDto) {
    const user = await this.usersService.create(data);
    return {
      user: this.usersService.sanitize(user),
      token: this.signToken({
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
        nonce: randomBytes(8).toString('hex'),
      }),
    };
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user || !this.usersService.verifyPassword(user, data.password)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      user: this.usersService.sanitize(user),
      token: this.signToken({
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
        nonce: randomBytes(8).toString('hex'),
      }),
    };
  }

  verifyToken(token: string): TokenPayload {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) {
      throw new UnauthorizedException('Invalid token');
    }

    const expected = this.sign(payload);
    if (signature.length !== expected.length) {
      throw new UnauthorizedException('Invalid token');
    }

    const isValid = timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid token');
    }

    return JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as TokenPayload;
  }

  private signToken(payload: TokenPayload): string {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      'base64url',
    );
    return `${encodedPayload}.${this.sign(encodedPayload)}`;
  }

  private sign(payload: string): string {
    return createHmac(
      'sha256',
      this.configService.get<string>('AUTH_TOKEN_SECRET') || 'dev-secret',
    )
      .update(payload)
      .digest('base64url');
  }
}
