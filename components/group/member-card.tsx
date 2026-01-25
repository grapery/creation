"use client";

import { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Shield, Crown, User as UserIcon } from "lucide-react";

interface MemberCardProps {
    member: {
        id: string;
        userId: string;
        role: string;
        joinedAt: number;
        user?: User;
    };
}

export function MemberCard({ member }: MemberCardProps) {
    // Golden Ratio Calculations
    // Card Aspect Ratio: Height = Width * 1.618
    // Internal Split: Image Height = Total Height * 0.618

    const roleIcon = member.role === "owner" ? <Crown className="w-3 h-3 text-yellow-500" /> :
        member.role === "admin" ? <Shield className="w-3 h-3 text-blue-500" /> : null;

    const roleLabel = member.role === "owner" ? "Owner" :
        member.role === "admin" ? "Admin" : "Member";

    const joinedDate = member.joinedAt ? formatDistanceToNow(new Date(member.joinedAt * 1000), { addSuffix: true }) : 'recently';

    return (
        <div className="w-full relative group">
            {/* 
                Enforce Golden Rectangle Aspect Ratio (Portrait) 
                Width: 1, Height: 1.618
                padding-bottom = 161.8% 
            */}
            <div className="w-full pb-[161.8%] relative rounded-xl overflow-hidden shadow-sm border border-border/50 bg-card hover:shadow-md transition-all duration-300 group-hover:translate-y-[-4px]">
                <div className="absolute inset-0 flex flex-col">
                    {/* 
                        Golden Section Split
                        Image Area: 61.8%
                        Info Area: 38.2%
                    */}

                    {/* Avatar Area (61.8%) */}
                    <div className="h-[61.8%] w-full relative overflow-hidden bg-secondary/30">
                        {member.user?.avatar ? (
                            <img
                                src={member.user.avatar}
                                alt={member.user.username}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                                <UserIcon className="w-1/3 h-1/3 text-muted-foreground/40" />
                            </div>
                        )}

                        {/* Overlay Gradient for Text Contrast Transition */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Info Area (38.2%) */}
                    <div className="h-[38.2%] w-full p-4 flex flex-col justify-between bg-card text-card-foreground group-hover:bg-accent/5 transition-colors relative">
                        {/* Decorative Line - Golden Section Marker */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

                        <div className="space-y-1 pt-1">
                            <div className="flex items-center gap-1.5 mb-1">
                                {member.role !== 'member' && (
                                    <span className={cn(
                                        "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm flex items-center gap-1",
                                        member.role === 'owner' ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    )}>
                                        {roleIcon}
                                        {roleLabel}
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-lg leading-tight truncate font-display">
                                {member.user?.displayName || member.user?.username || "Unknown User"}
                            </h3>

                            {member.user?.username && (
                                <p className="text-xs text-muted-foreground truncate">
                                    @{member.user.username}
                                </p>
                            )}
                        </div>

                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium">
                            Joined {joinedDate}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
