"use client";

import { Contributor } from "@/lib/types";
import { UserPlus, MessageSquare, Crown, BookOpen, User, Image as ImageIcon, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/language-provider";

interface StoryTeamSectionProps {
    title: string;
    creators: ContentCreator[];
    contributors: Contributor[];
    isLoading?: boolean;
    error?: string;
    onInvite?: () => void;
    onOpenWritersRoom?: () => void;
}

export interface ContentCreator {
    id: string;
    userId: string;
    name: string;
    avatar?: string;
    role: CreatorRole;
    contributionCount: number;
}

export enum CreatorRole {
    StoryAuthor = "Story Author",
    StoryboardCreator = "Storyboard Creator",
    CharacterCreator = "Character Creator",
    SceneCreator = "Scene Creator",
    Contributor = "Contributor"
}

export function StoryTeamSection({
    title,
    creators,
    contributors,
    isLoading = false,
    error,
    onInvite,
    onOpenWritersRoom
}: StoryTeamSectionProps) {
    const { t } = useTranslation();
    const totalCount = creators.length + contributors.length;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">
                    {title} ({totalCount})
                </h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onInvite}
                    className="flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    <span className="text-sm font-semibold">{t("story_detail.empty.invite", "Invite")}</span>
                </Button>
            </div>

            {/* Writers Room Card */}
            <div className="bg-muted/50 border border-border/5 rounded-2xl p-4.5">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-2">
                            <MessageSquare className="w-5 h-5 text-foreground" />
                            <h3 className="text-[15px] font-semibold text-foreground">{t("story_detail.empty.writers_room", "Writers Room")}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {t("story_detail.empty.writers_room_desc", "Collaborate in real-time with AI assistance")}
                        </p>
                    </div>
                    <Button
                        onClick={onOpenWritersRoom}
                        className="bg-foreground text-foreground px-4 py-2.5 text-sm font-semibold rounded-xl"
                    >
                        {t("story_detail.empty.open_chat", "Open Chat")}
                    </Button>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="bg-card border border-border/8 rounded-2xl p-10 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3" />
                    <p className="text-sm text-muted-foreground">{t("common.loading", "Loading team...")}</p>
                </div>
            ) : error ? (
                <div className="bg-card border border-border/8 rounded-2xl p-6 text-center">
                    <Users2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground mb-1">{t("story_detail.error.title", "Unable to load team")}</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </div>
            ) : creators.length === 0 && contributors.length === 0 ? (
                <div className="bg-card border border-border/8 rounded-2xl p-6 text-center">
                    <Users2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground mb-1">{t("story_detail.empty.no_team_title", "No team members yet")}</p>
                    <p className="text-sm text-muted-foreground">{t("story_detail.empty.no_team_message", "Invite contributors to collaborate")}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Content creators */}
                    {creators.map((creator) => (
                        <ContentCreatorRow key={creator.id} creator={creator} />
                    ))}

                    {/* Traditional contributors */}
                    {contributors.map((contributor) => (
                        <ContributorRow key={contributor.id} contributor={contributor} />
                    ))}
                </div>
            )}
        </div>
    );
}

interface ContentCreatorRowProps {
    creator: ContentCreator;
}

function ContentCreatorRow({ creator }: ContentCreatorRowProps) {
    const roleInfo = getRoleInfo(creator.role);

    return (
        <div className="bg-card border border-border/8 rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer hover:bg-accent/5 transition-colors">
            {/* Avatar */}
            <div className="flex-shrink-0">
                {creator.avatar ? (
                    <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-14 h-14 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xl font-bold text-muted-foreground">
                            {creator.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-foreground truncate">
                    {creator.name}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    {roleInfo.icon}
                    <span className="truncate">{roleInfo.label}</span>
                </div>
            </div>

            {/* Role Badge */}
            <div
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold ${roleInfo.badgeClasses}`}
            >
                {creator.contributionCount > 1 && (
                    <span>{creator.contributionCount}</span>
                )}
                {roleInfo.icon}
            </div>
        </div>
    );
}

interface ContributorRowProps {
    contributor: Contributor;
}

function ContributorRow({ contributor }: ContributorRowProps) {
    const badgeStyle = contributor.badgeStyle || "custom";

    return (
        <div className="bg-card border border-border/8 rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer hover:bg-accent/5 transition-colors">
            {/* Avatar */}
            <div className="flex-shrink-0">
                {contributor.avatar ? (
                    <img
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="w-14 h-14 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xl font-bold text-muted-foreground">
                            {contributor.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-foreground truncate">
                    {contributor.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                    {contributor.role || "Contributor"}
                </p>
            </div>

            {/* Role Badge */}
            {badgeStyle && (
                <ContributorRoleBadge style={badgeStyle} />
            )}
        </div>
    );
}

interface ContributorRoleBadgeProps {
    style: string;
}

function ContributorRoleBadge({ style }: ContributorRoleBadgeProps) {
    const config = getBadgeConfig(style);

    return (
        <span
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold capitalize ${config.classes}`}
        >
            {config.label}
        </span>
    );
}

function getBadgeConfig(style: string) {
    switch (style) {
        case "owner":
            return { label: "owner", classes: "bg-foreground text-background" };
        case "collaborator":
            return { label: "collaborator", classes: "bg-muted text-foreground/85" };
        case "contributor":
            return { label: "contributor", classes: "bg-background text-foreground border border-border/10" };
        case "custom":
        default:
            return { label: "member", classes: "bg-muted/50 text-foreground" };
    }
}

function getRoleInfo(role: CreatorRole) {
    switch (role) {
        case CreatorRole.StoryAuthor:
            return {
                icon: <Crown className="w-2.5 h-2.5" />,
                label: "Story Author",
                badgeClasses: "bg-foreground text-background"
            };
        case CreatorRole.StoryboardCreator:
            return {
                icon: <BookOpen className="w-2.5 h-2.5" />,
                label: "Storyboard Creator",
                badgeClasses: "bg-blue-500 text-white"
            };
        case CreatorRole.CharacterCreator:
            return {
                icon: <User className="w-2.5 h-2.5" />,
                label: "Character Creator",
                badgeClasses: "bg-purple-500 text-white"
            };
        case CreatorRole.SceneCreator:
            return {
                icon: <ImageIcon className="w-2.5 h-2.5" />,
                label: "Scene Creator",
                badgeClasses: "bg-green-500 text-white"
            };
        case CreatorRole.Contributor:
            return {
                icon: <Users2 className="w-2.5 h-2.5" />,
                label: "Contributor",
                badgeClasses: "bg-muted text-foreground"
            };
        default:
            return {
                icon: <User className="w-2.5 h-2.5" />,
                label: "Contributor",
                badgeClasses: "bg-muted text-foreground"
            };
    }
}
