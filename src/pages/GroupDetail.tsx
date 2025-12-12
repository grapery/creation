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
import { mockGroups } from "../lib/mockData";
import {
  mockGroupStories,
  mockGroupActivities,
} from "../lib/mockGroupData";
import { Separator } from "../components/ui/separator";

interface GroupDetailProps {
  groupId?: string;
  onNavigate: (page: string, id?: string) => void;
}

export function GroupDetail({
  groupId,
  onNavigate,
}: GroupDetailProps) {
  const group = groupId
    ? mockGroups.find((g) => g.id === groupId)
    : mockGroups[0];

  if (!group) return null;

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
                    {group.members} members
                  </span>
                  <span className="text-muted-foreground">
                    •
                  </span>
                  <span className="text-muted-foreground">
                    {group.stories} stories
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

            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Created by</span>
              <button
                className="hover:underline text-primary"
                onClick={() =>
                  onNavigate("profile", group.creator.id)
                }
              >
                {group.creator.displayName}
              </button>
            </div>
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
              <h3>Group Stories ({mockGroupStories.length})</h3>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Button>
            </div>

            <div className="space-y-3">
              {mockGroupStories.map((story) => (
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
                      <div className="w-20 h-14 flex-shrink-0 rounded overflow-hidden">
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Story Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="line-clamp-1">
                            {story.title}
                          </h4>
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
                        </div>

                        <p className="text-muted-foreground line-clamp-1 mb-2">
                          {story.description}
                        </p>

                        <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
                          <span>
                            {story.author.displayName}
                          </span>
                          <span>•</span>
                          <span>{story.panels} panels</span>
                          <span>•</span>
                          <span>{story.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                  activities={mockGroupActivities}
                  onStoryClick={(storyId) =>
                    onNavigate("story-viewer", storyId)
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
              <h3>Members ({group.members})</h3>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Invite
              </Button>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "1",
                  name: "Alex Morgan",
                  username: "storyteller_pro",
                  avatar:
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
                  role: "Admin",
                  stories: 12,
                },
                {
                  id: "2",
                  name: "Emma Chen",
                  username: "fantasy_writer",
                  avatar:
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
                  role: "Member",
                  stories: 8,
                },
                {
                  id: "3",
                  name: "Jordan Lee",
                  username: "scifi_creator",
                  avatar:
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
                  role: "Member",
                  stories: 5,
                },
                {
                  id: "4",
                  name: "Sarah Johnson",
                  username: "dream_weaver",
                  avatar:
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
                  role: "Moderator",
                  stories: 15,
                },
                {
                  id: "5",
                  name: "Michael Chen",
                  username: "story_sage",
                  avatar:
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                  role: "Member",
                  stories: 6,
                },
                {
                  id: "6",
                  name: "Lisa Anderson",
                  username: "tale_spinner",
                  avatar:
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
                  role: "Member",
                  stories: 9,
                },
              ].map((member) => (
                <Card
                  key={member.id}
                  className="active:scale-98 transition-transform"
                  onClick={() =>
                    onNavigate("profile", member.id)
                  }
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">
                          {member.name}
                        </div>
                        <p className="text-muted-foreground truncate">
                          @{member.username}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Badge
                          variant={
                            member.role === "Admin"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {member.role}
                        </Badge>
                        <span className="text-muted-foreground">
                          {member.stories} stories
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}