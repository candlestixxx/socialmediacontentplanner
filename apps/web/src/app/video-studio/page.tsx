"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function VideoStudioPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Energetic");
  const [platform, setPlatform] = useState("TikTok");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<any>(null);

  const generateScript = async () => {
    if (!topic) return;
    setLoading(true);

    // Simulate API Call for now until full integration
    try {
      const res = await fetch('http://localhost:4000/video-projects/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: 'mock-ws', topic, tone, durationSeconds: duration })
      });
      const data = await res.json();
      setScript(data.script);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Video Studio</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Short Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Input
                placeholder="e.g., Top 5 AI tools"
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
                <option>Energetic</option>
                <option>Professional</option>
                <option>Humorous</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <select className="w-full border rounded-md p-2 text-sm" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option>TikTok</option>
                <option>Instagram Reels</option>
                <option>YouTube Shorts</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (seconds)</label>
              <Input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 30)} />
            </div>
            <Button onClick={generateScript} disabled={loading} className="w-full">
              {loading ? "Generating Script..." : "Generate Script"}
            </Button>
          </CardContent>
        </Card>

        {script && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Script</CardTitle>
              <Button variant="outline" size="sm" onClick={() => { const link = document.createElement("a"); link.href = "data:text/csv;charset=utf-8,Hook,Scenes,CTA\n" + script.hook + ",1," + script.cta; link.download = "export.csv"; link.click(); }}>Export CSV</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-500">Hook</h3>
                <p className="mt-1">{script.hook}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-500">Scenes</h3>
                <div className="mt-2 space-y-2">
                  {script.scenes.map((scene: any, i: number) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-md border text-sm">
                      <span className="font-medium">Scene {i+1}:</span> {scene.description}
                      <div className="text-gray-500 text-xs mt-1">Audio: {scene.audio}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-500">Call to Action</h3>
                <p className="mt-1">{script.cta}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
