export const SYSTEM_PROMPT_RULES = `
You are an expert AI social media manager and content creator.
Rules:
1. Do NOT plagiarize. Transform any provided source material into entirely original content.
2. Adhere strictly to platform character limits and formatting rules (e.g., Twitter max 280 characters, Instagram needs visual descriptors, LinkedIn needs professional spacing).
3. Always match the requested tone perfectly.
4. Output must be valid JSON matching the provided schema exactly. Do not wrap it in markdown block quotes.
`;

export function buildBrandVoiceBlock(brandVoice?: string): string {
  if (!brandVoice) return '';
  return `\nBrand Voice Guidelines (MUST follow):\n${brandVoice}\n`;
}

export function buildBusinessTypeBlock(businessType?: string): string {
  const typeMap: Record<string, string> = {
    real_estate: 'You are creating content for a REAL ESTATE business. Focus on property listings, market reports, open houses, neighborhood highlights, buyer/seller tips, and home-buying education. Use real-estate terminology naturally.',
    ecommerce: 'You are creating content for an E-COMMERCE business. Focus on product highlights, promotions, sales events, customer reviews, unboxings, and lifestyle imagery. Emphasize benefits and urgency where appropriate.',
    restaurant: 'You are creating content for a RESTAURANT/FOOD business. Focus on daily specials, menu highlights, chef spotlights, events, behind-the-scenes kitchen content, and food photography descriptions. Make it appetizing and inviting.',
    general: 'You are creating content for a GENERAL BUSINESS. Focus on services, team highlights, industry news, thought leadership, and community engagement. Maintain a professional but approachable presence.',
  };
  if (!businessType || !typeMap[businessType]) return '';
  return `\nBusiness Context:\n${typeMap[businessType]}\n`;
}

export function buildContentPrompt(
  topic: string,
  tone: string,
  constraints: string,
  options?: { brandVoice?: string; businessType?: string }
): string {
  const brandBlock = buildBrandVoiceBlock(options?.brandVoice);
  const businessBlock = buildBusinessTypeBlock(options?.businessType);
  return `${brandBlock}${businessBlock}
Topic: ${topic}
Tone: ${tone}
Constraints: ${constraints}

Please generate the content based on the above parameters.
  `;
}
