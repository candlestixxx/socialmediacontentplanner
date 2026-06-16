'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    try {
      const data = await apiClient.get('/posts');
      setPosts(data);
    } catch (e) {
      console.error('Failed to fetch posts', e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= numDays; i++) {
    days.push(i);
  }

  const getPostsForDay = (day: number) => {
    return posts.filter(post => {
      if (!post.scheduledAt) return false;
      const d = new Date(post.scheduledAt);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-gray-500 mt-1">Plan and visualize your social media schedule.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Schedule Post</Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">{monthNames[month]} {year}</h2>
            <div className="flex border rounded-lg overflow-hidden">
              <Button variant="ghost" size="icon" className="rounded-none border-r" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="rounded-none" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="flex gap-2">
             <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Month</Badge>
             <Badge variant="ghost" className="text-gray-400">Week</Badge>
             <Badge variant="ghost" className="text-gray-400">Day</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b bg-gray-50/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="p-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-[120px]">
            {days.map((day, idx) => {
              const dayPosts = day ? getPostsForDay(day) : [];
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
              
              return (
                <div key={idx} className={`border-r border-b p-2 flex flex-col gap-1 transition-colors hover:bg-gray-50/50 ${!day ? 'bg-gray-50/20' : ''}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${isToday ? 'w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center' : 'text-gray-500'}`}>
                      {day}
                    </span>
                    {day && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 hover:opacity-100">
                        <Plus className="w-3 h-3 text-gray-400" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {dayPosts.map(post => (
                      <div key={post.id} className="text-[10px] p-1 bg-blue-50 border border-blue-100 rounded text-blue-700 font-medium truncate flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                        {new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {post.content}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex justify-between text-sm">
               <span className="text-gray-500">Scheduled this month</span>
               <span className="font-bold">{posts.filter(p => p.status === 'SCHEDULED').length}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-gray-500">Drafts pending</span>
               <span className="font-bold">{posts.filter(p => p.status === 'DRAFT').length}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-gray-500">Channels connected</span>
               <span className="font-bold text-green-600">3 Active</span>
             </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
           <CardHeader>
             <CardTitle className="text-sm">Upcoming Highlights</CardTitle>
           </CardHeader>
           <CardContent className="flex items-center justify-center py-6 text-center">
              <div className="space-y-2">
                <CalendarIcon className="w-8 h-8 text-gray-200 mx-auto" />
                <p className="text-sm text-gray-500">No major campaign events scheduled for {monthNames[month]}.</p>
                <Button variant="link" size="sm">Add Campaign Milestone</Button>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
