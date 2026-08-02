"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { profile } from "@/lib/api/profile";
import { showError, showSuccess } from "@/lib/toast-utils";
import { Checkbox } from "@/components/ui/checkbox";

export type ReportTarget =
    | { kind: "user"; userId: string; label?: string }
    | {
          kind: "content";
          contentType: "storyboard" | "story" | "comment" | "fragment" | "character";
          contentId: string;
          label?: string;
          authorId?: string;
      };

const REASONS = [
    "Spam or misleading",
    "Harassment or bullying",
    "Hate speech or discrimination",
    "Sexual content / nudity",
    "Violence or dangerous acts",
    "Intellectual property",
    "Other",
];

interface ReportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    target: ReportTarget | null;
    /** Also offer block when reporting a user or content with authorId */
    allowBlock?: boolean;
}

export function ReportDialog({ open, onOpenChange, target, allowBlock = true }: ReportDialogProps) {
    const [reason, setReason] = useState(REASONS[0]);
    const [details, setDetails] = useState("");
    const [alsoBlock, setAlsoBlock] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const blockUserId =
        target?.kind === "user"
            ? target.userId
            : target?.kind === "content"
              ? target.authorId
              : undefined;

    const handleSubmit = async () => {
        if (!target) return;
        const fullReason = details.trim() ? `${reason}: ${details.trim()}` : reason;
        setSubmitting(true);
        try {
            if (target.kind === "user") {
                await profile.reportUser(target.userId, fullReason);
            } else {
                await profile.reportContent(target.contentType, target.contentId, fullReason);
            }
            if (alsoBlock && allowBlock && blockUserId) {
                await profile.blockUser(blockUserId);
            }
            showSuccess("Report submitted", "Thanks — our team will review it.");
            onOpenChange(false);
            setDetails("");
            setAlsoBlock(false);
        } catch (e) {
            showError(e instanceof Error ? e.message : "Failed to submit report");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report</DialogTitle>
                    <DialogDescription>
                        {target?.kind === "user"
                            ? `Report ${target.label || "this user"}`
                            : `Report ${target?.label || "this content"}`}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Reason</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {REASONS.map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Details (optional)</Label>
                        <Textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            rows={3}
                            maxLength={400}
                            placeholder="Add context for moderators"
                        />
                    </div>
                    {allowBlock && blockUserId && (
                        <div className="flex items-center gap-3 text-sm">
                            <Checkbox
                                id="also-block"
                                checked={alsoBlock}
                                onCheckedChange={setAlsoBlock}
                            />
                            <Label htmlFor="also-block" className="font-normal cursor-pointer">
                                Also block this user
                            </Label>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={submitting}>
                        {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
