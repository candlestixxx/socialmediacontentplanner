'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api';

export default function PodcastStudioPage() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Conversational');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [hostName, setHostName] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedOutline('');
    try {
      const result = await apiClient.post('/podcasts/generate', {
        topic,
        tone,
        durationMinutes,
        hostName,
        guestName
      });
      setGeneratedOutline(result.outline);
    } catch (error) {
      console.error('Failed to generate podcast outline', error);
      setGeneratedOutline('Error: Could not generate the podcast outline.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Podcast Studio</h1>
        <p className="mt-2 text-gray-600">Plan full episodes, write intros, and generate interview questions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Episode Planner</CardTitle>
            <CardDescription>Enter parameters to outline your next show.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Episode Topic</label>
              <Input
                placeholder="e.g. The evolution of large language models"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Host Name</label>
                <Input
                  placeholder="e.g. Jules"
                  value={hostName}
                  onChange={e => setHostName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Guest Name (Optional)</label>
                <Input
                  placeholder="e.g. Sam Altman"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Show Tone</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                value={tone}
                onChange={e => setTone(e.target.value)}
              >
                <option value="Conversational">Conversational / Casual</option>
                <option value="Journalistic">Journalistic / Hard News</option>
                <option value="Educational">Educational / Deep Dive</option>
                <option value="Humorous">Humorous / Satirical</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Duration (minutes)</label>
              <Input
                type="number"
                value={durationMinutes}
                onChange={e => setDurationMinutes(parseInt(e.target.value))}
              />
            </div>

            <Button
              className="w-full mt-4"
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
            >
              {isGenerating ? 'Drafting Show Notes...' : 'Generate Episode Outline'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Show Outline</CardTitle>
            <CardDescription>Review segments, questions, and descriptions.</CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500 animate-pulse">Structuring segments...</p>
              </div>
            ) : (
              <Textarea
                className="h-[450px] font-mono text-sm leading-relaxed"
                value={generatedOutline}
                onChange={(e) => setGeneratedOutline(e.target.value)}
                placeholder="Your episode outline, intro scripts, and questions will appear here..."
              />
            )}

            {generatedOutline && !isGenerating && (
              <div className="mt-4 flex gap-4">
                <Button variant="outline" className="w-full" onClick={() => alert('Mock: Downloading text file')}>
                  Download .txt
                </Button>
                <Button className="w-full" onClick={() => alert('Mock: Extracting social clips to Calendar')}>
                  Extract Social Clips
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
