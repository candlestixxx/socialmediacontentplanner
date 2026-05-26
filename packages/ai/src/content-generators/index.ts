import { z } from 'zod';
import { AIProvider } from '../providers';
import { SYSTEM_PROMPT_RULES, buildContentPrompt } from '../prompts/templates';

const PostIdeasSchema = z.object({
  ideas: z.array(z.string()),
});

const PlatformPostSchema = z.object({
  content: z.string(),
  hashtags: z.array(z.string()),
  mediaSuggestions: z.string().optional(),
});

const HeadlinesSchema = z.object({
  headlines: z.array(z.string()),
});

const HashtagsSchema = z.object({
  hashtags: z.array(z.string()),
});

const VideoScriptSchema = z.object({
  hook: z.string(),
  scenes: z.array(z.object({ description: z.string(), voiceover: z.string().optional(), onScreenText: z.string().optional(), bRollSuggestion: z.string().optional() })),
  cta: z.string(),
  captions: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  thumbnailIdea: z.string().optional(),
  musicStyle: z.string().optional()
});

const PodcastOutlineSchema = z.object({
  title: z.string(),
  segments: z.array(z.object({ title: z.string(), talkingPoints: z.array(z.string()) })),
});

const LandingPageCopySchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  benefits: z.array(z.string()),
  cta: z.string(),
});

const CampaignPlanSchema = z.object({
  posts: z.array(z.object({ day: z.number(), platform: z.string(), contentIdea: z.string() })),
});

export class ContentGenerator {
  constructor(private provider: AIProvider) {}

  private async generate<T>(prompt: string, schema: z.ZodSchema<T>): Promise<T> {
    const fullPrompt = `${SYSTEM_PROMPT_RULES}\n\n${prompt}`;
    const response = await this.provider.generateStructuredResponse<T>(fullPrompt, schema);
    return schema.parse(response);
  }

  async generatePostIdeas(topic: string, category: string, audience: string, tone: string) {
    return this.generate(buildContentPrompt(topic, tone, `Category: ${category}, Audience: ${audience}`), PostIdeasSchema);
  }

  async generatePlatformPost(topic: string, platform: string, tone: string, goal: string) {
    return this.generate(buildContentPrompt(topic, tone, `Platform: ${platform}, Goal: ${goal}`), PlatformPostSchema);
  }

  async generateHeadlines(topic: string, tone: string) {
    return this.generate(buildContentPrompt(topic, tone, 'Generate 5 catchy headlines.'), HeadlinesSchema);
  }

  async generateHashtags(topic: string, platform: string) {
    return this.generate(buildContentPrompt(topic, 'Neutral', `Platform: ${platform}. Generate 10 relevant hashtags.`), HashtagsSchema);
  }

  async generateShortVideoScript(topic: string, tone: string, durationSeconds: number) {
    return this.generate(buildContentPrompt(topic, tone, `Short form video script for ${durationSeconds} seconds.`), VideoScriptSchema);
  }

  async generatePodcastOutline(topic: string, tone: string, durationMinutes: number) {
    return this.generate(buildContentPrompt(topic, tone, `Podcast outline for ${durationMinutes} minutes.`), PodcastOutlineSchema);
  }

  async generateLandingPageCopy(topic: string, goal: string, audience: string) {
    return this.generate(buildContentPrompt(topic, 'Persuasive', `Goal: ${goal}, Audience: ${audience}.`), LandingPageCopySchema);
  }

  async generateCampaignPlan(topic: string, durationDays: number, platforms: string[], tone: string) {
    return this.generate(buildContentPrompt(topic, tone, `Duration: ${durationDays} days. Platforms: ${platforms.join(', ')}.`), CampaignPlanSchema);
  }
}
