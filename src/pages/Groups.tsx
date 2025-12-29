import { useState, useEffect } from 'react';
import { Users, Plus, Search, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { MobileHeader } from '../components/MobileHeader';
import { groupApi } from '../lib/api';
import { toast } from 'sonner';

interface GroupsProps {
  onNavigate: (page: string, id?: string) => void;
}

export function Groups({ onNavigate }: GroupsProps) {
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const response = await groupApi.listGroups(1, 50);
      const groupsData = response.data.groups || response.data.data?.groups || response.data.data || [];
      setGroups(Array.isArray(groupsData) ? groupsData : []);
    } catch (error: any) {
      // If API doesn't exist yet, use empty array
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || error.message || 'Failed to load groups');
      }
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="min-h-screen">
      <MobileHeader 
        title="Groups"
        actions={
          <>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </>
        }
      />
      
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Input 
            placeholder="Search groups..." 
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={() => onNavigate('group-create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>

        <Tabs defaultValue="my-groups">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="my-groups">My Groups</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="invites">Invites</TabsTrigger>
          </TabsList>

          <TabsContent value="my-groups" className="space-y-3 mt-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading groups...</div>
            ) : filteredGroups.length > 0 ? (
              filteredGroups.map((group: any) => (
              <Card key={group.id} className="active:scale-98 transition-transform" onClick={() => onNavigate('group-detail', group.id)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 truncate">{group.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{group.memberCount || group.members || 0} members</span>
                        <span>•</span>
                        <span>{group.storyCount || group.stories || 0} stories</span>
                      </div>
                    </div>
                  </div>
                  
                  {group.description && (
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {group.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{group.isPublic ? 'Public' : 'Private'}</Badge>
                    {group.userRole && (
                      <Badge variant={group.userRole === 'admin' ? 'default' : 'outline'}>
                        {group.userRole}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No groups found' : 'No groups yet'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="discover" className="space-y-3 mt-4">
            <p className="text-muted-foreground text-center py-8">
              Discover new groups to join
            </p>
          </TabsContent>

          <TabsContent value="invites" className="space-y-3 mt-4">
            <p className="text-muted-foreground text-center py-8">
              No pending invites
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}