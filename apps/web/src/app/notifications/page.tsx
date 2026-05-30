'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:3001/notifications');
      if (res.ok) {
        setNotifications(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/notifications/${id}/read`, { method: 'PATCH' });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`http://localhost:3001/notifications/read-all`, { method: 'PATCH' });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all read', error);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-2 text-gray-600">Stay updated on your campaigns, posts, and budget.</p>
        </div>
        <Button variant="outline" onClick={markAllAsRead}>Mark all as read</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>System generated alerts and notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No new notifications.</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notif) => (
                <li key={notif.id} className={`p-4 border rounded flex items-center justify-between ${notif.read ? 'bg-gray-50 text-gray-600' : 'bg-white font-medium border-l-4 border-l-blue-500'}`}>
                  <div>
                    <p>{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                  </div>
                  {!notif.read && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)}>Mark Read</Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
