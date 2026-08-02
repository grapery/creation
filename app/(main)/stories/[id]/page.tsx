"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { stories } from "@/lib/api/stories";
import { storyboards } from "@/lib/api/storyboards";
import { characters as charactersApi } from "@/lib/api/characters";
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
import { parseShareGrant } from "@/lib/share-grant";

export default function StoryPage() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const shareGrant = parseShareGrant(searchParams);
    const { t } = useTranslation();
    const router = useRouter();
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(() => {
        const tab = searchParams.get("tab");
        return tab === "characters" || tab === "scenes" || tab === "team" ? tab : "story";
    });

    // Story tab data
    const [storyboardsList, setStoryboardsList] = useState<Storyboard[]>([]);
    const [loadingStoryboards, setLoadingStoryboards] = useState(true);
    const [liking, setLiking] = useState(false);

    // Characters tab data
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loadingCharacters, setLoadingCharacters] = useState(true);
    const [charactersError, setCharactersError] = useState<string>("");

    // Scenes tab data
    const [scenes, setScenes] = useState<StoryScene[]>([]);
    const [loadingScenes, setLoadingScenes] = useState(true);
    const [scenesError, setScenesError] = useState<string>("");

    // Team tab data
    const [creators, setCreators] = useState<ContentCreator[]>([]);
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loadingTeam, setLoadingTeam] = useState(true);
    const [teamError, setTeamError] = useState<string>("");

    useEffect(() => {
        if (!id) return;
        async function load() {
            try {
                const data = await stories.get(id as string, shareGrant);
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
    }, [id, shareGrant?.token, shareGrant?.exp]);

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
        setCharactersError("");
        try {
            // Fetch characters from API using storyId
            const response = await charactersApi.list({ storyId });
            setCharacters(response.characters || []);
        } catch (e: any) {
            console.error('Failed to load characters:', e);
            setCharacters([]);
            // Set error message
            if (e.code === 401 || e.message?.includes('authorization')) {
                setCharactersError('Please login to view characters');
            } else {
                setCharactersError('Failed to load characters');
            }
        } finally {
            setLoadingCharacters(false);
        }
    };

    const loadScenes = async (storyId: string) => {
        setLoadingScenes(true);
        setScenesError("");
        try {
            // Fetch scenes from API
            const response = await stories.getScenes(storyId);
            setScenes(response.scenes || []);
        } catch (e: any) {
            console.error('Failed to load scenes:', e);
            setScenes([]);
            // Set error message
            if (e.code === 401 || e.message?.includes('authorization')) {
                setScenesError('Please login to view scenes');
            } else {
                setScenesError('Failed to load scenes');
            }
        } finally {
            setLoadingScenes(false);
        }
    };

    const loadTeam = async (storyId: string) => {
        setLoadingTeam(true);
        setTeamError("");
        try {
            if (!story) return;

            const creators: ContentCreator[] = [];
            const seenUserIds = new Set<string>();
            const storyboardCountByUser: Record<string, number> = {};

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
            characters.forEach((character: Character) => {
                if (character.creatorId) {
                    if (!seenUserIds.has(character.creatorId)) {
                        const authorName = character.author?.displayName || character.author?.username || "Unknown Creator";
                        const authorAvatar = character.author?.avatar;

                        creators.push({
                            id: `character-creator-${character.creatorId}`,
                            userId: character.creatorId,
                            name: authorName,
                            avatar: authorAvatar,
                            role: CreatorRole.CharacterCreator,
                            contributionCount: 1
                        });
                        seenUserIds.add(character.creatorId);
                    }
                }
            });

            setCreators(creators);

            // Fetch contributors from API
            const contributorsResponse = await stories.getContributors(storyId);
            setContributors(contributorsResponse.contributors || []);
        } catch (e: any) {
            console.error('Failed to load team:', e);
            setCreators([]);
            setContributors([]);
            // Set error message
            if (e.code === 401 || e.message?.includes('authorization')) {
                setTeamError('Please login to view team members');
            } else {
                setTeamError('Failed to load team members');
            }
        } finally {
            setLoadingTeam(false);
        }
    };

    const handleLike = async () => {
        if (!story) return;
        setLiking(true);
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
        } finally {
            setLiking(false);
        }
    };

    const handleRead = () => {
        const first = storyboardsList[0];
        if (first?.id) {
            router.push(`/stories/${story?.id}/read?board=${first.id}`);
            return;
        }
        router.push(`/stories/${id}/read`);
    };

    const handleStoryboardTap = (storyboard: Storyboard) => {
        router.push(`/storyboards/${storyboard.id}`);
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );

    if (!story) return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">{t("story_detail.story_not_found", "Story Not Found")}</h1>
                <p className="text-muted-foreground mb-4">{t("story_detail.story_not_found_message", "The story you're looking for doesn't exist.")}</p>
                <Button onClick={() => router.push("/")}>{t("story_detail.go_home", "Go Home")}</Button>
            </div>
        </div>
    );

    return (
        <main className="flex-1">
            {/* Immersive Header */}
            <StoryDetailHeader
                story={story}
                onLike={handleLike}
                onRead={handleRead}
                liking={liking}
            />

            {/* Tab Navigation */}
            <div className="border-b border-border/50 bg-background sticky top-14 z-20">
                <div className="container max-w-6xl px-4 md:px-6 mx-auto py-3">
                    <StoryTabs initialTab={activeTab} onTabChange={setActiveTab} />
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
                        isLoading={loadingCharacters}
                        error={charactersError}
                        onAddCharacter={() => {
                            router.push(`/characters/create`);
                        }}
                    />
                )}

                {activeTab === "scenes" && (
                    <StoryScenesSection
                        title={t("story_detail.tabs.scenes", "Scenes")}
                        scenes={scenes}
                        storyId={story.id}
                        isLoading={loadingScenes}
                        error={scenesError}
                        onAddScene={() => {
                            router.push(`/stories/${story.id}/scenes/new`);
                        }}
                    />
                )}

                {activeTab === "team" && (
                    <StoryTeamSection
                        title={t("story_detail.contributors", "Contributors")}
                        creators={creators}
                        contributors={contributors}
                        isLoading={loadingTeam}
                        error={teamError}
                        onInvite={() => {
                            const userId = prompt("Enter contributor's user ID:");
                            if (userId) {
                                stories.inviteContributor(story.id, userId, 'collaborator').catch(e => console.error(e));
                            }
                        }}
                    />
                )}
            </div>


        </main>
    );
}
