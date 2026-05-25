import Link from 'next/link';
import {
  Home,
  LayoutDashboard,
  FileText,
  CalendarDays,
  Sparkles,
  Palette,
  Share2,
  Video,
  Mic,
  MonitorPlay,
  BarChart3,
  DollarSign,
  FileSpreadsheet,
  Settings
} from 'lucide-react';

const routes = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Content Hub', icon: FileText, href: '/content' },
  { label: 'Campaigns', icon: Home, href: '/campaigns' },
  { label: 'Calendar', icon: CalendarDays, href: '/calendar' },
  { label: 'AI Studio', icon: Sparkles, href: '/ai-studio' },
  { label: 'Brand Kit', icon: Palette, href: '/brand-kit' },
  { label: 'Social Accounts', icon: Share2, href: '/social-accounts' },
  { label: 'Video Studio', icon: Video, href: '/video-studio' },
  { label: 'Podcast Studio', icon: Mic, href: '/podcast-studio' },
  { label: 'Landing Pages', icon: MonitorPlay, href: '/landing-pages' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Finance', icon: DollarSign, href: '/finance' },
  { label: 'Reports', icon: FileSpreadsheet, href: '/reports' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold">ContentCommand AI</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <route.icon className="h-5 w-5" />
            <span>{route.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
