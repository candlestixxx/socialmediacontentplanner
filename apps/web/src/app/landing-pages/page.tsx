'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type LandingPage = {
  id?: string;
  title: string;
  headline: string;
  subheadline: string;
  benefits: string;
  cta: string;
  content: string;
};

export default function LandingPagesPage() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [formData, setFormData] = useState<LandingPage>({
    title: '',
    headline: '',
    subheadline: '',
    benefits: '',
    cta: '',
    content: ''
  });
  const [aiPrompt, setAiPrompt] = useState({ topic: '', goal: '', audience: '' });

  const fetchPages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/landing-pages`);
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching landing pages', error);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/landing-pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          benefits: formData.benefits.split(',').map(b => b.trim())
        }),
      });
      if (res.ok) {
        fetchPages();
        setFormData({ title: '', headline: '', subheadline: '', benefits: '', cta: '', content: '' });
      }
    } catch (error) {
      console.error('Error creating landing page', error);
    }
  };

  const handleGenerate = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/landing-pages/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiPrompt),
      });
      if (res.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error('Error generating landing page', error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Landing Page Builder</h1>
        <p className="mt-2 text-gray-600">Create, generate, and manage your campaign landing pages.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Manual Creation</CardTitle>
            <CardDescription>Build a landing page manually.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Page Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <Input
              placeholder="Headline"
              value={formData.headline}
              onChange={(e) => setFormData({...formData, headline: e.target.value})}
            />
            <Input
              placeholder="Subheadline"
              value={formData.subheadline}
              onChange={(e) => setFormData({...formData, subheadline: e.target.value})}
            />
            <Input
              placeholder="Benefits (comma separated)"
              value={formData.benefits}
              onChange={(e) => setFormData({...formData, benefits: e.target.value})}
            />
            <Input
              placeholder="Call to Action"
              value={formData.cta}
              onChange={(e) => setFormData({...formData, cta: e.target.value})}
            />
            <Textarea
              placeholder="Main Content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
            <Button onClick={handleCreate} className="w-full">Create Page</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Generation</CardTitle>
            <CardDescription>Let AI build your landing page copy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Topic (e.g. AI Marketing Tool)"
              value={aiPrompt.topic}
              onChange={(e) => setAiPrompt({...aiPrompt, topic: e.target.value})}
            />
            <Input
              placeholder="Goal (e.g. Email Signups)"
              value={aiPrompt.goal}
              onChange={(e) => setAiPrompt({...aiPrompt, goal: e.target.value})}
            />
            <Input
              placeholder="Audience (e.g. Small Business Owners)"
              value={aiPrompt.audience}
              onChange={(e) => setAiPrompt({...aiPrompt, audience: e.target.value})}
            />
            <Button onClick={handleGenerate} variant="secondary" className="w-full">Generate with AI</Button>

            <div className="pt-4">
              <Button onClick={fetchPages} variant="outline" className="w-full">Load All Pages</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Landing Pages</h2>
        {pages.length === 0 ? (
          <p className="text-gray-500 text-sm">No landing pages yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((p, i) => (
              <Card key={p.id || i}>
                <CardHeader>
                  <CardTitle>{p.title}</CardTitle>
                  <CardDescription>{p.headline}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-700">{p.subheadline}</p>
                  <p className="text-sm font-semibold mt-2">CTA: {p.cta}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
