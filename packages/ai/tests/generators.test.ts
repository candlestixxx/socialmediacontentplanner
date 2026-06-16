import { ContentGenerator } from '../src/content-generators';
import { AIProvider } from '../src/providers';

class MockAIProvider implements AIProvider {
  async generateStructuredResponse<T>(prompt: string, schema: any): Promise<T> {
    // We sniff the prompt or schema to figure out what mock data to return
    const schemaDescription = schema.description || '';
    if (schema.shape.ideas) {
      return { ideas: ['Idea 1', 'Idea 2'] } as T;
    }
    if (schema.shape.content && schema.shape.hashtags) {
      return { content: 'This is a great post!', hashtags: ['#test'] } as T;
    }
    if (schema.shape.headlines) {
      return { headlines: ['Headline 1', 'Headline 2'] } as T;
    }
    if (schema.shape.hook && schema.shape.scenes) {
      return { hook: 'Watch this!', scenes: [{ description: 'Scene 1', voiceover: 'Hello', onScreenText: 'Text', bRollSuggestion: 'BRoll' }], cta: 'Subscribe!', captions: 'Captions', hashtags: ['#tag'], thumbnailIdea: 'Thumb', musicStyle: 'Pop' } as T;
    }
    if (schema.shape.segments) {
      return { title: 'Podcast Ep 1', description: 'Desc', introScript: 'Intro', segments: [{ title: 'Intro', talkingPoints: ['Welcome'] }], guestQuestions: ['Q1'], sponsorRead: 'Sponsor', socialClips: ['Clip'], youtubeDescription: 'YT', seoKeywords: ['SEO'], showNotes: 'Notes', newsletterSummary: 'News' } as T;
    }
    if (schema.shape.headline && schema.shape.subheadline) {
      return { headline: 'Buy now', subheadline: 'It is good', benefits: ['Fast'], cta: 'Click here' } as T;
    }
    if (schema.shape.posts) {
      return { posts: [{ day: 1, platform: 'Twitter', contentIdea: 'Day 1 Idea' }] } as T;
    }

    // Default fallback
    return { hashtags: ['#default'] } as T;
  }
}

describe('ContentGenerator', () => {
  let generator: ContentGenerator;

  beforeEach(() => {
    generator = new ContentGenerator(new MockAIProvider());
  });

  it('should generate post ideas', async () => {
    const result = await generator.generatePostIdeas('AI', 'Tech', 'Devs', 'Casual');
    expect(result.ideas.length).toBe(2);
    expect(result.ideas[0]).toBe('Idea 1');
  });

  it('should generate a platform post', async () => {
    const result = await generator.generatePlatformPost('AI', 'Twitter', 'Professional', 'Engagement');
    expect(result.content).toBe('This is a great post!');
    expect(result.hashtags).toContain('#test');
  });

  it('should generate headlines', async () => {
    const result = await generator.generateHeadlines('AI', 'Funny');
    expect(result.headlines).toContain('Headline 1');
  });

  it('should generate hashtags', async () => {
    const result = await generator.generateHashtags('AI', 'Instagram');
    expect(result.hashtags).toContain('#default');
  });

  it('should generate video script', async () => {
    const result = await generator.generateShortVideoScript('AI', 'Energetic', 30);
    expect(result.hook).toBe('Watch this!');
    expect(result.scenes[0].description).toBe('Scene 1');
  });

  it('should generate podcast outline', async () => {
    const result = await generator.generatePodcastOutline('AI', 'Educational', 30);
    expect(result.title).toBe('Podcast Ep 1');
    expect(result.segments[0].title).toBe('Intro');
  });

  it('should generate landing page copy', async () => {
    const result = await generator.generateLandingPageCopy('AI', 'Signups', 'Founders');
    expect(result.headline).toBe('Buy now');
  });

  it('should generate campaign plan', async () => {
    const result = await generator.generateCampaignPlan('AI', 7, ['Twitter', 'LinkedIn'], 'Professional');
    expect(result.posts[0].day).toBe(1);
    expect(result.posts[0].platform).toBe('Twitter');
  });
});
