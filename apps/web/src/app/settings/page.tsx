'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: 'Demo User', email: 'demo@contentcommand.com' });
  const [prefs, setPrefs] = useState({ timezone: 'UTC-5 (EST)', language: 'English' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mock: Profile details saved.');
  };

  const handlePrefsSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mock: Workspace preferences saved.');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mock: Password updated successfully.');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="mt-2 text-gray-600">Manage your profile, preferences, and security settings.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <form onSubmit={handleProfileSave}>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Full Name</label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Email Address</label>
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <form onSubmit={handlePrefsSave}>
            <CardHeader>
              <CardTitle>Workspace Preferences</CardTitle>
              <CardDescription>Set your default timezone and language for scheduling.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Timezone</label>
                <Input
                  value={prefs.timezone}
                  onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
                  placeholder="e.g. UTC, EST"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Language</label>
                <Input
                  value={prefs.language}
                  onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                  placeholder="e.g. English"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Update Preferences</Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="border-red-100">
          <form onSubmit={handlePasswordUpdate}>
            <CardHeader>
              <CardTitle className="text-red-600">Security</CardTitle>
              <CardDescription>Ensure your account remains secure by using a strong password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Current Password</label>
                <Input
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">New Password</label>
                <Input
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Confirm New Password</label>
                <Input
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  type="password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" type="submit">Update Password</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
