/**
 * Shared LLM mock for API route tests.
 *
 * The AI providers now make REAL network calls and throw when keys are
 * missing (mock fallbacks were removed). Route tests mock the `openai` SDK
 * module instead — this keeps the full request → provider → parse → persist
 * path under test while staying hermetic.
 *
 * Usage in a test file (jest.mock is hoisted above imports by ts-jest):
 *
 *   jest.mock('openai', () => require('./openai-mock').openaiMockFactory());
 *   import { setLLMResponses } from './llm-mock';
 *
 *   setLLMResponses({ text: 'outline...' });           // plain completions
 *   setLLMResponses({ structured: { ... } });          // json_object completions
 */

type LLMResponses = { structured?: object; text?: string };

const state: LLMResponses = {};

export function setLLMResponses(responses: LLMResponses) {
  state.structured = responses.structured;
  state.text = responses.text;
  // Providers require a key to construct their client; provide a dummy so the
  // real request path runs and the mocked openai SDK intercepts the call.
  if (!process.env.DEEPSEEK_API_KEY && !process.env.OPENAI_API_KEY) {
    process.env.DEEPSEEK_API_KEY = 'test-key-for-llm-mock';
  }
}

export function getLLMResponses(): LLMResponses {
  return state;
}

// Default structured payload — union shape: each route reads only the fields
// it needs and zod strips extras. Serves videos (hook/scenes/cta) and the NLP
// parser (topic/platforms/tone/contentType/urgency).
export const DEFAULT_STRUCTURED_PAYLOAD = {
  hook: 'Stop scrolling — this changes everything.',
  scenes: [
    { number: 1, description: 'Opening establishing shot', voiceover: 'Did you know this?' },
    { number: 2, description: 'Detail b-roll', voiceover: 'Here is why it matters.' },
  ],
  cta: 'Follow for more.',
  topic: 'AI integration',
  platforms: ['Twitter', 'LinkedIn'],
  tone: 'Humorous',
  contentType: 'POST',
  urgency: false,
};

/**
 * Factory for jest.mock('openai', ...). Returns the module shape the
 * providers expect: default export = OpenAI client class.
 */
export function openaiMockFactory() {
  class MockOpenAI {
    chat = {
      completions: {
        create: async (req: any) => {
          const wantsJson = req?.response_format?.type === 'json_object';
          const payload = state.structured ?? DEFAULT_STRUCTURED_PAYLOAD;
          const content = wantsJson
            ? JSON.stringify(payload)
            : (state.text ?? 'Generated text from the model.');
          return {
            id: 'test-completion',
            model: req?.model ?? 'test-model',
            choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }],
            usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
          };
        },
      },
    };
    constructor(_opts?: any) {}
  }
  return { __esModule: true, default: MockOpenAI, OpenAI: MockOpenAI };
}
