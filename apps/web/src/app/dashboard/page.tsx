'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { apiClient } from '@/lib/api';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalShares: 0,
    platforms: [] as any[]
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await apiClient.get('/analytics');
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Workspace Dashboard</h1>
        <p className="mt-2 text-gray-600">Your high-level performance across all social accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
            <CardDescription>Across all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-blue-600">{metrics.totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Likes</CardTitle>
            <CardDescription>Engagement metric</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-green-600">{metrics.totalLikes.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Shares</CardTitle>
            <CardDescription>Viral reach metric</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-purple-600">{metrics.totalShares.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Breakdown</CardTitle>
          <CardDescription>Detailed engagement per network.</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.platforms.length === 0 ? (
            <p className="text-sm text-gray-500">No analytics data yet. Publish some posts!</p>
          ) : (
            <ul className="space-y-4">
              {metrics.platforms.map((p, i) => (
                <li key={i} className="flex justify-between items-center p-4 border rounded">
                  <span className="font-bold text-lg">{p.platform}</span>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Views: {p.views}</span>
                    <span>Likes: {p.likes}</span>
                    <span>Shares: {p.shares}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
