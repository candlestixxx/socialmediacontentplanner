import request from 'supertest';
import { app } from '../packages/api/src/index';

describe('Podcast Projects API', () => {
  it('POST /podcasts/generate should generate and return a podcast outline', async () => {
    const payload = {
      workspaceId: 'test-ws-id',
      topic: 'Future of Work',
      tone: 'Educational',
      durationMinutes: 45
    };

    const res = await request(app)
      .post('/podcasts/generate')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.project).toBeDefined();
    expect(res.body.outline).toBeDefined();

    // Check saved project details
    expect(res.body.project.title).toBe('Podcast Ep 1');
    expect(res.body.project.workspaceId).toBe('test-ws-id');
  });

  it('POST /podcasts/generate should return 400 for missing fields', async () => {
    const res = await request(app).post('/podcasts/generate').send({ topic: 'No Tone' });
    expect(res.status).toBe(400);
  });
});
