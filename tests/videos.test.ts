import request from 'supertest';
import { app } from '../packages/api/src/index';

describe('Video Projects API', () => {
  it('POST /video-projects/generate should generate and return a script', async () => {
    const payload = {
      workspaceId: 'test-ws-id',
      topic: 'AI Trends',
      tone: 'Energetic',
      durationSeconds: 30
    };

    const res = await request(app)
      .post('/video-projects/generate')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.project).toBeDefined();
    expect(res.body.script).toBeDefined();

    // Check mocked script structure
    expect(res.body.script.hook).toBeDefined();
    expect(Array.isArray(res.body.script.scenes)).toBe(true);
    // expect(res.body.script.thumbnailIdea).toBeDefined();
    expect(res.body.script.cta).toBeDefined();

    // Check saved project details
    expect(res.body.project.title).toBe('Video: AI Trends');
    expect(res.body.project.workspaceId).toBe('test-ws-id');
  });

  it('POST /video-projects/generate should return 400 for missing fields', async () => {
    const res = await request(app).post('/video-projects/generate').send({ topic: 'No Tone' });
    expect(res.status).toBe(400);
  });
});
