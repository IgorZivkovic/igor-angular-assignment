import type { AuthRole } from '@shared';

export type { AuthRole };

export type AccessTokenPayload = {
  sub: number;
  email: string;
  role: AuthRole;
};

export type RefreshTokenPayload = AccessTokenPayload & {
  tokenVersion: number;
};
