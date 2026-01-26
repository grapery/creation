"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Ban, Shield } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function GroupSettingsPage() {
    const { id } = useParams();

    return (
        <div className="space-y-6 max-w-2xl">
            <h2 className="text-xl font-bold">Group Settings</h2>

            <Card>
                <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Update your group's profile details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Group Name</label>
                        <Input placeholder="Enter group name" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input placeholder="Enter description" />
                    </div>
                    <div className="flex justify-end">
                        <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Ban className="h-5 w-5 text-destructive" />
                        Blacklist Management
                    </CardTitle>
                    <CardDescription>
                        Manage users who are blocked from this group
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href={`/groups/${id}/blacklist`}>
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <Shield className="h-4 w-4" />
                            View Blacklist
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            <Card className="border-destructive/20">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive">Delete Group</Button>
                </CardContent>
            </Card>
        </div>
    );
}
