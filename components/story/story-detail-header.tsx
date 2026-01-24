"use client";

import { Globe, Lock, ShieldCheck } from "lucide-react";
import { Story } from "@/lib/types";

interface StoryDetailHeaderProps {
    story: Story;
}

export function StoryDetailHeader({ story }: StoryDetailHeaderProps) {
    const isPublished = story.status === 1;
    
    return (
        <div className="relative">
            {/* Immersive Header with Blurred Background */}
            <div className="relative h-[240px] md:h-[320px] overflow-hidden">
                {story.coverImage ? (
                    <>
                        {/* Blurred Background */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center blur-[20px]"
                            style={{ backgroundImage: `url(${story.coverImage})` }}
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-blue-600/80" />
                )}
            </div>

            {/* Overlapping Cover Avatar and Actions */}
            <div className="relative px-4 md:px-6">
                <div className="flex items-end gap-4 -mt-12 md:-mt-16">
                    {/* Circular Cover Avatar */}
                    <div className="relative">
                        <div className="w-[88px] h-[88px] rounded-full bg-background border-4 border-background shadow-lg overflow-hidden">
                            {story.coverImage ? (
                                <img
                                    src={story.coverImage}
                                    alt={story.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
                                    <span className="text-white text-3xl font-bold">
                                        {story.title.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-1 flex justify-end gap-2 pb-2">
                        {/* Like Button */}
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-muted transition-colors">
                            <Globe className="w-3 h-3" />
                            <span className="text-sm font-medium">{story.likes || 0}</span>
                        </button>
                        
                        {/* Share Button */}
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-muted transition-colors">
                            <Globe className="w-3 h-3" />
                            <span className="text-sm font-medium">Share</span>
                        </button>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                        isPublished ? 'bg-muted text-foreground' : 'bg-muted text-foreground'
                    }`}>
                        {isPublished ? (
                            <>
                                <Globe className="w-2.5 h-2.5" />
                                <span>Published</span>
                            </>
                        ) : (
                            <>
                                <Lock className="w-2.5 h-2.5" />
                                <span>Draft</span>
                            </>
                        )}
                    </div>

                    {/* Collaboration Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                        story.groupId ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                    }`}>
                        {story.groupId ? (
                            <>
                                <Globe className="w-2.5 h-2.5" />
                                <span>Open to All</span>
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-2.5 h-2.5" />
                                <span>Private</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold mt-3 mb-2">{story.title}</h1>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span className="font-semibold">{story.storyboardCount || 0}</span>
                        <span>storyboards</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span className="font-semibold">{story.characterCount || 0}</span>
                        <span>characters</span>
                    </div>
                    {story.viewCount && (
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span className="font-semibold">{story.viewCount}</span>
                            <span>views</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                {story.description && (
                    <p className="text-base text-muted-foreground mt-3 line-clamp-4">
                        {story.description}
                    </p>
                )}

                {/* Author Info */}
                {story.author && (
                    <div className="flex items-center gap-2 mt-3">
                        <div className="w-5 h-5 rounded-full bg-secondary overflow-hidden">
                            {story.author.avatar ? (
                                <img src={story.author.avatar} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                                    {story.author.username?.[0] || "U"}
                                </div>
                            )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                            Created by {story.author.displayName || story.author.username}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
