import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { prisma } from '@contentcommand/database';
import { TwitterProvider, LinkedInProvider, MetaProvider, SocialProvider } from '@contentcommand/social';

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null
});

// Cache provider instances
const providers: Record<string, SocialProvider> = {
  'TWITTER': new TwitterProvider(),
  'LINKEDIN': new LinkedInProvider(),
  'META': new MetaProvider()
};

export const socialPostingWorker = new Worker('social-posting', async (job: Job) => {
  const { postId, providerName, accountId } = job.data;
  console.log(`[Worker] Processing post ${postId} for provider ${providerName}`);

  const provider = providers[providerName.toUpperCase()];
  if (!provider) {
    throw new Error(`Unsupported provider: ${providerName}`);
  }

  // Fetch the actual post content from the database
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    throw new Error(`Post ${postId} not found in database.`);
  }

  const postContent = { text: post.content };

  // Validate platform constraints before posting
  const { valid, errors } = provider.validatePost(postContent);
  if (!valid) {
    throw new Error(`Post validation failed for ${providerName}: ${errors.join(', ')}`);
  }

  // Execute the live or mock SDK publish call
  const result = await provider.publishPost(accountId, postContent);

  if (!result.success) {
    throw new Error(`Failed to publish post: ${result.error}`);
  }

  // Mark the post as published in DB
  await prisma.post.update({
    where: { id: postId },
    data: { status: 'PUBLISHED' }
  });

  return { success: true, providerPostId: result.providerPostId, processedAt: new Date().toISOString() };
}, { connection });

socialPostingWorker.on('completed', job => {
  console.log(`[Worker] Job ${job.id} completed successfully.`);
});

socialPostingWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed with error: ${err.message}`);
});
