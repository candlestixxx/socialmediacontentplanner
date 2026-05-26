import {
  calculateEngagementRate,
  calculateCTR,
  calculateROAS,
  calculateBestPostingTimes,
  recommendPostBoost,
  recommendBudgetShift,
  detectUnderperformingCampaign,
  detectWinningPost,
} from '../src/scoring';

describe('Analytics Scoring Engine', () => {
  describe('calculateEngagementRate', () => {
    it('should calculate correct engagement rate', () => {
      expect(calculateEngagementRate(100, 1000)).toBe(10);
    });
    it('should return 0 if reach is 0', () => {
      expect(calculateEngagementRate(100, 0)).toBe(0);
    });
  });

  describe('calculateCTR', () => {
    it('should calculate correct CTR', () => {
      expect(calculateCTR(50, 1000)).toBe(5);
    });
    it('should return 0 if impressions are 0', () => {
      expect(calculateCTR(50, 0)).toBe(0);
    });
  });

  describe('calculateROAS', () => {
    it('should calculate correct ROAS', () => {
      expect(calculateROAS(500, 100)).toBe(5);
    });
    it('should return 0 if ad spend is 0', () => {
      expect(calculateROAS(500, 0)).toBe(0);
    });
  });

  describe('calculateBestPostingTimes', () => {
    it('should return top 3 posting times based on engagement rate', () => {
      const mockData = [
        { time: '10:00 AM', engagementRate: 2 },
        { time: '12:00 PM', engagementRate: 5 },
        { time: '02:00 PM', engagementRate: 1 },
        { time: '06:00 PM', engagementRate: 8 },
        { time: '08:00 PM', engagementRate: 6 },
      ];
      expect(calculateBestPostingTimes(mockData)).toEqual(['06:00 PM', '08:00 PM', '12:00 PM']);
    });
    it('should handle empty arrays', () => {
      expect(calculateBestPostingTimes([])).toEqual([]);
    });
  });

  describe('recommendations', () => {
    it('should recommend a post boost if outperforming', () => {
      expect(recommendPostBoost(10, 5)).toContain('boosting it with $25');
    });
    it('should not recommend a boost if already boosted or underperforming', () => {
      expect(recommendPostBoost(6, 5)).toBeNull();
      expect(recommendPostBoost(10, 5, 25)).toBeNull();
    });

    it('should recommend budget shift to Campaign 1', () => {
      expect(recommendBudgetShift(4.0, 2.0)).toContain('shifting 20% of Campaign 2 budget to Campaign 1');
    });

    it('should recommend budget shift to Campaign 2', () => {
      expect(recommendBudgetShift(1.0, 3.0)).toContain('shifting 20% of Campaign 1 budget to Campaign 2');
    });

    it('should detect underperforming campaign', () => {
      expect(detectUnderperformingCampaign(1.2)).toContain('underperforming with a ROAS of 1.20');
      expect(detectUnderperformingCampaign(3.0)).toBeNull();
    });

    it('should detect a winning post', () => {
      expect(detectWinningPost(3.0, 2.0, 6.0, 5.0)).toContain('winning post!');
      expect(detectWinningPost(1.0, 2.0, 6.0, 5.0)).toBeNull();
    });
  });
});
