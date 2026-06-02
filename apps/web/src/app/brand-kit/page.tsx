'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api';

type BrandKit = {
  id: string;
  name: string;
  voiceRules?: string;
  hashtags?: string[];
  bannedWords?: string[];
};

export default function BrandKitPage() {
  const [kits, setKits] = useState<BrandKit[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    voiceRules: '',
    hashtags: '',
    bannedWords: ''
  });

  const fetchKits = async () => {
    try {
      const data = await apiClient.get('/brand-kits');
      setKits(data);
    } catch (e) {
      console.error('Failed to fetch brand kits:', e);
    }
  };

  useEffect(() => {
    fetchKits();
  }, []);

  const handleCreate = async () => {
    try {
      await apiClient.post('/brand-kits', {
        name: formData.name,
        voiceRules: formData.voiceRules,
        hashtags: formData.hashtags.split(',').map(h => h.trim()).filter(Boolean),
        bannedWords: formData.bannedWords.split(',').map(w => w.trim()).filter(Boolean),
      });
      setFormData({ name: '', voiceRules: '', hashtags: '', bannedWords: '' });
      fetchKits();
    } catch (error) {
      console.error('Failed to create brand kit:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/brand-kits/${id}`);
      fetchKits();
    } catch (error) {
      console.error('Failed to delete brand kit:', error);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Brand Kits</h1>
        <p className="mt-2 text-gray-600">Configure global tone rules, banned words, and default tags for AI generation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Brand Kit</CardTitle>
            <CardDescription>Setup rules that the AI will automatically follow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Name</label>
              <Input placeholder="e.g. Acme Corp Master Rules" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">AI Voice & Tone Rules</label>
              <Textarea
                placeholder="e.g. Always sound professional but approachable. Use emoji sparingly."
                value={formData.voiceRules}
                onChange={e => setFormData({...formData, voiceRules: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Default Hashtags (comma separated)</label>
              <Input placeholder="#saas, #tech, #growth" value={formData.hashtags} onChange={e => setFormData({...formData, hashtags: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Banned Words (comma separated)</label>
              <Input placeholder="cheap, free, worst" value={formData.bannedWords} onChange={e => setFormData({...formData, bannedWords: e.target.value})} />
            </div>

            <Button className="w-full mt-2" onClick={handleCreate} disabled={!formData.name}>Save Brand Kit</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Active Brand Kits</h2>
          {kits.length === 0 ? (
            <p className="text-gray-500 text-sm p-4 border border-dashed rounded-lg text-center">No brand kits configured.</p>
          ) : (
            <div className="space-y-4">
              {kits.map((kit) => (
                <Card key={kit.id} className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
                  <CardContent className="p-6 ml-2 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{kit.name}</h3>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(kit.id)}>Delete</Button>
                    </div>
                    {kit.voiceRules && <p className="text-sm text-gray-600 italic">"{kit.voiceRules}"</p>}

                    <div className="flex flex-wrap gap-2 pt-2">
                      {kit.hashtags?.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{tag}</span>
                      ))}
                    </div>

                    {kit.bannedWords && kit.bannedWords.length > 0 && (
                      <p className="text-xs text-red-500 font-medium mt-2">Banned: {kit.bannedWords.join(', ')}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
