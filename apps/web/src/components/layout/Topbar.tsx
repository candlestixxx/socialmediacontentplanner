'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store';
import { useSession, signOut } from 'next-auth/react';
import { HelpCircle, X, BookOpen, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export function Topbar() {
  const { data: session } = useSession();
  const { activeWorkspace, setWorkspaces } = useAppStore();
  const pathname = usePathname() || '/';
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the user's connected workspaces here.
    if (session) {
      setWorkspaces([
        { id: 'ws_1', name: 'My Personal Brand' },
        { id: 'ws_2', name: 'Agency Client A' }
      ]);
    }
  }, [session, setWorkspaces]);

  // Page-specific quick help content
  const getHelpContent = () => {
    if (pathname.includes('/dashboard')) {
      return {
        title: 'Dashboard Overview',
        text: 'The Workspace Dashboard aggregates real-time performance metrics (views, likes, shares) across all your connected social channels (Twitter, LinkedIn, etc.) using aggregated database analytics.',
        tip: 'Connect more channels in "Social Accounts" to see wider aggregations.'
      };
    }
    if (pathname.includes('/ai-studio')) {
      return {
        title: 'AI Studio Guide',
        text: 'Input a topic, select your target channels and tone, and click "Generate Content" to draft platform-optimized posts. You can also paste a RAG Scraper URL to ground output in live data.',
        tip: 'Toggle "Urgency" if you want the system to immediately enqueue publication.'
      };
    }
    if (pathname.includes('/podcast-studio')) {
      return {
        title: 'Podcast Studio Guide',
        text: 'Generate episode titles, host/guest intros, segment breakdowns, and scripts based on your topic. Specify host/guest names and target outline durations to customize the AI parser template.',
        tip: 'Outline generation outputs a structured document that you can directly copy.'
      };
    }
    if (pathname.includes('/video-studio')) {
      return {
        title: 'Video Studio Guide',
        text: 'Draft highly viral, retention-optimized short-form script breakdowns for TikTok, YouTube Shorts, and Instagram Reels. The AI outputs hook text, scenes visual guidelines, and CTAs.',
        tip: 'Keep target durations to 30 or 60 seconds for optimal short-form flow.'
      };
    }
    if (pathname.includes('/brand-kit')) {
      return {
        title: 'Brand Kit Configuration',
        text: 'Define default tone styles, colors, fonts, hashtags, and banned words. The generation engines automatically inject these guidelines into system instructions to protect brand compliance.',
        tip: 'Update banned words to immediately filter out restricted keywords.'
      };
    }
    if (pathname.includes('/landing-pages')) {
      return {
        title: 'Landing Pages Builder',
        text: 'Compose SEO-optimized, highly converting landing pages with dynamic headlines, subheadlines, benefits, and calls to action. The builder stores page designs directly in the database.',
        tip: 'Optimize SEO Title and Meta Description tags to improve organic ranking.'
      };
    }
    return {
      title: 'Quick Start Guide',
      text: 'ContentCommand AI is a premium multi-agent workspace. Navigate the sidebar to schedule posts, generate scripts, organize brand kits, track analytics, and manage billing.',
      tip: 'Visit the Learning Center for comprehensive manuals and structured guides.'
    };
  };

  const help = getHelpContent();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-xl text-blue-600">ContentCommand</Link>
        <span className="text-gray-300">|</span>
        <div className="text-sm font-medium text-gray-700">
          Workspace: {activeWorkspace ? activeWorkspace.name : 'Loading...'}
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm font-medium">
        <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <Link href="/settings/billing" className="hover:text-blue-600">Billing</Link>
        <Link href="/learning-center" className="hover:text-blue-600 flex items-center gap-1 text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-lg">
          <BookOpen className="h-4 w-4" />
          <span>Tutorials</span>
        </Link>
        <button 
          onClick={() => setShowHelp(true)} 
          className="text-gray-500 hover:text-blue-600 flex items-center gap-1"
          aria-label="Show help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        {session ? (
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-gray-500 hover:text-red-500">Sign Out</button>
        ) : (
          <Link href="/login" className="text-blue-600 font-bold">Sign In</Link>
        )}
      </div>

      {/* Glassmorphic Help Pop-up Card */}
      {showHelp && (
        <div className="absolute top-18 right-6 w-96 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              {help.title}
            </h3>
            <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              {help.text}
            </p>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex gap-2">
              <AlertCircle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-900">
                <span className="font-bold">Pro Tip: </span>
                {help.tip}
              </div>
            </div>

            <div className="pt-2 border-t flex justify-between items-center">
              <Link 
                href="/learning-center" 
                onClick={() => setShowHelp(false)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Go to Learning Center <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
