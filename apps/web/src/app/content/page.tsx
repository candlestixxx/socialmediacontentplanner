'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { Plus, Image as ImageIcon, FileText, Send, MoreVertical, Filter, Search } from 'lucide-react';

export default function ContentHubPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

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

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    try {
      await apiClient.post('/posts', {
        content: newPostContent,
        status: 'DRAFT'
      });
      setNewPostContent('');
      setIsCreating(false);
      fetchPosts();
    } catch (e) {
      alert('Failed to create post');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || post.status?.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Content Hub</h1>
          <p className="text-gray-500 mt-1">Manage and organize all your social media content in one place.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><ImageIcon className="w-4 h-4 mr-2" /> Media Library</Button>
          <Button onClick={() => setIsCreating(!isCreating)}>
            {isCreating ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Create New Post</>}
          </Button>
        </div>
      </div>

      {isCreating && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-lg">Draft New Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea 
              className="w-full min-h-[120px] p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="What's on your mind? Draft your post here..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-gray-500"><ImageIcon className="w-4 h-4 mr-1" /> Add Media</Button>
                <Button variant="ghost" size="sm" className="text-gray-500">✨ AI Rewrite</Button>
              </div>
              <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                <Send className="w-4 h-4 mr-2" /> Save to Drafts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Find posts..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase">Channels</label>
              <div className="space-y-2">
                {['Instagram', 'Twitter', 'LinkedIn', 'YouTube'].map(platform => (
                  <div key={platform} className="flex items-center gap-2">
                    <input type="checkbox" id={platform} className="rounded border-gray-300" defaultChecked />
                    <label htmlFor={platform} className="text-sm">{platform}</label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="bg-white border w-full justify-start p-1 h-auto gap-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-gray-100">All Content</TabsTrigger>
              <TabsTrigger value="draft" className="data-[state=active]:bg-gray-100">Drafts</TabsTrigger>
              <TabsTrigger value="scheduled" className="data-[state=active]:bg-gray-100">Scheduled</TabsTrigger>
              <TabsTrigger value="published" className="data-[state=active]:bg-gray-100">Published</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredPosts.length === 0 ? (
                <Card className="border-dashed py-12">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <FileText className="w-12 h-12 text-gray-200 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No content found</h3>
                    <p className="text-gray-500 max-w-sm mt-1">
                      {searchTerm ? "We couldn't find any posts matching your search." : "You haven't created any content yet. Start by creating a new post!"}
                    </p>
                    <Button variant="outline" className="mt-6" onClick={() => setSearchTerm('')}>Clear filters</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="hover:border-blue-200 transition-colors cursor-pointer group">
                      <CardContent className="p-4 flex gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className={getStatusColor(post.status)}>
                                {post.status}
                              </Badge>
                              <span className="text-xs text-gray-400">Created {new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-gray-400 opacity-0 group-hover:opacity-100">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-gray-900 font-medium truncate">{post.content || 'Untitled Post'}</p>
                          <div className="flex items-center gap-4 mt-2">
                             <div className="flex -space-x-2">
                               {['IG', 'TW', 'LI'].map(p => (
                                 <div key={p} className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[8px] font-bold">{p}</div>
                               ))}
                             </div>
                             {post.scheduledAt && (
                               <span className="text-xs text-blue-600 font-medium">Scheduled for {new Date(post.scheduledAt).toLocaleString()}</span>
                             )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
