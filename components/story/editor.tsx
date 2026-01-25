"use client";

import { useState } from "react";
import { Save, Share2, Users } from "lucide-react";

interface StoryEditorProps {
    storyId?: string;
    story?: {
        title: string;
        description: string;
        genre: string;
        coverImage?: string;
    };
    onSave?: () => void;
}

export function StoryEditor({ storyId, story, onSave }: StoryEditorProps) {
    const [activeTab, setActiveTab] = useState("details");
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: story?.title || "",
        description: story?.description || "",
        genre: story?.genre || "",
    });

    const tabs = [
        { id: "details", label: "Details" },
        { id: "panels", label: "Panels" },
        { id: "cast", label: "Cast" }
    ];

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        onSave?.();
    };

    const handleShare = () => {
        // Implement share functionality
        console.log("Share story");
    };

    const handleCollaborate = () => {
        // Implement collaborate functionality
        console.log("Collaborate on story");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Quick Actions Bar */}
            <div className="border-b border-border/50 bg-card">
                <div className="container max-w-5xl px-4 py-2 flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">Save</span>
                    </button>
                    
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 border border-border bg-background hover:bg-muted rounded-lg transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Share</span>
                    </button>
                    
                    <button
                        onClick={handleCollaborate}
                        className="flex items-center gap-2 px-4 py-2 border border-border bg-background hover:bg-muted rounded-lg transition-colors"
                    >
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">Collaborate</span>
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border/50 bg-card">
                <div className="container max-w-5xl px-4 overflow-x-auto">
                    <div className="flex items-center">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-6 py-3 text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <main className="flex-1 container max-w-5xl px-4 py-6">
                {activeTab === "details" && (
                    <DetailsTab formData={formData} onChange={setFormData} />
                )}
                
                {activeTab === "panels" && (
                    <PanelsTab />
                )}
                
                {activeTab === "cast" && (
                    <CastTab />
                )}
            </main>
        </div>
    );
}

function DetailsTab({ formData, onChange }: { formData: any; onChange: (data: any) => void }) {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Story Information</h2>
            
            {/* Title */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => onChange({ ...formData, title: e.target.value })}
                    placeholder="Enter story title"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => onChange({ ...formData, description: e.target.value })}
                    placeholder="Describe your story..."
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
            </div>

            {/* Genre */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Genre</label>
                <select
                    value={formData.genre}
                    onChange={(e) => onChange({ ...formData, genre: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">Select a genre</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Romance">Romance</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Horror">Horror</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Drama">Drama</option>
                </select>
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Cover Image</label>
                <div className="w-full h-[200px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/30">
                    <div className="text-muted-foreground mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-sm text-muted-foreground">Click to upload cover image</p>
                    <p className="text-xs text-muted-foreground">Recommended: 16:9 aspect ratio</p>
                </div>
            </div>

            {/* AI Enrichment Options */}
            <div className="p-4 bg-purple-50/10 border border-purple-500/20 rounded-lg">
                <h3 className="text-sm font-semibold text-purple-900 mb-3">AI Enrichment Options</h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                        <span className="text-sm text-foreground">Enrich description with AI</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                        <span className="text-sm text-foreground">Generate cover image with AI</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                        <span className="text-sm text-foreground">Generate background with AI</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                        <span className="text-sm text-foreground">Generate poster with AI</span>
                    </label>
                </div>
            </div>
        </div>
    );
}

function PanelsTab() {
    const [panels, setPanels] = useState<any[]>([]);

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Panels</h2>
                    <p className="text-sm text-muted-foreground">Manage story panels</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-medium">Add Panel</span>
                </button>
            </div>

            {/* Empty State */}
            {panels.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-lg">
                    <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1V4a1 1 0 011-1V3a1 1 0 00-1-1H3a1 1 0 00-1 1v1a1 1 0 00-1 1v1a1 1 0 011 1v1a1 1 0 011-1h16a1 1 0 001 1v-1a1 1 0 011-1V7a1 1 0 00-1-1V4a1 1 0 00-1-1H3z" />
                    </svg>
                    <p className="text-lg font-semibold text-foreground mb-2">No Panels Yet</p>
                    <p className="text-sm text-muted-foreground mb-4">Create your first panel to begin visualizing your story</p>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-sm font-medium">Create First Panel with AI</span>
                    </button>
                </div>
            )}

            {/* Panels List */}
            {panels.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {panels.map((panel, index) => (
                        <div key={index} className="border border-border rounded-lg overflow-hidden">
                            <div className="aspect-video bg-muted flex items-center justify-center">
                                <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="p-4">
                                <h4 className="text-sm font-medium text-foreground">Panel {index + 1}</h4>
                                <p className="text-xs text-muted-foreground">Order: {panel.order || index + 1}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function CastTab() {
    const [characters, setCharacters] = useState<any[]>([]);

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Cast</h2>
                    <p className="text-sm text-muted-foreground">Manage story characters</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-medium">Add Character</span>
                </button>
            </div>

            {/* Empty State */}
            {characters.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-lg">
                    <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-lg font-semibold text-foreground mb-2">No Characters Yet</p>
                    <p className="text-sm text-muted-foreground mb-4">Add characters to bring your story to life</p>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm font-medium">Add First Character</span>
                    </button>
                </div>
            )}

            {/* Characters List */}
            {characters.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((character, index) => (
                        <div key={index} className="border border-border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400/60 to-blue-400/60 flex items-center justify-center flex-shrink-0">
                                    {character.avatar ? (
                                        <img src={character.avatar} alt={character.name} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <span className="text-white font-bold">{character.name.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-foreground truncate">{character.name}</h4>
                                    <p className="text-xs text-muted-foreground">{character.description || "No description"}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
