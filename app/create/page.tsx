"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Share2, Users, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { stories } from "@/lib/api/stories";
import { showSuccess, showError } from "@/lib/toast-utils";
import { StyleConfig, CreateStoryRequest } from "@/lib/types";

interface CreateStoryProps {
    storyId?: string;
}

export default function CreateStory({ storyId }: CreateStoryProps) {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("Fantasy");
    const [defaultSceneCount, setDefaultSceneCount] = useState(3);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // AI Enrichment states
    const [useAIEnrich, setUseAIEnrich] = useState(false);
    const [generateCover, setGenerateCover] = useState(false);
    const [generatePoster, setGeneratePoster] = useState(false);
    const [generateBackground, setGenerateBackground] = useState(false);
    const [selectedAIStyle, setSelectedAIStyle] = useState<StyleConfig | null>(null);
    const [isAIProcessing, setIsAIProcessing] = useState(false);
    const [aiEnrichedDescription, setAiEnrichedDescription] = useState("");
    const [aiGeneratedCoverURL, setAiGeneratedCoverURL] = useState("");
    const [aiGeneratedPosterURL, setAiGeneratedPosterURL] = useState("");
    const [aiGeneratedBackgroundURL, setAiGeneratedBackgroundURL] = useState("");
    const [tokensUsed, setTokensUsed] = useState(0);

    // Style Selection States
    const [styles, setStyles] = useState<StyleConfig[]>([]);
    const [isLoadingStyles, setIsLoadingStyles] = useState(false);
    const [styleSearchQuery, setStyleSearchQuery] = useState("");
    const [stylesPage, setStylesPage] = useState(0);
    const [stylesTotal, setStylesTotal] = useState(0);

    useEffect(() => {
        loadStyles();
    }, []);

    const loadStyles = async (page = 0, query = "") => {
        setIsLoadingStyles(true);
        try {
            const result = query
                ? await stories.searchStyles(query, 20, page * 20)
                : await stories.getStyles(20, page * 20);

            setStyles(result.styles);
            setStylesTotal(result.total);
            setStylesPage(page);

            // Select first style by default if none selected and styles available
            if (!selectedAIStyle && result.styles.length > 0 && page === 0) {
                setSelectedAIStyle(result.styles[0]);
            }
        } catch (error) {
            console.error("Failed to load styles:", error);
        } finally {
            setIsLoadingStyles(false);
        }
    };

    const handleStyleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setStyleSearchQuery(query);
        // Debounce would be better here, but for now direct call with small delay or just wait for enter? 
        // Let's just debounce manually or relying on user stopping typing if we had a hook.
        // For simplicity, we'll search on enter or immediate (api might handle it).
        // Let's implement a simple timeout based debounce effectively inside the component if needed, 
        // or just call loadStyles(0, query) after a timeout.
        const timeoutId = setTimeout(() => loadStyles(0, query), 500);
        return () => clearTimeout(timeoutId);
    };

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

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingCover(true);
        try {
            // Upload to server
            const result = await stories.uploadCover(file);
            setCoverImage(result.url);
            // Clear AI generated cover if manual upload
            setAiGeneratedCoverURL("");
        } catch (error) {
            console.error("Failed to upload cover:", error);
            showError("上传失败", "封面图片上传失败，请重试");
        } finally {
            setIsUploadingCover(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleCreate = async () => {
        if (!title.trim()) {
            showError("请输入标题", "故事标题不能为空");
            return;
        }

        setIsAIProcessing(true);
        try {
            const request: CreateStoryRequest = {
                title,
                description,
                coverImage: coverImage || aiGeneratedCoverURL || undefined,
                genre: selectedGenre,
                defaultSceneCount,
                useAIEnrich,
                generateCover,
                generatePoster,
                generateBackground,
                aiStyle: selectedAIStyle || undefined,
                style: selectedAIStyle?.style // Passing style name as string as well if needed
            };

            const createdStory = await stories.create(request);

            // If AI processing happened, we might get enriched content back immediately 
            // or we might need to poll. The backend implementation detail isn't fully visible,
            // but the Swift code sets `createdStory` and then maybe refreshes?
            // For now, assume success and redirect.

            showSuccess("创建成功", "故事创建成功！");
            router.push(`/stories/${createdStory.id}`); // Redirect to new story

        } catch (error) {
            console.error("Failed to create story:", error);
            showError("创建失败", "故事创建失败，请重试");
        } finally {
            setIsAIProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">New Story</h2>
                <p className="text-muted-foreground">Create a new story with AI assistance.</p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border/50">
                <div className="flex items-center justify-center max-w-md mx-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id)}
                            className={`relative px-6 py-3 text-sm font-medium transition-colors ${selectedTab === tab.id ? "text-foreground" : "text-muted-foreground"
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
            <div className="max-w-2xl mx-auto space-y-6">
                {selectedTab === 0 && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-foreground">Story Information</h3>

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
                                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${defaultSceneCount === count
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
                            <div className="w-full h-[200px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/30 overflow-hidden relative">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleCoverUpload}
                                />

                                {coverImage || aiGeneratedCoverURL ? (
                                    <>
                                        <img
                                            src={coverImage || aiGeneratedCoverURL}
                                            alt="Cover"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={triggerFileInput}
                                                className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium"
                                            >
                                                Change Cover
                                            </button>
                                        </div>
                                        {(aiGeneratedCoverURL && !coverImage) && (
                                            <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500 text-white text-xs rounded shadow-sm flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                AI Generated
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-12 h-12 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-8a3 3 0 006 1.061l-.431.431.061-3.061L6 6a2 2 0 002.828 2.828-2.828A3 3 0 006 1.061l-.431.431.061-3.061L16 16z" />
                                        </svg>
                                        <p className="text-sm text-muted-foreground mb-2">Click to upload cover image</p>
                                        <button
                                            onClick={triggerFileInput}
                                            disabled={isUploadingCover}
                                            className="px-4 py-2 bg-card text-foreground rounded-lg border border-border hover:bg-muted disabled:opacity-50"
                                        >
                                            {isUploadingCover ? "Uploading..." : "Upload Cover"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* AI Enrichment Section */}
                        <div className="p-4 bg-purple-50/10 border border-purple-500/20 rounded-xl">
                            <h4 className="text-base font-semibold text-purple-900 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M17 20h5v-2a3 3 0 006 1.061l-.431.431.061-3.061L16 16z" />
                                </svg>
                                AI Smart Creation
                            </h4>
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
                                        disabled={description.length === 0}
                                        className={`w-11 h-6 rounded-full transition-colors ${useAIEnrich
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
                                        className={`w-11 h-6 rounded-full transition-colors ${generateCover
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
                                        className={`w-11 h-6 rounded-full transition-colors ${generateBackground
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
                                        className={`w-11 h-6 rounded-full transition-colors ${generatePoster
                                            ? "bg-purple-500 text-white"
                                            : "bg-muted"
                                            }`}
                                    >
                                    </button>
                                </div>
                            </div>

                            {/* Style Selection */}
                            {(generateCover || generatePoster || generateBackground) && (
                                <div className="space-y-3 pt-3 border-t border-purple-200/50">
                                    <h5 className="text-sm font-medium text-purple-900">Art Style</h5>

                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Search styles..."
                                            value={styleSearchQuery}
                                            onChange={handleStyleSearch}
                                            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>

                                    {/* Styles Grid */}
                                    {isLoadingStyles ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500" />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                                            {styles.map((style) => (
                                                <div
                                                    key={style.id}
                                                    onClick={() => setSelectedAIStyle(style)}
                                                    className={`
                                                        cursor-pointer rounded-lg border overflow-hidden transition-all
                                                        ${selectedAIStyle?.id === style.id
                                                            ? 'border-purple-500 ring-2 ring-purple-500/20'
                                                            : 'border-border hover:border-purple-300'}
                                                    `}
                                                >
                                                    <div className="aspect-video bg-muted relative">
                                                        {style.preview_image ? (
                                                            <img
                                                                src={style.preview_image}
                                                                alt={style.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                                                No Preview
                                                            </div>
                                                        )}
                                                        {selectedAIStyle?.id === style.id && (
                                                            <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                                                                <div className="bg-white rounded-full p-1">
                                                                    <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-2 bg-card">
                                                        <div className="text-xs font-medium truncate">{style.name}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Showing {styles.length} of {stylesTotal}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => loadStyles(stylesPage - 1, styleSearchQuery)}
                                                disabled={stylesPage === 0}
                                                className="p-1 hover:bg-muted rounded disabled:opacity-30"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => loadStyles(stylesPage + 1, styleSearchQuery)}
                                                disabled={(stylesPage + 1) * 20 >= stylesTotal}
                                                className="p-1 hover:bg-muted rounded disabled:opacity-30"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                            {aiEnrichedDescription.length > 0 && (
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
                        <h3 className="text-xl font-semibold text-foreground">Panels</h3>

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
                        <h3 className="text-xl font-semibold text-foreground">Cast</h3>

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
                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t">
                    <button
                        onClick={() => router.back()}
                        className="flex-1 py-3 border border-border bg-card hover:bg-muted text-foreground font-medium rounded-lg disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={title.trim().length === 0 || isAIProcessing}
                        className={`flex-1 py-3 font-semibold rounded-lg transition-colors ${isAIProcessing ? "bg-gray-400" : "bg-black hover:bg-gray-800 text-white"
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
        </div>
    );
}
