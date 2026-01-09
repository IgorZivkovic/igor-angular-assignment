import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

type AccessTokenResponse = {
  accessToken: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly _accessToken = signal<string | null>(null);

  readonly accessToken = this._accessToken.asReadonly();

  constructor(private readonly http: HttpClient) {}

  hasValidAccessToken(): boolean {
    const token = this._accessToken();
    if (!token) {
      return false;
    }
    const payload = this.decodeJwt(token);
    if (!payload) {
      return false;
    }
    if (!payload.exp) {
      return true;
    }
    return Date.now() < payload.exp * 1000;
  }

  getAccessToken(): string | null {
    return this._accessToken();
  }

  clearAccessToken(): void {
    this._accessToken.set(null);
  }

  login(payload: LoginPayload) {
    return this.http
      .post<AccessTokenResponse>(`${this.apiBaseUrl}/auth/login`, payload, {
        withCredentials: true,
      })
      .pipe(
      tap((response) => this._accessToken.set(response.accessToken)),
      map(() => undefined),
    );
  }

  refreshAccessToken() {
    return this.http
      .post<AccessTokenResponse>(`${this.apiBaseUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((response) => this._accessToken.set(response.accessToken)),
        map((response) => response.accessToken),
        catchError(() => {
          this.clearAccessToken();
          return of(null);
        }),
      );
  }

  logout() {
    return this.http
      .post(`${this.apiBaseUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => this.clearAccessToken()),
        map(() => undefined),
        catchError(() => {
          this.clearAccessToken();
          return of(undefined);
        }),
      );
  }

  private decodeJwt(token: string): { exp?: number } | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    try {
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '='));
      return JSON.parse(decoded) as { exp?: number };
    } catch {
      return null;
    }
  }
}
