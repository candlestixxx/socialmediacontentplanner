import { z } from 'zod';
import { AIProvider } from '../providers/types';
import { OpenAIProvider } from '../providers/openai';

export const CommandSchema = z.object({
  topic: z.string().describe("The primary subject or topic the user wants to post about."),
  platforms: z.array(z.string()).describe("The social media platforms requested (e.g. 'Twitter', 'LinkedIn', 'Instagram'). Defaults to ['Twitter', 'LinkedIn'] if unspecified."),
  tone: z.string().describe("The requested tone of the content (e.g., 'Professional', 'Humorous', 'Educational'). Defaults to 'Professional'."),
  contentType: z.enum(['POST', 'VIDEO_SCRIPT', 'PODCAST_OUTLINE', 'LANDING_PAGE']).describe("The type of content the user is requesting to generate."),
  urgency: z.boolean().describe("Whether the user indicates this should be posted immediately vs scheduled."),
});

export type ParsedCommand = z.infer<typeof CommandSchema>;

export class ContentCommandParser {
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    this.provider = provider || new OpenAIProvider();
  }

  /**
   * Parses a raw natural language command into a structured JSON object.
   * Example: "Write a funny tweet and LinkedIn post about the new AI models launching today"
   */
  async parseCommand(rawText: string): Promise<ParsedCommand> {
    const systemPrompt = `You are the core natural language parser for ContentCommand AI.
Your job is to extract user intent from raw text and map it strictly to the provided JSON schema.
Ensure all extracted platforms are properly capitalized. Infer the 'contentType' based on context (default to 'POST').`;

    if (this.provider.generateStructuredResponse) {
      // Use the native structured generation if the provider supports it
      return this.provider.generateStructuredResponse<ParsedCommand>(rawText, CommandSchema, systemPrompt);
    }

    // Fallback if structured generation is mocked or unavailable
    const fallbackPrompt = `${systemPrompt}\n\nUser Command: "${rawText}"\n\nReturn EXACTLY a raw JSON object matching the following structure:
{
  "topic": "string",
  "platforms": ["string"],
  "tone": "string",
  "contentType": "POST" | "VIDEO_SCRIPT" | "PODCAST_OUTLINE" | "LANDING_PAGE",
  "urgency": boolean
}`;

    const rawResponse = await this.provider.generate(fallbackPrompt);

    try {
      const start = rawResponse.indexOf('{');
      const end = rawResponse.lastIndexOf('}');
      if (start === -1 || end === -1) throw new Error("No JSON object found in response");

      const parsed = JSON.parse(rawResponse.substring(start, end + 1));
      return CommandSchema.parse(parsed); // Validate against Zod
    } catch (err: any) {
      console.error("[CommandParser] Failed to parse fallback JSON:", err.message);
      throw new Error("Failed to extract structured command from AI response.");
    }
  }
}
