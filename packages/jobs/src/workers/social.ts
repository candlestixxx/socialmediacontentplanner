import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null
});

export const socialPostingWorker = new Worker('social-posting', async (job: Job) => {
  const { postId, provider } = job.data;
  console.log(`[Worker] Processing post ${postId} for provider ${provider}`);

  // TODO: Call actual Social provider SDKs from @contentcommand/social

  return { success: true, processedAt: new Date().toISOString() };
}, { connection });

socialPostingWorker.on('completed', job => {
  console.log(`[Worker] Job ${job.id} completed successfully`);
});

socialPostingWorker.on('failed', (job, err) => {
  console.log(`[Worker] Job ${job?.id} failed with error: ${err.message}`);
});
