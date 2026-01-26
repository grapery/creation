"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { groups } from "@/lib/api/groups";
import { User } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { MemberCard } from "@/components/group/member-card";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";

interface GroupMember {
    id: string;
    userId: string;
    role: string;
    joinedAt: number;
    user?: User;
}

export default function GroupMembersPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [group, setGroup] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        async function load() {
            try {
                const [membersRes, groupRes] = await Promise.all([
                    groups.getMembers(id as string),
                    groups.get(id as string)
                ]);
                setMembers(membersRes.members || []);
                setGroup(groupRes);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const handleMemberBlocked = () => {
        // Reload members and group data
        if (!id) return;
        async function reload() {
            try {
                const [membersRes, groupRes] = await Promise.all([
                    groups.getMembers(id as string),
                    groups.get(id as string)
                ]);
                setMembers(membersRes.members || []);
                setGroup(groupRes);
            } catch (e) {
                console.error(e);
            }
        }
        reload();
    };

    if (loading) return (
        <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
    );

    const currentUserRole = group?.myRole;
    const isAdmin = currentUserRole && ['owner', 'admin'].includes(currentUserRole);

    return (
        <div className="space-y-8 container max-w-6xl px-4 md:px-6 mx-auto py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Members</h2>
                    <p className="text-muted-foreground">
                        {members.length} {members.length === 1 ? 'member' : 'members'} in this group
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Blacklist Link - Only for admins */}
                    {isAdmin && (
                        <Link href={`/groups/${id}/blacklist`}>
                            <Button variant="outline" className="gap-2">
                                <Ban className="h-4 w-4" />
                                Blacklist
                                {group?.blockedCount > 0 && (
                                    <span className="bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 text-xs">
                                        {group.blockedCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Responsive Grid for Golden Ratio Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {members.map(member => (
                    <MemberCard
                        key={member.id}
                        member={member}
                        groupId={id as string}
                        currentUserId={user?.id}
                        currentUserRole={currentUserRole}
                        onBlocked={handleMemberBlocked}
                    />
                ))}
            </div>

            {members.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No members found.
                </div>
            )}
        </div>
    );
}
