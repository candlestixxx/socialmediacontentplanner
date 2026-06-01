'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api';

export default function QuickCreatePage() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDraft = async () => {
    if (!content) return;
    setIsSaving(true);
    try {
      // Assuming a generic POST /posts endpoint exists per the roadmap
      await apiClient.post('/posts', { content, status: 'DRAFT' });
      alert('Draft saved successfully!');
      setContent('');
    } catch (err) {
      console.error('Failed to save draft:', err);
      alert('Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Quick Create</h1>
        <p className="mt-2 text-gray-600">Jot down an idea, save a draft, or post immediately.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What's on your mind?</CardTitle>
          <CardDescription>Draft a quick post for any connected platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            className="min-h-[200px]"
            placeholder="Start typing your post here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSaveDraft}
              disabled={isSaving || !content}
            >
              {isSaving ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!content}
              onClick={() => alert('Mock: Opening publishing modal')}
            >
              Select Platforms & Publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
