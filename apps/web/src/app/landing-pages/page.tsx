'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';

export default function LandingPagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '', headline: '', subheadline: '', heroImage: '', heroVideo: '', offer: '', cta: '', socialProof: '', faq: '', utmTracking: ''
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
    alert('Landing page saved successfully!');
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const topic = formData.title || 'Product Launch';
      const data = await apiClient.post('/landing-pages/generate', {
        topic,
        goal: 'Conversions',
        audience: 'Target Customers'
      });
      setFormData({
        ...formData,
        headline: data.headline,
        subheadline: data.subheadline,
        offer: data.offer,
        cta: data.cta
      });
    } catch (e) {
      alert('AI Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const mockUpload = (type: 'image' | 'video') => {
    const mockUrl = type === 'image' 
      ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
      : 'https://www.w3schools.com/html/mov_bbb.mp4';
    
    setFormData({
      ...formData,
      [type === 'image' ? 'heroImage' : 'heroVideo']: mockUrl
    });
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded (mocked)!`);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Landing Page Builder</h1>
          <p className="text-gray-500 mt-1">Design high-converting pages with AI assistance.</p>
        </div>
        <Button variant="outline" onClick={handleAiGenerate} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : '✨ Auto-Generate with AI'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Page Configuration</CardTitle>
            <CardDescription>Fill in the details for your landing page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Title / Topic</label>
              <Input placeholder="e.g. Summer Sale 2026" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Headline</label>
                <Input placeholder="Main headline" value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subheadline</label>
                <Input placeholder="Supporting text" value={formData.subheadline} onChange={e => setFormData({...formData, subheadline: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Media</label>
              <div className="flex gap-2">
                <Input placeholder="Image URL" className="flex-1" value={formData.heroImage} onChange={e => setFormData({...formData, heroImage: e.target.value})} />
                <Button variant="secondary" onClick={() => mockUpload('image')}>Upload Image</Button>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Video URL" className="flex-1" value={formData.heroVideo} onChange={e => setFormData({...formData, heroVideo: e.target.value})} />
                <Button variant="secondary" onClick={() => mockUpload('video')}>Upload Video</Button>
              </div>
              <p className="text-xs text-gray-400">Add a hero image or video (or both). Video takes precedence in preview.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Offer / Value Prop</label>
              <Input placeholder="What are you offering?" value={formData.offer} onChange={e => setFormData({...formData, offer: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Call to Action (CTA)</label>
              <Input placeholder="Button text" value={formData.cta} onChange={e => setFormData({...formData, cta: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Social Proof</label>
              <Input placeholder="Testimonials or stats" value={formData.socialProof} onChange={e => setFormData({...formData, socialProof: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tracking (UTM)</label>
              <Input placeholder="?utm_source=facebook&..." value={formData.utmTracking} onChange={e => setFormData({...formData, utmTracking: e.target.value})} />
            </div>

            <Button onClick={handleCreate} className="w-full h-12 text-lg">Save Landing Page</Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm overflow-hidden border-2 border-dashed border-gray-200">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-gray-400">Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-white min-h-[600px] flex flex-col">
              {/* Mock Browser Header */}
              <div className="h-8 bg-gray-100 flex items-center px-4 gap-2 border-b">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <div className="ml-4 bg-white h-5 flex-1 rounded text-[10px] flex items-center px-2 text-gray-400 truncate">
                  https://yourbrand.com/{formData.title.toLowerCase().replace(/\s+/g, '-')}
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                 {formData.heroVideo ? (
                   <video key={formData.heroVideo} controls className="w-full aspect-video rounded-lg shadow-xl mb-4" src={formData.heroVideo} />
                 ) : formData.heroImage ? (
                   <img src={formData.heroImage} className="w-full aspect-video object-cover rounded-lg shadow-xl mb-4" />
                 ) : (
                   <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 border-2 border-dashed">
                     No Hero Media Selected
                   </div>
                 )}

                 <div className="max-w-md space-y-4">
                   <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                     {formData.headline || 'Your Big Headline Here'}
                   </h1>
                   <p className="text-xl text-gray-500">
                     {formData.subheadline || 'A compelling subheadline that explains the value further.'}
                   </p>
                   
                   {formData.offer && (
                     <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                       {formData.offer}
                     </div>
                   )}

                   <div className="pt-4">
                     <Button className="h-14 px-8 text-lg font-bold shadow-lg shadow-blue-200">
                       {formData.cta || 'Get Started Now'}
                     </Button>
                   </div>

                   {formData.socialProof && (
                     <p className="text-sm text-gray-400 italic pt-8 border-t">
                       "{formData.socialProof}"
                     </p>
                   )}
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
