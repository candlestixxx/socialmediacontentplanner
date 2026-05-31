'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api';

export default function VideoStudioPage() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Engaging');
  const [durationSeconds, setDurationSeconds] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedScript('');
    try {
      const result = await apiClient.post('/video-projects/generate', {
        topic,
        tone,
        durationSeconds
      });
      setGeneratedScript(result.script);
    } catch (error) {
      console.error('Failed to generate video script', error);
      setGeneratedScript('Error: Could not generate the video script.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Video Studio</h1>
        <p className="mt-2 text-gray-600">Plan and generate viral short-form video scripts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Script Generator</CardTitle>
            <CardDescription>Enter parameters to write your next TikTok/Reel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Video Topic</label>
              <Input
                placeholder="e.g. 3 Tips for beginner software engineers"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Tone</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                value={tone}
                onChange={e => setTone(e.target.value)}
              >
                <option value="Engaging">Engaging / Fast-paced</option>
                <option value="Educational">Educational / Calm</option>
                <option value="Humorous">Humorous / Satirical</option>
                <option value="Storytelling">Storytelling / Cinematic</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Duration (seconds)</label>
              <Input
                type="number"
                value={durationSeconds}
                onChange={e => setDurationSeconds(parseInt(e.target.value))}
              />
            </div>

            <Button
              className="w-full mt-4"
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
            >
              {isGenerating ? 'Generating Script...' : 'Generate Script'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Script Editor</CardTitle>
            <CardDescription>Review voiceover and B-roll directions.</CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500 animate-pulse">Writing scene directions...</p>
              </div>
            ) : (
              <Textarea
                className="h-[350px] font-mono text-sm leading-relaxed"
                value={generatedScript}
                onChange={(e) => setGeneratedScript(e.target.value)}
                placeholder="Your scene-by-scene script will appear here..."
              />
            )}

            {generatedScript && !isGenerating && (
              <div className="mt-4 flex gap-4">
                <Button variant="outline" className="w-full" onClick={() => alert('Mock: Exporting to PDF')}>
                  Export PDF
                </Button>
                <Button className="w-full" onClick={() => alert('Mock: Sending to Teleprompter app')}>
                  Send to Teleprompter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
