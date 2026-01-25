"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/api/profile";
import { UserList } from "@/components/profile/user-list";
import { useAuth } from "@/providers/auth-provider";
import { User } from "@/lib/types";

export default function FollowingPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        async function load() {
            try {
                const res = await profile.getFollowing(user!.id);
                setUsers(res.users || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [user]);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Following</h2>
            <UserList users={users} loading={loading} />
        </div>
    );
}
