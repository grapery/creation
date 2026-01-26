"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { groups } from "@/lib/api/groups";
import { GroupBlacklistInfo } from "@/lib/types";
import { Loader2, Ban, ShieldAlert, UserX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function GroupBlacklistPage() {
    const { id } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [blacklist, setBlacklist] = useState<GroupBlacklistInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 20;

    const [unblockUser, setUnblockUser] = useState<GroupBlacklistInfo | null>(null);
    const [unblocking, setUnblocking] = useState(false);

    useEffect(() => {
        if (!id) return;
        loadBlacklist();
    }, [id, page]);

    async function loadBlacklist() {
        try {
            const res = await groups.getBlacklist(id as string, page, limit);
            setBlacklist(res.blacklist || []);
            setTotalCount(res.count || 0);
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Error",
                description: error.message || "Failed to load blacklist",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleUnblock() {
        if (!unblockUser || !id) return;

        setUnblocking(true);
        try {
            await groups.unblockUser(id as string, unblockUser.userId);
            toast({
                title: "Success",
                description: "User unblocked successfully",
            });
            loadBlacklist();
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Error",
                description: error.message || "Failed to unblock user",
                variant: "destructive",
            });
        } finally {
            setUnblocking(false);
            setUnblockUser(null);
        }
    }

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 container max-w-6xl px-4 md:px-6 mx-auto py-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/groups/${id}/members`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Ban className="h-6 w-6 text-destructive" />
                            Blacklist
                        </h2>
                        <p className="text-muted-foreground">
                            {totalCount} {totalCount === 1 ? 'user' : 'users'} blocked
                        </p>
                    </div>
                </div>
            </div>

            {/* Blacklist */}
            {blacklist.length > 0 ? (
                <div className="space-y-4">
                    {blacklist.map((item) => (
                        <Card key={item.id} className="border-destructive/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* User Avatar */}
                                        <div className="relative">
                                            {item.user?.avatar ? (
                                                <img
                                                    src={item.user.avatar}
                                                    alt={item.user.username}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                                    <UserX className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 bg-destructive rounded-full p-1">
                                                <Ban className="h-3 w-3 text-white" />
                                            </div>
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">
                                                    {item.user?.displayName || item.user?.username}
                                                </h3>
                                                <span className="text-sm text-muted-foreground">
                                                    @{item.user?.username}
                                                </span>
                                            </div>

                                            {item.reason && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    <span className="font-medium">Reason:</span> {item.reason}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                <span>
                                                    Blocked by {item.admin?.displayName || item.admin?.username}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {new Date(item.createdAt * 1000).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setUnblockUser(item)}
                                        >
                                            Unblock
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-20">
                        <div className="text-center text-muted-foreground space-y-4">
                            <ShieldAlert className="h-16 w-16 mx-auto opacity-20" />
                            <p>No users in blacklist</p>
                            <p className="text-sm">
                                Users that violate group rules can be blocked from accessing this group
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {totalCount > limit && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm text-muted-foreground">
                        Page {page} of {Math.ceil(totalCount / limit)}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= Math.ceil(totalCount / limit)}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Unblock Confirmation Dialog */}
            <AlertDialog open={!!unblockUser} onOpenChange={() => setUnblockUser(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unblock User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to unblock{" "}
                            <span className="font-semibold">
                                {unblockUser?.user?.displayName || unblockUser?.user?.username}
                            </span>
                            ? They will be able to join and interact with this group again.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleUnblock}
                            disabled={unblocking}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {unblocking ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Unblocking...
                                </>
                            ) : (
                                "Unblock User"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
