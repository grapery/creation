"use client";

import { useState } from "react";
import { Flag, Ban, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportDialog, ReportTarget } from "@/components/moderation/report-dialog";
import { profile } from "@/lib/api/profile";
import { useAuth } from "@/providers/auth-provider";
import { useLoginPrompt } from "@/components/auth/login-prompt";
import { showError, showSuccess } from "@/lib/toast-utils";

interface ContentModerationMenuProps {
    target: ReportTarget;
    className?: string;
}

export function ContentModerationMenu({ target, className }: ContentModerationMenuProps) {
    const { user } = useAuth();
    const { LoginPromptModal, show: showLoginPrompt } = useLoginPrompt();
    const [reportOpen, setReportOpen] = useState(false);
    const [blocking, setBlocking] = useState(false);

    const blockUserId =
        target.kind === "user" ? target.userId : target.kind === "content" ? target.authorId : undefined;

    const selfId =
        target.kind === "user"
            ? target.userId
            : target.kind === "content"
              ? target.authorId
              : undefined;

    if (user && selfId && user.id === selfId) {
        return null;
    }

    const requireAuth = (fn: () => void) => {
        if (!user) {
            showLoginPrompt();
            return;
        }
        fn();
    };

    const handleBlock = async () => {
        if (!blockUserId) return;
        setBlocking(true);
        try {
            await profile.blockUser(blockUserId);
            showSuccess("User blocked", "You can manage blocked users in Settings.");
        } catch (e) {
            showError(e instanceof Error ? e.message : "Failed to block user");
        } finally {
            setBlocking(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className={className} aria-label="More actions">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => requireAuth(() => setReportOpen(true))}>
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                    </DropdownMenuItem>
                    {blockUserId && (
                        <DropdownMenuItem
                            disabled={blocking}
                            onClick={() => requireAuth(() => handleBlock())}
                            className="text-destructive focus:text-destructive"
                        >
                            <Ban className="h-4 w-4 mr-2" />
                            Block user
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <ReportDialog open={reportOpen} onOpenChange={setReportOpen} target={target} />
            <LoginPromptModal />
        </>
    );
}
