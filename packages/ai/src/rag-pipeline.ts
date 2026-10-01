import { AIProvider } from './providers';
import { ResearchService } from './research/service';
import { ContentContext } from './content-generators';
import { buildBrandVoiceBlock, buildBusinessTypeBlock, SYSTEM_PROMPT_RULES } from './prompts/templates';

/**
 * RAG-Enhanced Content Generation Pipeline
 * Combines web research (RAG) with brand voice and business type context
 * to generate grounded, on-brand content.
 */
export class RAGContentPipeline {
  constructor(
    private aiProvider: AIProvider,
    private researchService: ResearchService
  ) {}

  /**
   * Generates content grounded in research data + brand voice.
   * 1. Research the topic (RAG)
   * 2. Build a context block with key facts and sources
   * 3. Generate content with brand voice injection
   */
  async generateWithResearch(
    topic: string,
    platform: string,
    context: ContentContext,
    researchUrls: string[] = []
  ): Promise<{ content: string; hashtags: string[]; researchSources: string[] }> {
    // Step 1: RAG research
    const research = await this.researchService.researchTopic(topic, researchUrls);

    // Step 2: Build grounded context block
    const researchBlock = [
      '--- RESEARCH CONTEXT (from web sources) ---',
      `Topic: ${research.topic}`,
      `Summary: ${research.summary}`,
      '',
      'Key Facts:',
      ...research.keyFacts.map((f: string, i: number) => `${i + 1}. ${f}`),
      '',
      'Suggested Angles:',
      ...research.suggestedAngles.map((a: string, i: number) => `${i + 1}. ${a}`),
      '',
      'Sources: ' + research.sourceLinks.join(', '),
      '--- END RESEARCH CONTEXT ---',
    ].join('\n');

    // Step 3: Build full prompt with brand voice + business type + research
    const brandBlock = context.brandVoice ? buildBrandVoiceBlock(context.brandVoice) : '';
    const bizBlock = context.businessType ? buildBusinessTypeBlock(context.businessType) : '';

    const fullPrompt = [
      SYSTEM_PROMPT_RULES,
      brandBlock,
      bizBlock,
      researchBlock,
      '',
      `Generate a ${platform} post about: ${topic}`,
      `Use the research facts above for accuracy. Match the brand voice exactly.`,
    ].join('\n\n');

    // Step 4: Generate structured content
    const schema = {
      type: 'object',
      properties: {
        content: { type: 'string' },
        hashtags: { type: 'array', items: { type: 'string' } },
      },
      required: ['content'],
    };

    const parsed = await this.aiProvider.generateStructuredResponse<{ content: string; hashtags: string[] }>(fullPrompt, schema);

    return {
      content: parsed.content,
      hashtags: parsed.hashtags || [],
      researchSources: research.sourceLinks,
    };
  }

  /**
   * Generates a video script grounded in research.
   */
  async generateVideoScriptWithResearch(
    topic: string,
    context: ContentContext,
    duration: number = 60
  ) {
    const research = await this.researchService.researchTopic(topic);

    const researchBlock = [
      '--- RESEARCH CONTEXT ---',
      research.summary,
      'Key Facts: ' + research.keyFacts.slice(0, 5).join('; '),
      '--- END RESEARCH ---',
    ].join('\n');

    const fullPrompt = [
      SYSTEM_PROMPT_RULES,
      context.brandVoice ? buildBrandVoiceBlock(context.brandVoice) : '',
      researchBlock,
      '',
      `Create a ${duration}-second promotional video script about: ${topic}`,
      'Structure: hook (0-5s), problem (5-15s), solution (15-35s), social proof (35-50s), CTA (50-60s)',
    ].join('\n\n');

    return this.aiProvider.generateStructuredResponse<string>(fullPrompt, {
      type: 'string',
      description: 'Video script with scene breakdowns',
    });
  }
}
