'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateEngagementRate, calculateCTR, recommendPostBoost } from '@contentcommand/analytics';
import { Activity, MousePointerClick, TrendingUp, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  // Mock Data
  const metrics = {
    views: 125000,
    reach: 85000,
    engagements: 4250,
    clicks: 1200,
    impressions: 150000,
    revenue: 4500,
    adSpend: 1500,
  };

  const engagementRate = calculateEngagementRate(metrics.engagements, metrics.reach);
  const ctr = calculateCTR(metrics.clicks, metrics.impressions);
  const roas = metrics.revenue / metrics.adSpend;

  const recommendation = recommendPostBoost(engagementRate, 3.0); // Assuming 3.0 is average

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your campaign performance and review AI recommendations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.views.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Based on {metrics.reach.toLocaleString()} reach</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ctr.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Across all active campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roas.toFixed(2)}x</div>
            <p className="text-xs text-muted-foreground">${metrics.revenue.toLocaleString()} revenue generated</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-blue-800">AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-blue-900">
            <p>
              <strong>Insights:</strong> Your best-performing videos are posted between 6 PM and 9 PM on Tuesdays and Thursdays.
            </p>
            {recommendation && (
              <p>
                <strong>Action Required:</strong> {recommendation}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
