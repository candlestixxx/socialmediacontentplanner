import request from 'supertest';
import { app } from '../packages/api/src/index';
import { setLLMResponses } from './llm-mock';
import { setTestAuthEnv, authHeaders } from './auth-mock';

// Mock the openai SDK at module boundary (hoisted by ts-jest).
jest.mock('openai', () => require('./llm-mock').openaiMockFactory());

describe('Podcast Projects API', () => {
  beforeAll(() => { setTestAuthEnv(); setLLMResponses({ text: 'EPISODE OUTLINE\n1. Intro\n2. Segments' }); });

  it('POST /podcasts/generate should generate and return a podcast outline', async () => {
    const payload = {
      workspaceId: 'test-ws-id',
      topic: 'Future of Work',
      tone: 'Educational',
      durationMinutes: 45
    };

    const res = await request(app)
      .post('/podcasts/generate')
      .set(authHeaders())
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.project).toBeDefined();
    expect(res.body.outline).toBeDefined();

    // Persisted project carries the requested topic as its title
    expect(res.body.project.title).toBe('Future of Work');
    expect(res.body.project.workspaceId).toBe('test-ws-id');
  });

  it('POST /podcasts/generate should return 400 for missing fields', async () => {
    const res = await request(app).post('/podcasts/generate').set(authHeaders()).send({ topic: 'No Tone' });
    expect(res.status).toBe(400);
  });
});
