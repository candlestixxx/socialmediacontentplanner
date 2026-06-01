'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { useSession, signOut } from 'next-auth/react';

export function Topbar() {
  const { data: session } = useSession();
  const { activeWorkspace, setWorkspaces } = useAppStore();

  useEffect(() => {
    // In a real app, you would fetch the user's connected workspaces here.
    if (session) {
      setWorkspaces([
        { id: 'ws_1', name: 'My Personal Brand' },
        { id: 'ws_2', name: 'Agency Client A' }
      ]);
    }
  }, [session, setWorkspaces]);

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
        {session ? (
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-gray-500 hover:text-red-500">Sign Out</button>
        ) : (
          <Link href="/login" className="text-blue-600 font-bold">Sign In</Link>
        )}
      </div>
    </header>
  );
}
