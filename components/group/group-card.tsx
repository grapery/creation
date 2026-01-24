"use client";

import Link from "next/link";
import { BranchGroup } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Users, Book, Globe, Lock, ChevronRight } from "lucide-react";

export function GroupCard({
    group,
    showJoinButton = false,
}: {
    group: BranchGroup;
    showJoinButton?: boolean;
}) {
    const memberCount = group.members ?? group.memberCount ?? 0;
    const storyCount = group.stories ?? group.storyCount ?? 0;

    return (
        <div className="bg-card border border-border rounded-xl p-4 min-h-[120px]">
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative">
                    {group.avatar || group.displayImage ? (
                        <img
                            src={group.avatar || group.displayImage}
                            alt={group.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="text-base font-bold text-foreground">
                                {group.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {memberCount} members · {storyCount} stories
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Public/Private Tag */}
                            {group.isPublic !== undefined && (
                                <span className="text-[11px] font-medium text-muted-foreground px-2 py-1 bg-secondary rounded-md">
                                    {group.isPublic ? "Public" : "Private"}
                                </span>
                            )}

                            {/* Join Button */}
                            {showJoinButton && (
                                <Button size="sm" className="h-8 px-3 text-xs font-medium">
                                    Join
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {group.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {group.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export function GroupCardLink({ group, showJoinButton = false }: { group: BranchGroup; showJoinButton?: boolean }) {
    return (
        <Link href={`/groups/${group.id}`} className="block">
            <GroupCard group={group} showJoinButton={showJoinButton} />
        </Link>
    );
}

// Search Result Group Card (Compact)
export function SearchResultGroupCard({ group }: { group: BranchGroup }) {
    const memberCount = group.members ?? group.memberCount ?? 0;
    const storyCount = group.stories ?? group.storyCount ?? 0;

    return (
        <Link
            href={`/groups/${group.id}`}
            className="block"
        >
            <div className="bg-card border border-border rounded-xl p-3">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-secondary flex-shrink-0 overflow-hidden">
                        {group.avatar || group.displayImage ? (
                            <img
                                src={group.avatar || group.displayImage}
                                alt={group.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-semibold text-foreground truncate">
                            {group.name}
                        </h4>

                        {/* Stats */}
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                                <Users className="w-3 h-3" />
                                <span>{memberCount}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                                <Book className="w-3 h-3" />
                                <span>{storyCount}</span>
                            </div>

                            {/* Public Tag */}
                            {group.isPublic && (
                                <span className="text-[10px] font-medium text-muted-foreground px-1.5 py-0.5 bg-secondary rounded">
                                    Public
                                </span>
                            )}
                        </div>

                        {/* Description Preview */}
                        {group.description && (
                            <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                                {group.description}
                            </p>
                        )}
                    </div>

                    {/* Chevron */}
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                </div>
            </div>
        </Link>
    );
}

// Invite Card
export function GroupInviteCard({
    invite,
    onAccept,
    onReject,
}: {
    invite: {
        id: string;
        group?: {
            id: string;
            name: string;
            avatar?: string;
            description?: string;
        };
        inviter?: {
            id: string;
            username?: string;
            displayName?: string;
            avatar?: string;
        };
    };
    onAccept: () => void;
    onReject: () => void;
}) {
    return (
        <div className="bg-card border border-border rounded-xl p-4">
            <div className="space-y-4">
                {/* Group Info */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                        {invite.group?.avatar ? (
                            <img
                                src={invite.group.avatar}
                                alt={invite.group.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-foreground truncate">
                            {invite.group?.name || "Unknown Group"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Invited by {invite.inviter?.displayName || invite.inviter?.username || "Unknown"}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        onClick={onAccept}
                        className="flex-1"
                    >
                        Accept
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onReject}
                        className="flex-1"
                    >
                        Decline
                    </Button>
                </div>
            </div>
        </div>
    );
}
