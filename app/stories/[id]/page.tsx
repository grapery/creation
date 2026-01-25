"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { stories } from "@/lib/api/stories";
import { storyboards } from "@/lib/api/storyboards";
import { Story, Storyboard, Character, StoryScene, Contributor } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryDetailHeader } from "@/components/story/story-detail-header";
import { StoryTabs } from "@/components/story/story-tabs";
import { StoryBranchesSection } from "@/components/story/story-branches-section";
import { StoryCastSection } from "@/components/story/story-cast-section";
import { StoryScenesSection } from "@/components/story/story-scenes-section";
import { StoryTeamSection, ContentCreator } from "@/components/story/story-team-section";
import { CreatorRole } from "@/components/story/story-team-section";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "@/providers/language-provider";

export default function StoryPage() {
    const { id } = useParams();
    const { t } = useTranslation();
    const router = useRouter();
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("story");

    // Story tab data
    const [storyboardsList, setStoryboardsList] = useState<Storyboard[]>([]);
    const [loadingStoryboards, setLoadingStoryboards] = useState(true);

    // Characters tab data
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loadingCharacters, setLoadingCharacters] = useState(true);

    // Scenes tab data
    const [scenes, setScenes] = useState<StoryScene[]>([]);
    const [loadingScenes, setLoadingScenes] = useState(true);

    // Team tab data
    const [creators, setCreators] = useState<ContentCreator[]>([]);
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loadingTeam, setLoadingTeam] = useState(true);

    useEffect(() => {
        if (!id) return;
        async function load() {
            try {
                const data = await stories.get(id as string);
                setStory(data);
                // Load all story data
                await Promise.all([
                    loadStoryboards(id as string),
                    loadCharacters(id as string),
                    loadScenes(id as string),
                    loadTeam(id as string)
                ]);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const loadStoryboards = async (storyId: string) => {
        setLoadingStoryboards(true);
        try {
            // Load all storyboards for this story (pass null to get all storyboards regardless of parent)
            const response = await storyboards.getByStoryId(storyId, null);
            setStoryboardsList(response.storyboards);
            // Reload team data since it depends on storyboards
            if (story) {
                await loadTeam(storyId);
            }
        } catch (e) {
            console.error(e);
            setStoryboardsList([]);
        } finally {
            setLoadingStoryboards(false);
        }
    };

    const loadCharacters = async (storyId: string) => {
        setLoadingCharacters(true);
        try {
            // Characters are part of the story object
            if (story && story.characters) {
                setCharacters(story.characters);
            } else {
                setCharacters([]);
            }
        } catch (e) {
            console.error(e);
            setCharacters([]);
        } finally {
            setLoadingCharacters(false);
        }
    };

    const loadScenes = async (storyId: string) => {
        setLoadingScenes(true);
        try {
            // Scenes are part of the story object
            if (story && story.scenes) {
                setScenes(story.scenes);
            } else {
                setScenes([]);
            }
        } catch (e) {
            console.error(e);
            setScenes([]);
        } finally {
            setLoadingScenes(false);
        }
    };

    const loadTeam = async (storyId: string) => {
        setLoadingTeam(true);
        try {
            if (!story) return;

            const creators: ContentCreator[] = [];
            const seenUserIds = new Set<string>();
            const storyboardCountByUser: Record<string, number> = {};
            const characterCountByUser: Record<string, number> = {};

            // Add story author as primary creator
            if (story.author) {
                creators.push({
                    id: `author-${story.author.id}`,
                    userId: story.author.id,
                    name: story.author.displayName || story.author.username,
                    avatar: story.author.avatar,
                    role: CreatorRole.StoryAuthor,
                    contributionCount: 1
                });
                seenUserIds.add(story.author.id);
            }

            // Count storyboard contributions by creator
            storyboardsList.forEach((storyboard) => {
                if (storyboard.creatorId) {
                    storyboardCountByUser[storyboard.creatorId] = (storyboardCountByUser[storyboard.creatorId] || 0) + 1;
                }
            });

            // Add storyboard creators
            storyboardsList.forEach((storyboard) => {
                if (
                    storyboard.creatorId &&
                    !seenUserIds.has(storyboard.creatorId) &&
                    storyboard.creatorName
                ) {
                    creators.push({
                        id: `storyboard-creator-${storyboard.creatorId}`,
                        userId: storyboard.creatorId,
                        name: storyboard.creatorName,
                        avatar: storyboard.creatorAvatar,
                        role: CreatorRole.StoryboardCreator,
                        contributionCount: storyboardCountByUser[storyboard.creatorId] || 1
                    });
                    seenUserIds.add(storyboard.creatorId);
                }
            });

            // Count character contributions by author
            if (story.characters) {
                story.characters.forEach((character: Character) => {
                    if (character.creatorId) {
                        characterCountByUser[character.creatorId] = (characterCountByUser[character.creatorId] || 0) + 1;
                    }
                });

                // Add character creators
                story.characters.forEach((character: Character) => {
                    if (character.creatorId && !seenUserIds.has(character.creatorId)) {
                        const authorName = character.author?.displayName || character.author?.username || "Unknown Creator";
                        const authorAvatar = character.author?.avatar;

                        creators.push({
                            id: `character-creator-${character.creatorId}`,
                            userId: character.creatorId,
                            name: authorName,
                            avatar: authorAvatar,
                            role: CreatorRole.CharacterCreator,
                            contributionCount: characterCountByUser[character.creatorId] || 1
                        });
                        seenUserIds.add(character.creatorId);
                    }
                });
            }

            setCreators(creators);
            setContributors(story.contributors || []);
        } catch (e) {
            console.error(e);
            setCreators([]);
            setContributors([]);
        } finally {
            setLoadingTeam(false);
        }
    };

    const handleLike = async () => {
        if (!story) return;
        try {
            if (story.isLiked) {
                await stories.unlike(story.id);
            } else {
                await stories.like(story.id);
            }
            // Reload story data
            const data = await stories.get(story.id);
            setStory(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleStoryboardTap = (storyboard: Storyboard) => {
        router.push(`/storyboards/${storyboard.id}`);
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );

    if (!story) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">{t("story_detail.story_not_found", "Story Not Found")}</h1>
                <p className="text-muted-foreground mb-4">{t("story_detail.story_not_found_message", "The story you're looking for doesn't exist.")}</p>
                <Button onClick={() => router.push("/")}>{t("story_detail.go_home", "Go Home")}</Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Immersive Header */}
                <StoryDetailHeader story={story} />

                {/* Tab Navigation */}
                <div className="border-b border-border/50 bg-background sticky top-14 z-20">
                    <div className="container max-w-6xl px-4 md:px-6 mx-auto py-3">
                        <StoryTabs onTabChange={setActiveTab} />
                    </div>
                </div>

                {/* Tab Content */}
                <div className="container max-w-6xl px-4 py-6 md:px-6 mx-auto">
                    {activeTab === "story" && (
                        <StoryBranchesSection
                            storyId={story.id}
                            storyTitle={story.title}
                            storyboards={storyboardsList}
                            isLoading={loadingStoryboards}
                            onStoryboardTap={handleStoryboardTap}
                        />
                    )}

                    {activeTab === "characters" && (
                        <StoryCastSection
                            title={t("story_detail.header.characters", "Characters")}
                            characters={characters}
                            onAddCharacter={() => {
                                // TODO: Navigate to create character
                                console.log("Add character clicked");
                            }}
                        />
                    )}

                    {activeTab === "scenes" && (
                        <StoryScenesSection
                            title={t("story_detail.tabs.scenes", "Scenes")}
                            scenes={scenes}
                            storyId={story.id}
                            isLoading={loadingScenes}
                            onAddScene={() => {
                                // TODO: Navigate to create scene
                                console.log("Add scene clicked");
                            }}
                        />
                    )}

                    {activeTab === "team" && (
                        <StoryTeamSection
                            title={t("story_detail.contributors", "Contributors")}
                            creators={creators}
                            contributors={contributors}
                            isLoading={loadingTeam}
                            onInvite={() => {
                                // TODO: Show invite modal
                                console.log("Invite clicked");
                            }}
                            onOpenWritersRoom={() => {
                                // TODO: Navigate to writers room
                                console.log("Open writers room clicked");
                            }}
                        />
                    )}
                </div>

                {/* Action Bar */}
                <div className="border-t border-border/50 py-4 bg-background">
                    <div className="container max-w-6xl px-4 md:px-6 mx-auto">
                        <Button
                            className="w-full md:w-auto"
                            onClick={() => {
                                if (storyboardsList.length === 0) {
                                    // Navigate to create first storyboard
                                    router.push(`/create/wizard?storyId=${story.id}`);
                                } else {
                                    // Start reading first storyboard
                                    handleStoryboardTap(storyboardsList[0]);
                                }
                            }}
                        >
                            {storyboardsList.length === 0 ? t("story_detail.actions.create_first_storyboard", "Create First Storyboard") : t("story_detail.actions.start_reading", "Start Reading")}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
