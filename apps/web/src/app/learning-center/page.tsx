'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Mic, 
  Video, 
  Palette, 
  Layout, 
  TrendingUp, 
  HelpCircle,
  Play,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Tutorial {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  duration: string;
  description: string;
  steps: string[];
  tips: string[];
}

const tutorials: Tutorial[] = [
  {
    id: 'ai-studio',
    title: 'Mastering AI Studio Content Generation',
    icon: Sparkles,
    duration: '4 mins read',
    description: 'Learn how to generate engaging platform-specific social media copy in seconds using our RAG context parsing engine.',
    steps: [
      'Navigate to the AI Studio from the sidebar.',
      'Enter your raw post topic or prompt (e.g. "5 benefits of remote work").',
      'Select the target platforms you want to publish to (e.g., Twitter, LinkedIn).',
      'Choose a Tone (Professional, Humorous, Educational, etc.).',
      'Optional: Paste a research URL. Our RAG scraper will extract context from the page and ground the copy in real facts.',
      'Click "Generate Content" to view your optimized post drafts.'
    ],
    tips: [
      'Include a research URL for highly detailed and factual copy.',
      'Review generated draft copy and click schedule directly from the results pane.'
    ]
  },
  {
    id: 'podcast-studio',
    title: 'Creating Show Notes & Podcast Scripts',
    icon: Mic,
    duration: '5 mins read',
    description: 'Use the AI Podcast planner to construct outline structures, host/guest intros, and segment discussions.',
    steps: [
      'Go to the Podcast Studio.',
      'Specify your episode topic, target tone, and duration.',
      'Enter Host and Guest names to auto-populate dialog templates.',
      'Click "Generate Outline" to construct the full chronological script foundation.',
      'Export the generated outlines directly to your content workspace.'
    ],
    tips: [
      'Specify a duration that matches your recording layout.',
      'Mention guest credentials in the topic field to get tailored host intro paragraphs.'
    ]
  },
  {
    id: 'video-studio',
    title: 'Retention-Optimized Video Scripting',
    icon: Video,
    duration: '3 mins read',
    description: 'Discover how to script TikToks, YouTube Shorts, and Instagram Reels with structured voiceovers and B-roll annotations.',
    steps: [
      'Navigate to the Video Studio.',
      'Define the target duration (e.g. 30 seconds or 60 seconds).',
      'Input the core video topic and style (e.g. "3 Python tricks everyone should know").',
      'Click "Generate Script" to compile Hook, Visual cues, and Call-to-action (CTA).',
      'Copy the visual cues to direct your editor or guide your filming session.'
    ],
    tips: [
      'Ensure the hook is within the first 3 seconds of voiceover.',
      'Always include the suggested call to action at the end to boost page subscriptions.'
    ]
  },
  {
    id: 'brand-kit',
    title: 'Configuring Centralized Brand Kits',
    icon: Palette,
    duration: '3 mins read',
    description: 'Ensure your AI-generated content matches your brand voice, color scheme, and guidelines.',
    steps: [
      'Open the Brand Kit settings page.',
      'Set your brand colors, typography, and logo assets.',
      'Specify Voice Rules (e.g., "Casual, friendly tone, never use emojis").',
      'List Banned Words that the generator must strictly avoid.',
      'Add target default hashtags (e.g., "#marketing", "#SaaS").'
    ],
    tips: [
      'All AI generation tools dynamically reference the active brand kit workspace rules.',
      'Update banned words immediately as your compliance guidelines shift.'
    ]
  },
  {
    id: 'landing-pages',
    title: 'Building Lead-Generating Landing Pages',
    icon: Layout,
    duration: '6 mins read',
    description: 'Generate responsive landing page copy and elements tailored for product launches and campaigns.',
    steps: [
      'Go to Landing Pages and click "Create New".',
      'Fill in the title, primary headline, and description details.',
      'Provide your offer (e.g., "Get a 14-day free trial").',
      'Specify benefits and social proof items.',
      'Click "Generate & Publish" to view the live responsive preview.'
    ],
    tips: [
      'Use active verbs in your primary Call to Action button.',
      'Ensure your meta descriptions are under 160 characters for maximum SEO compliance.'
    ]
  }
];

export default function LearningCenter() {
  const [activeTutorial, setActiveTutorial] = useState<Tutorial>(tutorials[0]);
  const [completedTours, setCompletedTours] = useState<Record<string, boolean>>({});

  const toggleCompleted = (id: string) => {
    setCompletedTours(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 text-indigo-600 font-semibold tracking-wide text-sm uppercase">
          <BookOpen className="h-5 w-5" />
          <span>Knowledge Hub</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Learning Center & Tutorials</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Welcome to the ContentCommand AI University. Learn how to connect APIs, configure brand kits, write viral scripts, and scale your social audience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 px-1">Choose a Topic</h2>
          <div className="space-y-2">
            {tutorials.map((tutorial) => {
              const Icon = tutorial.icon;
              const isActive = activeTutorial.id === tutorial.id;
              const isCompleted = completedTours[tutorial.id];
              return (
                <button
                  key={tutorial.id}
                  onClick={() => setActiveTutorial(tutorial)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center space-x-4 ${
                    isActive 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/30'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {tutorial.title}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {tutorial.duration}
                    </p>
                  </div>
                  {isCompleted && (
                    <CheckCircle className={`h-5 w-5 shrink-0 ${isActive ? 'text-green-300' : 'text-green-500'}`} />
                  )}
                  <ChevronRight className={`h-4 w-4 shrink-0 opacity-60 ${isActive ? 'text-indigo-200' : 'text-gray-400'}`} />
                </button>
              );
            })}
          </div>

          <Card className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white border-none shadow-xl mt-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
            <CardHeader className="relative">
              <CardTitle className="text-lg">Need custom help?</CardTitle>
              <CardDescription className="text-indigo-200">
                Get step-by-step assistance with our AI commands handler.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <p className="text-sm text-indigo-100">
                You can type natural language commands directly into our AI search bar at the top of the screen.
              </p>
              <Button variant="secondary" className="w-full bg-white text-indigo-900 hover:bg-indigo-50">
                <HelpCircle className="mr-2 h-4 w-4" /> Ask AI Support
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tutorial Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">{activeTutorial.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500 mt-1">
                  Tutorial Outline & Step-by-Step Instructions
                </CardDescription>
              </div>
              <Button
                variant={completedTours[activeTutorial.id] ? 'outline' : 'default'}
                className={completedTours[activeTutorial.id] ? 'border-green-500 text-green-600 hover:bg-green-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}
                onClick={() => toggleCompleted(activeTutorial.id)}
              >
                {completedTours[activeTutorial.id] ? 'Completed!' : 'Mark as Done'}
              </Button>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50">
                <h3 className="font-semibold text-indigo-900 flex items-center mb-1">
                  <Play className="h-4 w-4 mr-2 text-indigo-600 fill-indigo-600" />
                  Overview
                </h3>
                <p className="text-gray-600 text-sm">{activeTutorial.description}</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-lg">Step-by-Step Instructions</h3>
                <div className="space-y-4">
                  {activeTutorial.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-800 text-sm mb-2">Pro Tips</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  {activeTutorial.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
