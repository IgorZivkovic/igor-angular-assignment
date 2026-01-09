import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import type { Request } from 'express';
import { AuthRateLimitService } from '../auth-rate-limit.service';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly rateLimit: AuthRateLimitService,
  ) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(request: Request, email: string, password: string) {
    this.rateLimit.assertWithinLimit(`login:${this.getClientId(request)}`);
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  private getClientId(request: Request) {
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
      return forwarded.split(',')[0]?.trim();
    }
    if (Array.isArray(forwarded) && forwarded.length > 0) {
      return forwarded[0];
    }
    return request.ip ?? request.socket.remoteAddress ?? 'unknown';
  }
}
