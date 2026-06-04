import request from 'supertest';
import { app } from '../src/index';

describe('ContentCommand Integration Flow', () => {
  it('Step 1: Parses an NLP command into structured intent', async () => {
    const res = await request(app)
      .post('/ai/parse-command')
      .send({ rawText: 'Draft a funny tweet about AI integration' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.parsedCommand).toBeDefined();
    // Assuming the mock/fallback logic extracts a topic substring or default
    expect(res.body.parsedCommand.topic).toBeDefined();
  });
});
