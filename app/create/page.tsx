"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Share2, Users } from "lucide-react";

interface CreateStoryProps {
    storyId?: string;
    groupId?: string;
}

export default function CreateStory({ storyId, groupId }: CreateStoryProps) {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("Fantasy");
    const [defaultSceneCount, setDefaultSceneCount] = useState(3);
    
    // AI Enrichment states
    const [useAIEnrich, setUseAIEnrich] = useState(false);
    const [generateCover, setGenerateCover] = useState(false);
    const [generatePoster, setGeneratePoster] = useState(false);
    const [generateBackground, setGenerateBackground] = useState(false);
    const [selectedAIStyle, setSelectedAIStyle] = useState<any>(null);
    const [isAIProcessing, setIsAIProcessing] = useState(false);
    const [aiEnrichedDescription, setAiEnrichedDescription] = useState("");
    const [aiGeneratedCoverURL, setAiGeneratedCoverURL] = useState("");
    const [aiGeneratedPosterURL, setAiGeneratedPosterURL] = useState("");
    const [aiGeneratedBackgroundURL, setAiGeneratedBackgroundURL] = useState("");
    const [tokensUsed, setTokensUsed] = useState(0);

    const genres = [
        "Fantasy",
        "Science Fiction",
        "Romance",
        "Mystery",
        "Thriller",
        "Horror",
        "Adventure",
        "Historical",
        "Contemporary"
    ];

    const tabs = [
        { id: 0, label: "Details" },
        { id: 1, label: "Panels" },
        { id: 2, label: "Cast" }
    ];

    const handleCreate = async () => {
        if (!title.trim()) {
            alert("Please enter a title");
            return;
        }
        
        if (useAIEnrich || generateCover || generatePoster || generateBackground) {
            setIsAIProcessing(true);
            // Simulate AI creation
            await new Promise(resolve => setTimeout(resolve, 2000));
            setAiEnrichedDescription(aiEnrichedDescription || description || "This is an AI-enriched description of your story...");
            if (generateCover) setAiGeneratedCoverURL("https://images.unsplash.com/photo-154471-9520?w=400");
            if (generatePoster) setAiGeneratedPosterURL("https://images.unsplash.com/photo-154471-9520?w=400");
            if (generateBackground) setAiGeneratedBackgroundURL("https://images.unsplash.com/photo-154471-9520?w=400");
            setTokensUsed(tokensUsed + 1250);
            setIsAIProcessing(false);
            alert("Story created successfully!");
        } else {
            alert("Story created successfully!");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Custom Top Bar */}
            <div className="h-14 border-b flex items-center justify-between px-4 bg-card">
                <button 
                    onClick={() => router.back()}
                    className="text-foreground hover:text-foreground/70 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="font-semibold">New Story</div>
                <div className="w-10"></div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border/50 bg-card">
                <div className="flex items-center justify-center max-w-md mx-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id)}
                            className={`relative px-6 py-3 text-sm font-medium transition-colors ${
                                selectedTab === tab.id ? "text-foreground" : "text-muted-foreground"
                            }`}
                        >
                            {tab.label}
                            {selectedTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 max-w-2xl mx-auto p-4 overflow-y-auto">
                {selectedTab === 0 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-foreground">Story Information</h2>
                        
                        {/* Title Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter story title"
                                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your story..."
                                rows={4}
                                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                        </div>

                        {/* Genre Picker */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Genre</label>
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select a genre</option>
                                {genres.map((genre) => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Default Scene Count Picker */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Default Scene Count</label>
                            <div className="flex items-center gap-2">
                                {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                                    <button
                                        key={count}
                                        onClick={() => setDefaultSceneCount(count)}
                                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
                                            defaultSceneCount === count 
                                                ? "bg-primary text-white" 
                                                : "bg-background hover:bg-muted"
                                        }`}
                                    >
                                        <span className="text-sm font-semibold">{count}</span>
                                    </button>
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground ml-2">scenes (2-8)</span>
                        </div>

                        {/* Cover Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Cover Image</label>
                            <div className="w-full h-[200px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/30">
                                <svg className="w-12 h-12 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-8a3 3 0 006 1.061l-.431.431.061-3.061L6 6a2 2 0 002.828 2.828-2.828A3 3 0 006 1.061l-.431.431.061-3.061L16 16z" />
                                </svg>
                                <p className="text-sm text-muted-foreground mb-2">Click to upload cover image</p>
                                <button className="px-4 py-2 bg-card text-foreground rounded-lg border border-border hover:bg-muted">
                                    Upload Cover
                                </button>
                            </div>
                        </div>

                        {/* AI Enrichment Section */}
                        <div className="p-4 bg-purple-50/10 border border-purple-500/20 rounded-xl">
                            <h3 className="text-base font-semibold text-purple-900 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M17 20h5v-2a3 3 0 006 1.061l-.431.431.061-3.061L16 16z" />
                                </svg>
                                AI Smart Creation
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">AI can help enhance your story with descriptions and images</p>
                            
                            {/* AI Options */}
                            <div className="space-y-3">
                                {/* Enrich Description Toggle */}
                                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 3v1m6.364 1.636l-.707.707M17 20h5v-2a3 3 0 006 1.061l-.431.431.061-3.061L16 16z" />
                                        </svg>
                                        <span className="text-sm font-medium">Enrich story description</span>
                                        <span className="text-xs text-muted-foreground ml-2">Make your story more engaging</span>
                                    </div>
                                    <button
                                        onClick={() => setUseAIEnrich(!useAIEnrich)}
                                        disabled={description.isEmpty}
                                        className={`w-11 h-6 rounded-full transition-colors ${
                                            useAIEnrich 
                                                ? "bg-purple-500 text-white" 
                                                : "bg-muted"
                                        }`}
                                    >
                                    </button>
                                </div>

                                {/* Generate Cover Toggle */}
                                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-8a3 3 0 006 1.061l-.431.431.061-3.061L16 16z" />
                                        </svg>
                                        <span className="text-sm font-medium">Generate cover image</span>
                                        <span className="text-xs text-muted-foreground ml-2">Create stunning story cover</span>
                                    </div>
                                    <button
                                        onClick={() => setGenerateCover(!generateCover)}
                                        className={`w-11 h-6 rounded-full transition-colors ${
                                            generateCover 
                                                ? "bg-purple-500 text-white" 
                                                : "bg-muted"
                                        }`}
                                    >
                                    </button>
                                </div>

                                {/* Generate Background Toggle */}
                                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-8a3 3 0 006 1.061l-.431.431.061-3.061L16 16z" />
                                        </svg>
                                        <span className="text-sm font-medium">Generate background image</span>
                                        <span className="text-xs text-muted-foreground ml-2">Create immersive background</span>
                                    </div>
                                    <button
                                        onClick={() => setGenerateBackground(!generateBackground)}
                                        className={`w-11 h-6 rounded-full transition-colors ${
                                            generateBackground 
                                                ? "bg-purple-500 text-white" 
                                                : "bg-muted"
                                        }`}
                                    >
                                    </button>
                                </div>

                                {/* Generate Poster Toggle */}
                                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 010 10 10-10 10-10V7a2 2 0 010-10-10-10-10l-1.293-1.293a2 2 0 015-15 15-15 15-15v-6z" />
                                        </svg>
                                        <span className="text-sm font-medium">Generate poster image</span>
                                        <span className="text-xs text-muted-foreground ml-2">Create promotional poster</span>
                                    </div>
                                    <button
                                        onClick={() => setGeneratePoster(!generatePoster)}
                                        className={`w-11 h-6 rounded-full transition-colors ${
                                            generatePoster 
                                                ? "bg-purple-500 text-white" 
                                                : "bg-muted"
                                        }`}
                                    >
                                    </button>
                                </div>
                            </div>

                            {/* Token Usage Info */}
                            {(useAIEnrich || generateCover || generatePoster || generateBackground) && (
                                <div className="flex items-center gap-2 p-3 bg-orange-50/10 rounded-lg">
                                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m0-6l-6-6h24l-6 6h24l-6 6V8z" />
                                    </svg>
                                    <span className="text-xs font-medium">This action will consume tokens</span>
                                    <span className="text-sm font-semibold text-orange-600">~1,250 tokens</span>
                                </div>
                            )}

                            {/* AI Enriched Content Preview */}
                            {!aiEnrichedDescription.isEmpty && (
                                <div className="p-4 bg-green-50/10 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2-2a2 2 0 010 10l2 2-2a2 2 010-10-10l-2 2-6a2 2 0 010-10-10-2-2-10V12l2 2-6a2 2 0 010-10l-2-2-10-10l-2-2z" />
                                        </svg>
                                        <span className="text-sm font-semibold text-green-700">AI Enriched Description</span>
                                    </div>
                                    <p className="text-sm text-foreground leading-relaxed line-clamp-4">
                                        {aiEnrichedDescription}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {selectedTab === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Panels</h2>
                        
                        {/* Header with Add Button */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                0 panels
                            </p>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0-6-6h24l-6 6h24l-6 6V4z" />
                                </svg>
                                <span className="text-sm font-medium">Add Panel</span>
                            </button>
                        </div>

                        {/* Empty State */}
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-lg">
                            <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1 1 1.061 3 0 001 1.061l-3 3a1 1 0 015-15 15-15 15v-6l-6-6-6h24l-6-6 6h24l-6-6V5a1 1 0 01-1-1 061-3 0-001-1-1-061-3z" />
                            </svg>
                            <p className="text-lg font-semibold text-foreground mb-2">No Panels Yet</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Create your first panel to begin visualizing your story
                            </p>
                            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M17 20h5v-2a3 3 0 006 1.061l-.431.431.061-3.061L16 16z" />
                                </svg>
                                <span className="text-sm font-medium">Create First Panel with AI</span>
                            </button>
                        </div>
                    </div>
                )}

                {selectedTab === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Cast</h2>
                        
                        {/* Header with Add Button */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                0 characters
                            </p>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0-6-6h24l-6 6h24l-6 6V4z" />
                                </svg>
                                <span className="text-sm font-medium">Add Character</span>
                            </button>
                        </div>

                        {/* Empty State */}
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-lg">
                            <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 006 1.061l-.431.431.061-3.061L16 16m-6.064 0a3 3 0 010-10l-6-6 6h24l-6-6 6h24l-6-6V5a1 1 0 01-1-1.061-3 0-001-1-1-061-3z" />
                            </svg>
                            <p className="text-lg font-semibold text-foreground mb-2">No Characters Yet</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Add characters to bring your story to life
                            </p>
                            <button className="flex items-center gap-2 px-4 py-2 bg-card text-foreground border border-border rounded-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0-6-6h24l-6 6h24l-6 6V4z" />
                                </svg>
                                <span className="text-sm font-medium">Add First Character</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Action Buttons */}
            <div className="flex gap-3 p-4 bg-card border-t border-border">
                <button
                    onClick={() => {
                        if (useAIEnrich || generateCover || generatePoster || generateBackground) {
                            alert("Confirm AI creation - this will consume tokens");
                        }
                        handleCreate();
                    }}
                    className="flex-1 py-3 border border-border bg-card hover:bg-muted text-foreground font-medium rounded-lg disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleCreate}
                    disabled={title.trim().length === 0 || isAIProcessing}
                    className={`flex-1 py-3 font-semibold rounded-lg transition-colors ${
                        isAIProcessing ? "bg-gray-400" : "bg-black hover:bg-gray-800 text-white"
                    }`}
                >
                    {isAIProcessing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin mr-2" />
                            Creating...
                        </>
                    ) : useAIEnrich || generateCover || generatePoster || generateBackground ? (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M17 20h5v-2a3 3 0 006 1.061l-.431.431.061-3.061L16 16z" />
                            </svg>
                            AI Create
                        </>
                    ) : (
                        <>
                            Create Story
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
