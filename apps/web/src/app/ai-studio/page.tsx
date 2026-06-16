'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api';

export default function AIStudioPage() {
  const [topic, setTopic] = useState('');
  const [researchUrl, setResearchUrl] = useState('');
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedContent('');
    try {
      const result = await apiClient.post('/ai/generate', {
        topic,
        researchUrl,
        tone,
        platforms: ['LinkedIn', 'Twitter']
      });
      setGeneratedContent(result.content);
    } catch (error) {
      console.error('Failed to generate AI content', error);
      setGeneratedContent('Error: Could not reach the AI generation service.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">AI Content Studio</h1>
        <p className="mt-2 text-gray-600">Generate high-converting posts infused with real-time web research.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Content Parameters</CardTitle>
            <CardDescription>Tell the AI what you want to write about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Core Topic</label>
              <Input
                placeholder="e.g. The impact of remote work on productivity"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">RAG Research URL (Optional)</label>
              <Input
                placeholder="https://example.com/article-to-summarize"
                value={researchUrl}
                onChange={e => setResearchUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500">Provide a link to inject factual context into the generation.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Tone</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                value={tone}
                onChange={e => setTone(e.target.value)}
              >
                <option value="Professional">Professional</option>
                <option value="Humorous">Humorous</option>
                <option value="Educational">Educational</option>
                <option value="Controversial">Controversial / Punchy</option>
              </select>
            </div>

            <Button
              className="w-full mt-4"
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
            >
              {isGenerating ? 'Generating Context...' : 'Generate Posts'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Output</CardTitle>
            <CardDescription>Review and edit your generated content.</CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500 animate-pulse">Running retrieval augmented generation...</p>
              </div>
            ) : (
              <Textarea
                className="h-[350px] font-mono text-sm leading-relaxed"
                value={generatedContent}
                readOnly
                placeholder="Generated posts will appear here..."
              />
            )}

            {generatedContent && !isGenerating && (
              <div className="mt-4 flex gap-4">
                <Button variant="outline" className="w-full" onClick={() => alert('Mock: Adding to Campaign Schedule')}>
                  Schedule to Calendar
                </Button>
                <Button className="w-full" onClick={() => alert('Mock: Publishing immediately to accounts')}>
                  Publish Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
