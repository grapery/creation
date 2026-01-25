"use client";

import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

interface UserListProps {
    users: User[];
    loading?: boolean;
    onFollow?: (id: string) => void;
    onUnfollow?: (id: string) => void;
}

export function UserList({ users, loading, onFollow, onUnfollow }: UserListProps) {
    if (loading) return <div>Loading...</div>;
    if (users.length === 0) return <div className="text-muted-foreground text-center py-8">No users found.</div>;

    return (
        <div className="space-y-4">
            {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.username?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold">{user.displayName || user.username}</div>
                            <div className="text-xs text-muted-foreground">@{user.username}</div>
                        </div>
                    </div>
                    {/* Placeholder action */}
                    <Button variant="outline" size="sm">View</Button>
                </div>
            ))}
        </div>
    );
}
