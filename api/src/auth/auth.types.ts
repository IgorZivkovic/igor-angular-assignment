export type AuthRole = 'admin' | 'user';

export type AccessTokenPayload = {
  sub: number;
  email: string;
  role: AuthRole;
};

export type RefreshTokenPayload = AccessTokenPayload & {
  tokenVersion: number;
};
