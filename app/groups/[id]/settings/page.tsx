"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function GroupSettingsPage() {
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
