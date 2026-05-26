export function calculateEngagementRate(engagements: number, reach: number): number {
  if (reach === 0) return 0;
  return (engagements / reach) * 100;
}

export function calculateCTR(clicks: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
}

export function calculateROAS(revenue: number, adSpend: number): number {
  if (adSpend === 0) return 0;
  return revenue / adSpend;
}

export function calculateBestPostingTimes(
  postMetrics: { time: string; engagementRate: number }[]
): string[] {
  if (!postMetrics || postMetrics.length === 0) return [];
  const sorted = [...postMetrics].sort((a, b) => b.engagementRate - a.engagementRate);
  return sorted.slice(0, 3).map((p) => p.time);
}

export function recommendPostBoost(
  engagementRate: number,
  averageEngagementRate: number,
  currentBoost: number = 0
): string | null {
  if (engagementRate > averageEngagementRate * 1.5 && currentBoost === 0) {
    return 'This post is overperforming. We recommend boosting it with $25 to maximize reach.';
  }
  return null;
}

export function recommendBudgetShift(
  campaign1ROAS: number,
  campaign2ROAS: number,
  threshold: number = 1.5
): string | null {
  if (campaign1ROAS > campaign2ROAS * threshold) {
    return 'Campaign 1 is significantly outperforming Campaign 2. Consider shifting 20% of Campaign 2 budget to Campaign 1.';
  }
  if (campaign2ROAS > campaign1ROAS * threshold) {
    return 'Campaign 2 is significantly outperforming Campaign 1. Consider shifting 20% of Campaign 1 budget to Campaign 2.';
  }
  return null;
}

export function detectUnderperformingCampaign(
  roas: number,
  targetRoas: number = 2.0
): string | null {
  if (roas > 0 && roas < targetRoas) {
    return `Campaign is underperforming with a ROAS of ${roas.toFixed(
      2
    )}. Consider pausing or refreshing creative.`;
  }
  return null;
}

export function detectWinningPost(
  ctr: number,
  targetCtr: number = 2.0,
  engagementRate: number,
  targetEngagementRate: number = 5.0
): string | null {
  if (ctr > targetCtr && engagementRate > targetEngagementRate) {
    return 'This is a winning post! High CTR and Engagement Rate. Consider using this format more often.';
  }
  return null;
}
