import request from 'supertest';
import { app } from '../packages/api/src/index';
import { PrismaClient } from '@contentcommand/database';

const prisma = new PrismaClient();

describe('Brand Kits API', () => {
  let createdId: string;

  it('POST /brand-kits should create a new brand kit', async () => {
    const payload = {
      workspaceId: 'test-ws-id',
      name: 'SuperTest Brand',
      hashtags: ['#test', '#jest'],
      bannedWords: ['fail'],
      voiceRules: 'Strictly testing'
    };

    const res = await request(app).post('/brand-kits').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('SuperTest Brand');
    expect(res.body.hashtags).toContain('#jest');

    createdId = res.body.id;
  });

  it('GET /brand-kits should return the created brand kit', async () => {
    const res = await request(app).get('/brand-kits?workspaceId=test-ws-id');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.some((b: any) => b.id === createdId)).toBe(true);
  });

  afterAll(async () => {
    if (createdId) {
      await prisma.brandKit.delete({ where: { id: createdId } });
    }
    await prisma.$disconnect();
  });
});
