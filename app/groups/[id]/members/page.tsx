"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { groups } from "@/lib/api/groups";
import { User } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { MemberCard } from "@/components/group/member-card";

interface GroupMember {
    id: string;
    userId: string;
    role: string;
    joinedAt: number;
    user?: User;
}

export default function GroupMembersPage() {
    const { id } = useParams();
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        async function load() {
            try {
                const res = await groups.getMembers(id as string);
                setMembers(res.members || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading) return (
        <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
    );

    return (
        <div className="space-y-8 container max-w-6xl px-4 md:px-6 mx-auto py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Members</h2>
                    <p className="text-muted-foreground">
                        {members.length} {members.length === 1 ? 'member' : 'members'} in this group
                    </p>
                </div>

                {/* Potential Filter/Sort Actions could go here */}
            </div>

            {/* Responsive Grid for Golden Ratio Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {members.map(member => (
                    <MemberCard key={member.id} member={member} />
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
