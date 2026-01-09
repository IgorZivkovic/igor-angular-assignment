import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

@Injectable()
export class AuthRateLimitService {
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly attempts = new Map<string, RateLimitEntry>();

  constructor(private readonly config: ConfigService) {
    const maxAttempts = Number(this.config.get('AUTH_RATE_LIMIT_MAX', 10));
    const windowMs = Number(this.config.get('AUTH_RATE_LIMIT_WINDOW_MS', 60_000));
    this.maxAttempts = Number.isFinite(maxAttempts) ? maxAttempts : 10;
    this.windowMs = Number.isFinite(windowMs) ? windowMs : 60_000;
  }

  assertWithinLimit(key: string) {
    const now = Date.now();
    const existing = this.attempts.get(key);

    if (!existing || existing.resetAt <= now) {
      this.attempts.set(key, { count: 1, resetAt: now + this.windowMs });
      return;
    }

    if (existing.count >= this.maxAttempts) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    existing.count += 1;
  }
}
