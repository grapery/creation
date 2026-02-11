"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function PrivacySettingsPage() {
    // Profile Privacy
    const [profilePublic, setProfilePublic] = useState(true);
    const [showFollowers, setShowFollowers] = useState(true);
    const [showFollowing, setShowFollowing] = useState(true);

    // Content & Interactions
    const [allowMessages, setAllowMessages] = useState(true);
    const [allowComments, setAllowComments] = useState(true);
    const [showActivity, setShowActivity] = useState(true);
    const [showReadingHistory, setShowReadingHistory] = useState(false);

    // Safety & Content Filtering
    const [parentalControls, setParentalControls] = useState(false);
    const [hideExplicitContent, setHideExplicitContent] = useState(true);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Privacy & Safety</h2>
                <p className="text-muted-foreground">Manage your privacy and safety settings.</p>
            </div>

            {/* Profile Privacy Section */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-base font-semibold text-foreground mb-4">Profile Privacy</h2>

                    <div className="space-y-4">
                        {/* Profile Public */}
                        <div className="flex items-start justify-between py-2">
                            <div className="flex-1">
                                <div className="text-sm font-medium text-foreground mb-1">Public Profile</div>
                                <div className="text-xs text-muted-foreground">
                                    Make your profile visible to everyone
                                </div>
                            </div>
                            <Switch
                                checked={profilePublic}
                                onCheckedChange={setProfilePublic}
                            />
                        </div>

                        {/* Show Followers */}
                        <div className="flex items-start justify-between py-2">
                            <div className="flex-1">
                                <div className="text-sm font-medium text-foreground mb-1">Show Followers</div>
                                <div className="text-xs text-muted-foreground">
                                    Allow others to see who follows you
                                </div>
                            </div>
                            <Switch
                                checked={showFollowers}
                                onCheckedChange={setShowFollowers}
                            />
                        </div>

                        {/* Show Following */}
                        <div className="flex items-start justify-between py-2">
                            <div className="flex-1">
                                <div className="text-sm font-medium text-foreground mb-1">Show Following</div>
                                <div className="text-xs text-muted-foreground">
                                    Allow others to see who you follow
                                </div>
                            </div>
                            <Switch
                                checked={showFollowing}
                                onCheckedChange={setShowFollowing}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content & Interactions Section */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-base font-semibold text-foreground mb-4">Content & Interactions</h2>

                    <div className="space-y-4">
                        {/* Allow Messages */}
                        <div className="flex items-start justify-between py-2">
                            <div className="flex-1">
                                <div className="text-sm font-medium text-foreground mb-1">Allow Messages</div>
                                <div className="text-xs text-muted-foreground">
                                    Let others send you direct messages
                                </div>
                            </div>
                            <Switch
                                checked={allowMessages}
                                onCheckedChange={setAllowMessages}
                            />
                        </div>

                        {/* Allow Comments */}
                        <div className="flex items-start justify-between py-2">
                            <div className="flex-1">
                                <div className="text-sm font-medium text-foreground mb-1">Allow Comments</div>
                                <div className="text-xs text-muted-foreground">
                                    Let others comment on your stories
                                </div>
                            </div>
                            <Switch
                                checked={allowComments}
                                onCheckedChange={setAllowComments}
                            />
                        </div>

                        {/* Show Activity Status */}
                        <div className="flex items-start justify-between py-2">
                            <div className="flex-1">
                                <div className="text-sm font-medium text-foreground mb-1">Show Activity Status</div>
                                <div className="text-xs text-muted-foreground">
                                    Display your activity on your profile
                                </div>
                            </div>
                            <Switch
                                checked={showActivity}
                                onCheckedChange={setShowActivity}
                            />
                        </div>

                        {/* Show Reading History */}
                        <div className="flex items-start justify-between py-2">
                            <div className="flex-1">
                                <div className="text-sm font-medium text-foreground mb-1">Show Reading History</div>
                                <div className="text-xs text-muted-foreground">
                                    Display your reading progress on stories
                                </div>
                            </div>
                            <Switch
                                checked={showReadingHistory}
                                onCheckedChange={setShowReadingHistory}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Safety & Content Filtering Section */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-base font-semibold text-foreground mb-4">Safety & Content Filtering</h2>

                    <div className="space-y-4">
                        {/* Parental Controls */}
                        <div className="flex items-start justify-between py-2">
                            <div className="flex-1">
                                <div className="text-sm font-medium text-foreground mb-1">Parental Controls</div>
                                <div className="text-xs text-muted-foreground">
                                    Enable parental controls to restrict content
                                </div>
                            </div>
                            <Switch
                                checked={parentalControls}
                                onCheckedChange={setParentalControls}
                            />
                        </div>

                        {/* Hide Explicit Content */}
                        <div className="flex items-start justify-between py-2">
                            <div className="flex-1">
                                <div className="text-sm font-medium text-foreground mb-1">Hide Explicit Content</div>
                                <div className="text-xs text-muted-foreground">
                                    Filter out mature or explicit content
                                </div>
                            </div>
                            <Switch
                                checked={hideExplicitContent}
                                onCheckedChange={setHideExplicitContent}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Data & Privacy Info Card */}
            <Card>
                <CardContent className="p-6 bg-primary/5 border-primary/10">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <div className="text-base font-semibold text-foreground mb-1">
                                Your Data is Protected
                            </div>
                            <div className="text-sm text-muted-foreground">
                                We use industry-standard encryption to protect your personal information and maintain your privacy.
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
