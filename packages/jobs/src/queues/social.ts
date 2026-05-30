import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null
});

export const socialPostingQueue = new Queue('social-posting', { connection });

export const schedulePost = async (postId: string, provider: string, delayMs: number) => {
  await socialPostingQueue.add(
    'publish',
    { postId, provider },
    { delay: delayMs, attempts: 3, backoff: { type: 'exponential', delay: 1000 } }
  );
};
