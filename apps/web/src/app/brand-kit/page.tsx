"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function BrandKitPage() {
  const [brandKits, setBrandKits] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [bannedWords, setBannedWords] = useState("");
  const [voiceRules, setVoiceRules] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBrandKits();
  }, []);

  const fetchBrandKits = async () => {
    try {
      const res = await fetch('http://localhost:3001/brand-kits?workspaceId=mock-ws');
      const data = await res.json();
      if (Array.isArray(data)) setBrandKits(data);
    } catch (e) {
      console.error('Failed to fetch brand kits', e);
    }
  };

  const createBrandKit = async () => {
    if (!name) return;
    setLoading(true);
    try {
      const payload = {
        workspaceId: 'mock-ws',
        name,
        hashtags: hashtags.split(',').map(s => s.trim()).filter(Boolean),
        bannedWords: bannedWords.split(',').map(s => s.trim()).filter(Boolean),
        voiceRules
      };
      await fetch('http://localhost:3001/brand-kits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setName("");
      setHashtags("");
      setBannedWords("");
      setVoiceRules("");
      await fetchBrandKits();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Brand Kit Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Brand Kit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Acme Corp" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Approved Hashtags (comma separated)</label>
              <Input value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="#tech, #innovation" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Banned Words (comma separated)</label>
              <Input value={bannedWords} onChange={(e) => setBannedWords(e.target.value)} placeholder="cheap, spam" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Voice & Tone Rules</label>
              <Input value={voiceRules} onChange={(e) => setVoiceRules(e.target.value)} placeholder="Professional but approachable. No jargon." />
            </div>
            <Button onClick={createBrandKit} disabled={loading || !name} className="w-full">
              {loading ? "Saving..." : "Save Brand Kit"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Brand Kits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {brandKits.length === 0 ? (
              <p className="text-sm text-gray-500">No brand kits configured yet.</p>
            ) : (
              brandKits.map((bk, i) => (
                <div key={i} className="p-4 border rounded-md bg-gray-50">
                  <h3 className="font-bold text-lg">{bk.name}</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Hashtags:</span> {bk.hashtags?.join(', ') || 'None'}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <span className="font-semibold">Banned:</span> {bk.bannedWords?.join(', ') || 'None'}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <span className="font-semibold">Voice Rules:</span> {bk.voiceRules || 'None'}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
