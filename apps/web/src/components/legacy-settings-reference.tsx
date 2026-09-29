import React from "react";
"use client";
import { useState, useEffect } from 'react';
import { Share2, Globe, Link as LinkIcon, CheckCircle2, AlertCircle, Loader2, Sparkles, Save } from 'lucide-react';
import { oauthService, type SocialPlatform, type OAuthConnectionState } from '../services/oauth';
import { api } from '../services/api';

interface SettingsProps {
  setNotification: (msg: string | null) => void;
}

export const Settings = ({ setNotification }: SettingsProps) => {
  const [connections, setConnections] = useState<OAuthConnectionState>({
    facebook: false,
    instagram: false,
    linkedin: false,
    twitter: false
  });
  const [loadingPlatform, setLoadingPlatform] = useState<SocialPlatform | null>(null);
  const [brandVoice, setBrandVoice] = useState('Professional and helpful');
  const [savingVoice, setSavingVoice] = useState(false);

  useEffect(() => {
    const fetchConnections = async () => {
      const dbConnections = await oauthService.getConnections();
      setConnections(dbConnections);
    };
    const fetchVoice = async () => {
      const voice = await api.getBrandVoice();
      setBrandVoice(voice);
    };
    fetchConnections();
    fetchVoice();
  }, []);

  const handleSaveVoice = async () => {
    setSavingVoice(true);
    const success = await api.updateBrandVoice(brandVoice);
    if (success) {
      setNotification('AI Persona updated successfully.');
    } else {
      setNotification('Failed to update AI Persona.');
    }
    setSavingVoice(false);
  };

  const toggleConnection = async (platform: SocialPlatform) => {
    setLoadingPlatform(platform);

    try {
      if (connections[platform]) {
        await oauthService.disconnectPlatform(platform);
        setConnections(prev => ({ ...prev, [platform]: false }));
        setNotification(`Disconnected from ${platform}.`);
      } else {
        await oauthService.connectPlatform(platform);
        setConnections(prev => ({ ...prev, [platform]: true }));
        setNotification(`Successfully connected to ${platform}!`);
      }
    } catch {
      setNotification(`Failed to modify connection to ${platform}.`);
    } finally {
      setLoadingPlatform(null);
    }
  };

  return (
    <div className="view-settings">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Integration Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your OAuth 2.0 social media connections for automated publishing.</p>
      </div>

      <div className="settings-grid" style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>

        {/* AI Persona Card */}
        <div className="setting-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', padding: '12px', borderRadius: '8px', color: 'var(--bg-surface)' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>AI Persona & Brand Voice</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instruct the AI on how to write content for your brand.</p>
            </div>
          </div>
          <textarea
            value={brandVoice}
            onChange={(e) => setBrandVoice(e.target.value)}
            style={{ width: '100%', minHeight: '100px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-surface-alt)', color: 'var(--text-dark)', resize: 'vertical' }}
            placeholder="E.g. Professional and helpful, using emojis sparingly."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary-gold"
              onClick={handleSaveVoice}
              disabled={savingVoice}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {savingVoice ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {savingVoice ? 'Saving...' : 'Save Persona'}
            </button>
          </div>
        </div>

        {/* Facebook */}
        <div className="setting-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#1877F2', padding: '12px', borderRadius: '8px', color: 'white' }}>
              <Globe size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>Facebook Pages</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Publish directly to your connected business pages.</p>
            </div>
          </div>
          <button
            className={`btn ${connections.facebook ? 'btn-outline' : 'btn-primary-gold'}`}
            onClick={() => toggleConnection('facebook')}
            disabled={loadingPlatform === 'facebook'}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', borderRadius: '8px', border: connections.facebook ? '1px solid var(--border)' : 'none', background: connections.facebook ? 'transparent' : 'var(--accent)', color: connections.facebook ? 'var(--text-dark)' : 'var(--primary)', cursor: loadingPlatform === 'facebook' ? 'wait' : 'pointer', fontWeight: 600, opacity: loadingPlatform === 'facebook' ? 0.7 : 1 }}
          >
            {loadingPlatform === 'facebook' ? <Loader2 size={16} className="animate-spin" /> : connections.facebook ? <><CheckCircle2 size={16} color="var(--success)" /> Connected</> : <><LinkIcon size={16} /> Connect</>}
          </button>
        </div>

        {/* Instagram */}
        <div className="setting-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', padding: '12px', borderRadius: '8px', color: 'white' }}>
              <Share2 size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>Instagram Business</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Auto-publish single images and carousels.</p>
            </div>
          </div>
          <button
            className={`btn ${connections.instagram ? 'btn-outline' : 'btn-primary-gold'}`}
            onClick={() => toggleConnection('instagram')}
            disabled={loadingPlatform === 'instagram'}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', borderRadius: '8px', border: connections.instagram ? '1px solid var(--border)' : 'none', background: connections.instagram ? 'transparent' : 'var(--accent)', color: connections.instagram ? 'var(--text-dark)' : 'var(--primary)', cursor: loadingPlatform === 'instagram' ? 'wait' : 'pointer', fontWeight: 600, opacity: loadingPlatform === 'instagram' ? 0.7 : 1 }}
          >
            {loadingPlatform === 'instagram' ? <Loader2 size={16} className="animate-spin" /> : connections.instagram ? <><CheckCircle2 size={16} color="var(--success)" /> Connected</> : <><LinkIcon size={16} /> Connect</>}
          </button>
        </div>

        {/* LinkedIn */}
        <div className="setting-card" style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#0A66C2', padding: '12px', borderRadius: '8px', color: 'white' }}>
              <Share2 size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>LinkedIn Profile</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Share professional updates to your network.</p>
            </div>
          </div>
          <button
            className={`btn ${connections.linkedin ? 'btn-outline' : 'btn-primary-gold'}`}
            onClick={() => toggleConnection('linkedin')}
            disabled={loadingPlatform === 'linkedin'}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', borderRadius: '8px', border: connections.linkedin ? '1px solid var(--border)' : 'none', background: connections.linkedin ? 'transparent' : 'var(--accent)', color: connections.linkedin ? 'var(--text-dark)' : 'var(--primary)', cursor: loadingPlatform === 'linkedin' ? 'wait' : 'pointer', fontWeight: 600, opacity: loadingPlatform === 'linkedin' ? 0.7 : 1 }}
          >
            {loadingPlatform === 'linkedin' ? <Loader2 size={16} className="animate-spin" /> : connections.linkedin ? <><CheckCircle2 size={16} color="var(--success)" /> Connected</> : <><LinkIcon size={16} /> Connect</>}
          </button>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px dashed var(--danger)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <AlertCircle size={24} color="var(--danger)" />
           <div>
             <h4 style={{ margin: 0, color: 'var(--danger)', fontSize: '0.95rem' }}>OAuth Connections are Mocked</h4>
             <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>This interface satisfies Phase 3 roadmap requirements visually. Actual token exchanges are disabled in this environment.</p>
           </div>
        </div>

      </div>
    </div>
  );
};