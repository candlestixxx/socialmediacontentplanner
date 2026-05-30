'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([
    { id: 'c1', name: 'Summer Product Launch', status: 'ACTIVE', startDate: '2026-06-01', endDate: '2026-08-31' },
    { id: 'c2', name: 'Q4 Holiday Push', status: 'DRAFT', startDate: '2026-11-01', endDate: '2026-12-31' },
  ]);

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campaigns & Calendar</h1>
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
              <ul className="space-y-4">
                {campaigns.map(c => (
                  <li key={c.id} className="p-4 border rounded hover:bg-gray-50 flex justify-between items-center cursor-pointer">
                    <div>
                      <h3 className="font-bold text-lg">{c.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {c.status}
                    </span>
                  </li>
                ))}
              </ul>
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
              <div className="p-3 border-l-4 border-l-gray-300 bg-gray-50 rounded">
                <p className="text-sm font-bold">Friday, 4:30 PM</p>
                <p className="text-sm">TikTok Video (Behind the scenes)</p>
              </div>
              <Button variant="outline" className="w-full">View Full Calendar</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
