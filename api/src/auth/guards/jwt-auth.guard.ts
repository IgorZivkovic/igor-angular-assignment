import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly docsPrefix: string;

  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
  ) {
    super();
    const apiPrefix = this.normalizeSegment(this.config.get('API_PREFIX', 'api'));
    const apiVersion = this.normalizeSegment(this.config.get('API_VERSION', 'v1'));
    const basePrefix = this.normalizePath(`/${apiPrefix}/${apiVersion}`);
    this.docsPrefix = `${basePrefix}/docs`;
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    if (this.isSwaggerRequest(request)) {
      return true;
    }
    return super.canActivate(context);
  }

  private isSwaggerRequest(request: Request | undefined) {
    if (!request) {
      return false;
    }
    const path = request.path ?? request.url ?? '';
    return (
      path === this.docsPrefix ||
      path.startsWith(`${this.docsPrefix}/`) ||
      path === `${this.docsPrefix}-json`
    );
  }

  private normalizeSegment(value: string) {
    return value.replace(/^\/+|\/+$/g, '');
  }

  private normalizePath(value: string) {
    return value.replace(/\/+/g, '/').replace(/\/$/, '');
  }
}
