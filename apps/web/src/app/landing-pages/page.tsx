'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';

export default function LandingPagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '', headline: '', subheadline: '', heroImage: '', offer: '', cta: '', socialProof: '', faq: '', utmTracking: ''
  });

  const fetchPages = async () => {
    try {
      const data = await apiClient.get('/landing-pages');
      setPages(data);
    } catch (e) {}
  };

  useEffect(() => { fetchPages(); }, []);

  const handleCreate = async () => {
    await apiClient.post('/landing-pages', formData);
    fetchPages();
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Landing Page Builder</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle>Manual Creation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Page Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <Input placeholder="Headline" value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} />
            <Input placeholder="Subheadline" value={formData.subheadline} onChange={e => setFormData({...formData, subheadline: e.target.value})} />
            <Input placeholder="Hero Image URL" value={formData.heroImage} onChange={e => setFormData({...formData, heroImage: e.target.value})} />
            <Input placeholder="Offer / Value Prop" value={formData.offer} onChange={e => setFormData({...formData, offer: e.target.value})} />
            <Input placeholder="Call to Action" value={formData.cta} onChange={e => setFormData({...formData, cta: e.target.value})} />
            <Input placeholder="Social Proof / Testimonials" value={formData.socialProof} onChange={e => setFormData({...formData, socialProof: e.target.value})} />
            <Input placeholder="UTM Tracking Code" value={formData.utmTracking} onChange={e => setFormData({...formData, utmTracking: e.target.value})} />
            <Button onClick={handleCreate} className="w-full">Create Page</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Page Preview</CardTitle></CardHeader>
          <CardContent className="border bg-gray-50 min-h-[400px] p-6 flex flex-col items-center justify-center text-center">
             {formData.heroImage && <img src={formData.heroImage} className="w-full h-32 object-cover mb-4 rounded" />}
             <h1 className="text-2xl font-black">{formData.headline || 'Headline'}</h1>
             <p className="text-gray-600 mt-2">{formData.subheadline || 'Subheadline'}</p>
             <p className="mt-4 font-bold text-green-700">{formData.offer}</p>
             <p className="mt-2 text-sm italic">{formData.socialProof}</p>
             <Button className="mt-6 w-full max-w-xs">{formData.cta || 'Call to Action'}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
