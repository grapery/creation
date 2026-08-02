"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Lock, CheckCircle, Trash2 } from "lucide-react";
import { auth } from "@/lib/api/auth";
import { showError, showSuccess } from "@/lib/toast-utils";

export default function SecuritySettingsPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [deletionStatus, setDeletionStatus] = useState<{
        isPending: boolean;
        gracePeriodEndsAt?: number;
        scheduledDeletionAt?: number;
    } | null>(null);
    const [smsSent, setSmsSent] = useState(false);
    const [smsCode, setSmsCode] = useState("");
    const [smsVerified, setSmsVerified] = useState(false);
    const [riskAck, setRiskAck] = useState(false);
    const [deletionBusy, setDeletionBusy] = useState(false);

    useEffect(() => {
        auth.getAccountDeletionStatus()
            .then(setDeletionStatus)
            .catch(() => setDeletionStatus({ isPending: false }));
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setError("");

            if (form.newPassword !== form.confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            if (form.newPassword.length < 8) {
                setError("Password must be at least 8 characters");
                return;
            }

            setLoading(true);
            try {
                await auth.changePassword(form.oldPassword, form.newPassword);
                setSuccess(true);
                setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
            } catch (err: any) {
                setError(err.message || "Failed to change password");
            } finally {
                setLoading(false);
            }
        },
        [form]
    );

    const handleSendDeletionSMS = async () => {
        setDeletionBusy(true);
        try {
            await auth.sendAccountDeletionSMS();
            setSmsSent(true);
            showSuccess("Verification code sent to your bound phone");
        } catch (e) {
            showError(e instanceof Error ? e.message : "Failed to send SMS — bind a phone first");
        } finally {
            setDeletionBusy(false);
        }
    };

    const handleVerifyDeletionSMS = async () => {
        if (smsCode.length !== 6) {
            showError("Enter the 6-digit code");
            return;
        }
        setDeletionBusy(true);
        try {
            await auth.verifyAccountDeletionSMS(smsCode);
            setSmsVerified(true);
            showSuccess("Phone verified for deletion");
        } catch (e) {
            showError(e instanceof Error ? e.message : "Invalid code");
        } finally {
            setDeletionBusy(false);
        }
    };

    const handleRequestDeletion = async () => {
        if (!riskAck) {
            showError("Please acknowledge the risks");
            return;
        }
        setDeletionBusy(true);
        try {
            const st = await auth.requestAccountDeletion(true);
            setDeletionStatus(st);
            showSuccess("Deletion scheduled", "You can cancel during the grace period.");
        } catch (e) {
            showError(e instanceof Error ? e.message : "Failed to schedule deletion");
        } finally {
            setDeletionBusy(false);
        }
    };

    const handleCancelDeletion = async () => {
        setDeletionBusy(true);
        try {
            await auth.cancelAccountDeletion();
            setDeletionStatus({ isPending: false });
            setSmsSent(false);
            setSmsVerified(false);
            setSmsCode("");
            setRiskAck(false);
            showSuccess("Account deletion cancelled");
        } catch (e) {
            showError(e instanceof Error ? e.message : "Failed to cancel");
        } finally {
            setDeletionBusy(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Security</h2>
                <p className="text-muted-foreground">Password and account deletion controls.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Lock className="h-5 w-5" />
                        Change Password
                    </CardTitle>
                    <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent>
                    {success && (
                        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-green-500/10 text-green-700 dark:text-green-300 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            Password changed successfully
                        </div>
                    )}
                    {error && (
                        <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="old-password">Current Password</Label>
                            <Input
                                id="old-password"
                                type="password"
                                value={form.oldPassword}
                                onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={form.newPassword}
                                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                required
                                minLength={8}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Change Password
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-destructive/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base text-destructive">
                        <Trash2 className="h-5 w-5" />
                        Delete account
                    </CardTitle>
                    <CardDescription>
                        Requires a bound phone. After confirmation there is a grace period before permanent
                        deletion.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {deletionStatus?.isPending ? (
                        <>
                            <p className="text-sm text-muted-foreground">
                                Deletion is pending
                                {deletionStatus.gracePeriodEndsAt
                                    ? ` until ${new Date(deletionStatus.gracePeriodEndsAt * 1000).toLocaleString()}`
                                    : ""}
                                .
                            </p>
                            <Button variant="outline" onClick={handleCancelDeletion} disabled={deletionBusy}>
                                {deletionBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Cancel deletion
                            </Button>
                        </>
                    ) : (
                        <>
                            {!smsVerified && (
                                <div className="space-y-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleSendDeletionSMS}
                                        disabled={deletionBusy}
                                    >
                                        {deletionBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {smsSent ? "Resend SMS code" : "Send SMS verification"}
                                    </Button>
                                    {smsSent && (
                                        <div className="flex gap-2">
                                            <Input
                                                value={smsCode}
                                                onChange={(e) => setSmsCode(e.target.value)}
                                                placeholder="6-digit code"
                                                maxLength={6}
                                            />
                                            <Button onClick={handleVerifyDeletionSMS} disabled={deletionBusy}>
                                                Verify
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {smsVerified && (
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 text-sm">
                                        <Checkbox
                                            id="risk-ack"
                                            checked={riskAck}
                                            onCheckedChange={setRiskAck}
                                            className="mt-0.5"
                                        />
                                        <Label htmlFor="risk-ack" className="font-normal leading-snug cursor-pointer">
                                            I understand that my profile, stories, and payment history will be
                                            permanently deleted after the grace period and cannot be recovered.
                                        </Label>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={handleRequestDeletion}
                                        disabled={!riskAck || deletionBusy}
                                    >
                                        {deletionBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Schedule account deletion
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
