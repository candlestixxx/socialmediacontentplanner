"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PodcastStudioPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Educational");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState<any>(null);

  const generateOutline = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/podcasts/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: 'mock-ws', topic, tone, durationMinutes: duration })
      });
      const data = await res.json();
      setOutline(data.outline);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Podcast Studio</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Plan New Episode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Input
                placeholder="e.g., Future of Remote Work"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tone</label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option>Educational</option>
                <option>Conversational</option>
                <option>Interview</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
              />
            </div>
            <Button onClick={generateOutline} disabled={loading} className="w-full">
              {loading ? "Generating Outline..." : "Generate Outline"}
            </Button>
          </CardContent>
        </Card>

        {outline && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Outline: {outline.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-h-[600px] overflow-y-auto">
              <div>
                <h3 className="font-semibold text-sm text-gray-500">Episode Description</h3>
                <p className="mt-1 text-sm">{outline.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500">Segments</h3>
                <div className="mt-2 space-y-4">
                  {outline.segments?.map((segment: any, i: number) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-md border text-sm">
                      <div className="font-bold mb-2">{segment.title}</div>
                      <ul className="list-disc pl-4 space-y-1">
                        {segment.talkingPoints?.map((point: string, j: number) => (
                          <li key={j} className="text-gray-700">{point}</li>
                        ))}
                      </ul>
                      <Button variant="outline" size="sm" className="mt-4 w-full">Turn Segment into Social Post</Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500">Sponsor Read</h3>
                <p className="mt-1 text-sm">{outline.sponsorRead}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500">Show Notes</h3>
                <p className="mt-1 text-sm whitespace-pre-wrap">{outline.showNotes}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
