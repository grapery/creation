import { useState, useEffect } from "react";
import {
  Users,
  Settings,
  Share2,
  Bell,
  Plus,
  MoreVertical,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ActivityHeatmap } from "../components/ActivityHeatmap";
import { ActivityFeed } from "../components/ActivityFeed";
import { MobileHeader } from "../components/MobileHeader";
import { Separator } from "../components/ui/separator";
import { groupApi } from "../lib/api";
import { useStoryStore } from "../stores";
import { toast } from "sonner";

interface GroupDetailProps {
  groupId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function GroupDetail({
  groupId,
  onNavigate,
}: GroupDetailProps) {
  const [group, setGroup] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const { fetchStories } = useStoryStore();

  useEffect(() => {
    if (groupId) {
      loadGroupData();
    }
  }, [groupId]);

  const loadGroupData = async () => {
    setIsLoading(true);
    try {
      const groupResponse = await groupApi.getGroup(groupId!);
      const groupData = groupResponse.data.group || groupResponse.data.data || groupResponse.data;
      setGroup(groupData);

      // Load group stories
      try {
        const storiesResponse = await fetchStories(1, 50);
        const groupStories = storiesResponse.filter((s: any) => s.groupId === groupId);
        setStories(groupStories);
      } catch (error) {
        console.error('Failed to load group stories:', error);
      }

      // Load group activities
      try {
        const activitiesResponse = await groupApi.getGroupActivities(groupId!);
        const activitiesData = activitiesResponse.data.activities || activitiesResponse.data.data || [];
        setActivities(activitiesData);
      } catch (error) {
        console.error('Failed to load group activities:', error);
      }

      // Load group members
      loadMembers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to load group');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMembers = async () => {
    if (!groupId) return;
    
    setIsLoadingMembers(true);
    try {
      const response = await groupApi.getGroupMembers(groupId);
      const membersData = response.data.members || response.data.data?.members || response.data.data || [];
      setMembers(Array.isArray(membersData) ? membersData : []);
    } catch (error: any) {
      console.error('Failed to load members:', error);
      setMembers([]);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-muted-foreground">Loading group...</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Group not found</p>
          <Button onClick={() => onNavigate('groups')}>Back to Groups</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MobileHeader
        title={group.name}
        showBack
        onBack={() => onNavigate("groups")}
        actions={
          <>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </>
        }
      />

      <div className="p-4 space-y-4">
        {/* Group Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-muted-foreground">
                    {group.memberCount || group.members || 0} members
                  </span>
                  <span className="text-muted-foreground">
                    •
                  </span>
                  <span className="text-muted-foreground">
                    {stories.length} stories
                  </span>
                </div>
                <Badge variant="secondary">
                  {group.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
            </div>

            <p className="text-muted-foreground mb-3">
              {group.description}
            </p>

            {group.creator && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>Created by</span>
                <button
                  className="hover:underline text-primary"
                  onClick={() =>
                    onNavigate("profile", group.creator.id)
                  }
                >
                  {group.creator.displayName || group.creator.username || 'Unknown'}
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="stories">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          {/* Stories Tab */}
          <TabsContent
            value="stories"
            className="space-y-3 mt-4"
          >
            <div className="flex items-center justify-between">
              <h3>Group Stories ({stories.length})</h3>
              <Button size="sm" onClick={() => onNavigate('story-editor')}>
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Button>
            </div>

            {stories.length > 0 ? (
              <div className="space-y-3">
                {stories.map((story: any) => (
                <Card
                  key={story.id}
                  className="active:scale-98 transition-transform cursor-pointer"
                  onClick={() =>
                    onNavigate("story-detail", story.id)
                  }
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      {/* Story Cover */}
                      <div className="w-20 h-14 flex-shrink-0 rounded overflow-hidden bg-muted">
                        {story.cover ? (
                          <img
                            src={story.cover}
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No cover
                          </div>
                        )}
                      </div>

                      {/* Story Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="line-clamp-1">
                            {story.title}
                          </h4>
                          {story.status && (
                            <Badge
                              variant={
                                story.status === "published"
                                  ? "default"
                                  : "secondary"
                              }
                              className="flex-shrink-0"
                            >
                              {story.status}
                            </Badge>
                          )}
                        </div>

                        {story.description && (
                          <p className="text-muted-foreground line-clamp-1 mb-2">
                            {story.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-muted-foreground flex-wrap text-sm">
                          {story.author && (
                            <>
                              <span>
                                {story.author.displayName || story.author.username}
                              </span>
                              <span>•</span>
                            </>
                          )}
                          <span>{story.scenes?.length || 0} scenes</span>
                          <span>•</span>
                          <span>{story.likes || 0} likes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No stories yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent
            value="activity"
            className="space-y-4 mt-4"
          >
            {/* Activity Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityHeatmap />
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ActivityFeed
                  activities={activities}
                  onStoryClick={(storyId) =>
                    onNavigate("story-detail", storyId)
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent
            value="members"
            className="space-y-3 mt-4"
          >
            <div className="flex items-center justify-between">
              <h3>Members ({group.memberCount || group.members || 0})</h3>
              <Button size="sm" variant="outline" onClick={() => toast.info('Invite feature coming soon')}>
                <Plus className="mr-2 h-4 w-4" />
                Invite
              </Button>
            </div>

            {isLoadingMembers ? (
              <div className="text-center py-8 text-muted-foreground">Loading members...</div>
            ) : members.length > 0 ? (
              <div className="space-y-3">
                {members.map((member: any) => (
                  <Card
                    key={member.id || member.userId}
                    className="active:scale-98 transition-transform cursor-pointer"
                    onClick={() =>
                      onNavigate("profile", member.id || member.userId)
                    }
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{(member.displayName || member.username || 'U')[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="truncate">
                            {member.displayName || member.username || 'Unknown'}
                          </div>
                          {member.username && (
                            <p className="text-muted-foreground truncate">
                              @{member.username}
                            </p>
                          )}
                        </div>

                        {member.role && (
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <Badge
                              variant={
                                member.role === "admin" || member.role === "Admin"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {member.role}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No members yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}