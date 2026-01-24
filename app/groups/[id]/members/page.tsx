"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { groups } from "@/lib/api/groups";
import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Members ({members.length})</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {members.map(member => (
                    <Card key={member.id} className="overflow-hidden">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                                    {member.user?.avatar ? (
                                        <img src={member.user.avatar} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold">{member.user?.username?.[0]?.toUpperCase() || "U"}</span>
                                    )}
                                </div>
                                <div>
                                    <div className="font-semibold flex items-center gap-2">
                                        {member.user?.displayName || member.user?.username || "Unknown"}
                                        {member.role === "owner" && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Owner</span>}
                                        {member.role === "admin" && <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">Admin</span>}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Joined {member.joinedAt ? formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true }) : 'recently'}</div>
                                </div>
                            </div>
                            {/* Actions if needed */}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
