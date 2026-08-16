import 'dotenv/config';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';

describe('GET /api/v1/health', () => {
  it('should return the health status', async () => {
    const res = await axios.get(`/api/v1/health`);

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({ status: 'ok' });
    expect(typeof res.data.timestamp).toBe('string');
  });
});

describe('Users RBAC', () => {
  const jwtService = new JwtService();
  const createAccessToken = (role: 'admin' | 'user') =>
    jwtService.sign(
      {
        sub: role === 'admin' ? 1 : 999,
        email: `${role}@example.com`,
        role,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET ?? 'change-me-access',
        expiresIn: '5m',
      },
    );
  const userAuthorization = { Authorization: `Bearer ${createAccessToken('user')}` };
  const adminAuthorization = { Authorization: `Bearer ${createAccessToken('admin')}` };
  const userPayload = {
    name: 'RBAC Test User',
    birthday: '1990-01-01',
    gender: 'other',
    country: 'Serbia',
  };

  it('allows the user role to read users', async () => {
    const response = await axios.get('/api/v1/users?page=1&pageSize=1', {
      headers: userAuthorization,
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.data)).toBe(true);
  });

  it('requires authentication for write requests', async () => {
    const response = await axios.post('/api/v1/users', userPayload, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
    expect(response.data).toMatchObject({
      statusCode: 401,
      errorCode: 'UNAUTHORIZED',
    });
  });

  it.each([
    ['POST', '/api/v1/users', userPayload],
    ['PUT', '/api/v1/users/1', userPayload],
    ['DELETE', '/api/v1/users/1', undefined],
  ])('forbids the user role from %s requests', async (method, url, data) => {
    const response = await axios.request({
      method,
      url,
      data,
      headers: userAuthorization,
      validateStatus: () => true,
    });

    expect(response.status).toBe(403);
    expect(response.data).toMatchObject({
      statusCode: 403,
      errorCode: 'FORBIDDEN',
    });
  });

  it('allows the admin role to create and delete users', async () => {
    const created = await axios.post('/api/v1/users', userPayload, {
      headers: adminAuthorization,
    });

    try {
      expect(created.status).toBe(201);
      expect(created.data).toMatchObject(userPayload);
    } finally {
      if (created.data?.id) {
        const removed = await axios.delete(`/api/v1/users/${created.data.id}`, {
          headers: adminAuthorization,
          validateStatus: () => true,
        });
        expect(removed.status).toBe(200);
      }
    }
  });
});
