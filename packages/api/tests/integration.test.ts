import request from 'supertest';
import { app } from '../src/index';
import { setLLMResponses } from '../../../tests/llm-mock';
import { setTestAuthEnv, authHeaders } from '../../../tests/auth-mock';

// Mock the openai SDK at module boundary (hoisted by ts-jest).
jest.mock('openai', () => require('../../../tests/llm-mock').openaiMockFactory());

describe('ContentCommand Integration Flow', () => {
  beforeAll(() => { setTestAuthEnv(); setLLMResponses({}); });

  it('Step 1: Parses an NLP command into structured intent', async () => {
    const res = await request(app)
      .post('/ai/parse-command')
      .set(authHeaders())
      .send({ rawText: 'Draft a funny tweet about AI integration' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.parsedCommand).toBeDefined();
    // The structured payload from the LLM mock carries the parsed topic
    expect(res.body.parsedCommand.topic).toBeDefined();
  });
});
