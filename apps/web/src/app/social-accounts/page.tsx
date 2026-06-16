'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';

type ConnectedAccount = {
  id: string;
  platform: string;
  accountName: string;
  status: 'CONNECTED' | 'EXPIRED';
};

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await apiClient.get('/social/accounts');
      setAccounts(data);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const handleConnect = async (provider: string) => {
    try {
      const { authUrl } = await apiClient.get(`/social/auth-url?provider=${provider}`);
      window.location.href = authUrl; // Redirect to the provider's OAuth page
    } catch (error) {
      console.error(`Failed to initiate connect for ${provider}`, error);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Social Accounts</h1>
        <p className="mt-2 text-gray-600">Connect and manage your external publishing targets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Connected Profiles</CardTitle>
            <CardDescription>Your currently authorized accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <p className="text-gray-500">No accounts connected yet.</p>
            ) : (
              <ul className="space-y-4">
                {accounts.map(acc => (
                  <li key={acc.id} className="p-4 border rounded flex justify-between items-center">
                    <div>
                      <p className="font-bold">{acc.platform}</p>
                      <p className="text-sm text-gray-500">{acc.accountName}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${acc.status === 'CONNECTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {acc.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Connection</CardTitle>
            <CardDescription>Authorize ContentCommand to post on your behalf.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white" onClick={() => handleConnect('twitter')}>
              Connect Twitter / X
            </Button>
            <Button className="w-full bg-[#0077b5] hover:bg-[#005582] text-white" onClick={() => handleConnect('linkedin')}>
              Connect LinkedIn
            </Button>
            <Button className="w-full bg-[#1877F2] hover:bg-[#145dbf] text-white" onClick={() => handleConnect('meta')}>
              Connect Facebook / Instagram
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
