import request from 'supertest';
import { app } from '../packages/api/src/index';
import { setTestAuthEnv, authHeaders } from './auth-mock';

beforeAll(() => setTestAuthEnv());

describe('Campaigns & Posts API', () => {
  it('GET /campaigns should return a list', async () => {
    const res = await request(app).get('/campaigns?workspaceId=test-ws').set(authHeaders());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /posts should return a list', async () => {
    const res = await request(app).get('/posts?workspaceId=test-ws').set(authHeaders());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
