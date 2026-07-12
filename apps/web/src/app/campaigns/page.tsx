
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';

type Campaign = {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [liveJobs, setLiveJobs] = useState(0);

  useEffect(() => {
    fetchCampaigns();

    // Setup WebSocket connection to API server
    const wsUrl = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace(/^http/, 'ws')
      : 'ws://localhost:3031';

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log('[WebSocket] Connected for live updates');

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'publishing_status') {
          setLiveJobs(payload.data.activeJobs);
        }
      } catch (e) {
        console.error('Failed to parse WS message', e);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await apiClient.get('/campaigns');
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to fetch campaigns', error);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Campaigns & Calendar</h1>
            {liveJobs > 0 && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full animate-pulse border border-green-200">
                Live Sync: {liveJobs} jobs processing
              </span>
            )}
          </div>
          <p className="mt-2 text-gray-600">Plan and schedule your content drops.</p>
        </div>
        <Button onClick={() => alert('Mock: Opening New Campaign Modal')}>+ New Campaign</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>Currently running or planned campaigns.</CardDescription>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <p className="text-gray-500">No campaigns found. Create one!</p>
              ) : (
                <ul className="space-y-4">
                  {campaigns.map(c => (
                    <li key={c.id} className="p-4 border rounded hover:bg-gray-50 flex justify-between items-center cursor-pointer">
                      <div>
                        <h3 className="font-bold text-lg">{c.name}</h3>
                        <p className="text-sm text-gray-500">
                          {c.startDate ? new Date(c.startDate).toLocaleDateString() : 'TBD'} - {c.endDate ? new Date(c.endDate).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {c.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar Snapshot</CardTitle>
              <CardDescription>Upcoming scheduled posts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border-l-4 border-l-blue-500 bg-gray-50 rounded">
                <p className="text-sm font-bold">Today, 2:00 PM</p>
                <p className="text-sm">Instagram Reel (Summer Launch)</p>
              </div>
              <div className="p-3 border-l-4 border-l-gray-300 bg-gray-50 rounded">
                <p className="text-sm font-bold">Tomorrow, 9:00 AM</p>
                <p className="text-sm">LinkedIn Post (Company Update)</p>
              </div>
              <Button variant="outline" className="w-full">View Full Calendar</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
