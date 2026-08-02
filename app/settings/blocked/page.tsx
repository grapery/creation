"use client";

import { useState, useEffect, useCallback } from "react";
import { ShieldOff, Loader2, UserX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { profile } from "@/lib/api/profile";
import { showSuccess, showError } from "@/lib/toast-utils";

interface BlockedUser {
    id: string;
    username?: string;
    displayName?: string;
    avatar?: string;
}

export default function BlockedUsersPage() {
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [unblockingId, setUnblockingId] = useState<string | null>(null);

    const fetchBlockedUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await profile.getBlockedUsers(1, 100);
            setBlockedUsers(res.users || []);
            setTotal(res.total || 0);
        } catch (err: any) {
            console.error("Failed to fetch blocked users:", err);
            setError(err.message || "Failed to load blocked users");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlockedUsers();
    }, [fetchBlockedUsers]);

    const handleUnblock = async (userId: string) => {
        setUnblockingId(userId);
        try {
            await profile.unblockUser(userId);
            setBlockedUsers((prev) => prev.filter((u) => u.id !== userId));
            setTotal((prev) => Math.max(0, prev - 1));
            showSuccess("User unblocked", "The user has been removed from your blocked list.");
        } catch (err: any) {
            console.error("Failed to unblock user:", err);
            showError("Failed to unblock", err.message || "Something went wrong. Please try again.");
        } finally {
            setUnblockingId(null);
        }
    };

    const getDisplayName = (user: BlockedUser) => {
        return user.displayName || user.username || "Unknown User";
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <ShieldOff className="h-6 w-6" />
                    Blocked Users
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage the users you have blocked. Blocked users cannot interact with you or view your content.
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-3">Loading blocked users...</p>
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <ShieldOff className="h-12 w-12 text-muted-foreground/40" />
                        <p className="text-base font-medium text-foreground mt-4">
                            Unable to load blocked users
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
                            {error}
                        </p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={fetchBlockedUsers}>
                            Try again
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {!loading && !error && blockedUsers.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <UserX className="h-12 w-12 text-muted-foreground/40" />
                        <p className="text-base font-medium text-foreground mt-4">
                            No blocked users
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
                            You have not blocked anyone. Users you block will appear here.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Blocked Users List */}
            {!loading && !error && blockedUsers.length > 0 && (
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border">
                            {blockedUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Avatar className="h-10 w-10 flex-shrink-0">
                                            {user.avatar && (
                                                <AvatarImage src={user.avatar} alt={getDisplayName(user)} />
                                            )}
                                            <AvatarFallback className="text-xs">
                                                {getInitials(getDisplayName(user))}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {getDisplayName(user)}
                                            </p>
                                            {user.username && user.username !== user.displayName && (
                                                <p className="text-xs text-muted-foreground truncate">
                                                    @{user.username}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={unblockingId === user.id}
                                                className="flex-shrink-0 ml-3"
                                            >
                                                {unblockingId === user.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                                ) : null}
                                                Unblock
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Unblock User</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to unblock{" "}
                                                    <span className="font-medium text-foreground">
                                                        {getDisplayName(user)}
                                                    </span>
                                                    ? They will be able to view your content and interact with you again.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleUnblock(user.id)}
                                                    className="bg-primary text-primary-foreground"
                                                >
                                                    Unblock
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))}
                        </div>

                        {total > blockedUsers.length && (
                            <div className="p-4 border-t border-border text-center">
                                <p className="text-xs text-muted-foreground">
                                    Showing {blockedUsers.length} of {total} blocked users
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
