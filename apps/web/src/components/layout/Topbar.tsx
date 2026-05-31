'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store';

export function Topbar() {
  const { activeWorkspace, setWorkspaces } = useAppStore();

  useEffect(() => {
    // Mock fetching user's workspaces
    setWorkspaces([
      { id: 'ws_1', name: 'My Personal Brand' },
      { id: 'ws_2', name: 'Agency Client A' }
    ]);
  }, [setWorkspaces]);

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
      </div>
    </header>
  );
}
