import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center space-y-8">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900">ContentCommand AI</h1>
        <p className="text-xl text-gray-600">Create. Schedule. Publish. Track. Profit.</p>
        <p className="text-md text-gray-500 max-w-xl mx-auto">
          The ultimate all-in-one AI hub. From automated social scheduling and AI content generation
          to full landing page building, analytics, and billing management.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
        <Link href="/dashboard" className="p-4 bg-white border shadow-sm rounded-lg hover:bg-blue-50 transition block">
          <h2 className="font-bold text-lg text-blue-600">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Analytics & Overview</p>
        </Link>
        <Link href="/ai-studio" className="p-4 bg-white border shadow-sm rounded-lg hover:bg-blue-50 transition block">
          <h2 className="font-bold text-lg text-blue-600">AI Studio</h2>
          <p className="text-sm text-gray-500 mt-1">Generate Posts</p>
        </Link>
        <Link href="/campaigns" className="p-4 bg-white border shadow-sm rounded-lg hover:bg-blue-50 transition block">
          <h2 className="font-bold text-lg text-blue-600">Campaigns</h2>
          <p className="text-sm text-gray-500 mt-1">Planner & Calendar</p>
        </Link>
        <Link href="/landing-pages" className="p-4 bg-white border shadow-sm rounded-lg hover:bg-blue-50 transition block">
          <h2 className="font-bold text-lg text-blue-600">Landing Pages</h2>
          <p className="text-sm text-gray-500 mt-1">Lead Capture</p>
        </Link>
        <Link href="/video-studio" className="p-4 bg-white border shadow-sm rounded-lg hover:bg-blue-50 transition block">
          <h2 className="font-bold text-lg text-blue-600">Video Studio</h2>
          <p className="text-sm text-gray-500 mt-1">Script Generation</p>
        </Link>
        <Link href="/podcast-studio" className="p-4 bg-white border shadow-sm rounded-lg hover:bg-blue-50 transition block">
          <h2 className="font-bold text-lg text-blue-600">Podcasts</h2>
          <p className="text-sm text-gray-500 mt-1">Show Notes & Segments</p>
        </Link>
        <Link href="/notifications" className="p-4 bg-white border shadow-sm rounded-lg hover:bg-blue-50 transition block relative">
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <h2 className="font-bold text-lg text-blue-600">Alerts</h2>
          <p className="text-sm text-gray-500 mt-1">System Notifications</p>
        </Link>
        <Link href="/settings/billing" className="p-4 bg-white border shadow-sm rounded-lg hover:bg-blue-50 transition block">
          <h2 className="font-bold text-lg text-blue-600">Billing</h2>
          <p className="text-sm text-gray-500 mt-1">Payments & Plans</p>
        </Link>
      </div>
    </main>
  );
}
