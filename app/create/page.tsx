"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Share2, Users, Search, ChevronLeft, ChevronRight, Eye, MessageSquare, Sparkles, Save, AlertTriangle, Trash2, Plus, X } from "lucide-react";
import { stories } from "@/lib/api/stories";
import { characters } from "@/lib/api/characters";
import { showSuccess, showError } from "@/lib/toast-utils";
import { StyleConfig, CreateStoryRequest, FragmentStoryCreationPrefill, GENRES, FragmentVisibility } from "@/lib/types";
import type { Character } from "@/lib/types/character";

interface CreateStoryProps {
    storyId?: string;
}

export default function CreateStoryPage({ storyId }: CreateStoryProps) {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20">Loading...</div>}>
            <CreateStory storyId={storyId} />
        </Suspense>
    );
}

function CreateStory({ storyId }: CreateStoryProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedTab, setSelectedTab] = useState(0);
    const [title, setTitle] = useState("");
    const [titleMaxLength, setTitleMaxLength] = useState(200);
    const [description, setDescription] = useState("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [defaultSceneCount, setDefaultSceneCount] = useState(3);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fragment prefill state
    const [fragmentPrefill, setFragmentPrefill] = useState<FragmentStoryCreationPrefill | null>(null);
    const [sourceFragmentId, setSourceFragmentId] = useState<string | null>(null);

    // Publish settings
    const [visibility, setVisibility] = useState<string>("public");
    const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);
    const [allowComments, setAllowComments] = useState(true);
    const [showAILabel, setShowAILabel] = useState(false);

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

    // Cover ratio
    const [coverRatio, setCoverRatio] = useState<"3:4" | "16:9" | "1:1">("3:4");

    // Cast management
    const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
    const [characterSearch, setCharacterSearch] = useState("");
    const [searchResults, setSearchResults] = useState<Character[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        loadStyles();
        // Load fragment prefill from URL params
        const prefillParam = searchParams.get("fragmentPrefill");
        if (prefillParam) {
            try {
                const prefill: FragmentStoryCreationPrefill = JSON.parse(decodeURIComponent(prefillParam));
                setFragmentPrefill(prefill);
                setSourceFragmentId(prefill.fragmentId);
                setTitle(prefill.title);
                setDescription(prefill.description || "");
                if (prefill.genre) setSelectedGenres([prefill.genre]);
                if (prefill.defaultSceneCount) setDefaultSceneCount(prefill.defaultSceneCount);
                if (prefill.limitTitleToSevenCharacters) setTitleMaxLength(7);
                if (prefill.suggestedTags && prefill.suggestedTags.length > 0) {
                    // Tags will be applied to the request
                }
            } catch (e) {
                console.error("Failed to parse fragment prefill:", e);
            }
        }
    }, [searchParams]);

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

    const styleSearchTimer = useRef<NodeJS.Timeout | null>(null);

    const handleStyleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setStyleSearchQuery(query);
        if (styleSearchTimer.current) clearTimeout(styleSearchTimer.current);
        styleSearchTimer.current = setTimeout(() => loadStyles(0, query), 500);
    };

    const genreOptions = GENRES;



    const tabs = [
        { id: 0, label: "Details" },
        { id: 1, label: "Panels" },
        { id: 2, label: "Cast" },
        { id: 3, label: "Settings" }
    ];

    const toggleGenre = (key: string) => {
        setSelectedGenres(prev => {
            if (prev.includes(key)) return prev.filter(g => g !== key);
            if (prev.length >= 3) return prev;
            return [...prev, key];
        });
    };

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
        return handleCreateWithStatus("published");
    };

    const handleCreateWithStatus = async (status: "draft" | "published") => {
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
                genre: selectedGenres.length > 0 ? selectedGenres[0] : undefined,
                defaultSceneCount,
                status,
                useAIEnrich: status === "published" ? useAIEnrich : false,
                generateCover: status === "published" ? generateCover : false,
                generatePoster: status === "published" ? generatePoster : false,
                generateBackground: status === "published" ? generateBackground : false,
                aiStyle: selectedAIStyle || undefined,
                style: selectedAIStyle?.style,
                isCollaborationOpen,
                sourceFragmentId: sourceFragmentId || undefined,
                tags: fragmentPrefill?.suggestedTags,
            };

            const createdStory = await stories.create(request);

            showSuccess(status === "draft" ? "草稿已保存" : "创建成功", status === "draft" ? "故事已保存为草稿" : "故事创建成功！");
            router.push(`/stories/${createdStory.id}`);

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

                        {/* Fragment Source Indicator */}
                        {fragmentPrefill && (
                            <div className="flex items-center gap-2 p-3 bg-purple-50/10 border border-purple-500/20 rounded-lg">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                <span className="text-sm text-purple-700">
                                    Created from Fragment &ldquo;{fragmentPrefill.title}&rdquo;
                                </span>
                            </div>
                        )}

                        {/* Title Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-foreground">Title</label>
                                <span className={`text-xs ${title.length > titleMaxLength * 0.9 ? "text-red-500" : "text-muted-foreground"}`}>
                                    {title.length}/{titleMaxLength}
                                </span>
                            </div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value.slice(0, titleMaxLength))}
                                placeholder={fragmentPrefill ? "AI suggested title" : "Enter story title"}
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

                        {/* Genre Chips */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-foreground">Genre</label>
                                <span className="text-xs text-muted-foreground">{selectedGenres.length}/3</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {genreOptions.map((genre) => (
                                    <button
                                        key={genre.key}
                                        onClick={() => toggleGenre(genre.key)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                                            selectedGenres.includes(genre.key)
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-background text-foreground border-border hover:border-primary/40"
                                        }`}
                                    >
                                        {genre.label.en}
                                    </button>
                                ))}
                            </div>
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
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-foreground">Cover Image</label>
                                <div className="flex items-center gap-1">
                                    {(["3:4", "1:1", "16:9"] as const).map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setCoverRatio(r)}
                                            className={`px-2 py-1 text-xs rounded transition-colors ${
                                                coverRatio === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className={`w-full border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/30 overflow-hidden relative ${
                                coverRatio === "3:4" ? "h-[260px]" : coverRatio === "16:9" ? "h-[180px]" : "h-[220px]"
                            }`}>
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

                        {/* Selected Characters */}
                        {selectedCharacters.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">{selectedCharacters.length} character{selectedCharacters.length > 1 ? "s" : ""}</p>
                                <div className="space-y-2">
                                    {selectedCharacters.map((char) => (
                                        <div key={char.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                                            {char.avatar ? (
                                                <img src={char.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                                                    {char.name[0]}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{char.name}</p>
                                                {char.description && (
                                                    <p className="text-xs text-muted-foreground truncate">{char.description}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setSelectedCharacters(prev => prev.filter(c => c.id !== char.id))}
                                                className="p-1 hover:bg-muted rounded"
                                            >
                                                <X className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search Characters */}
                        <div className="space-y-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={characterSearch}
                                    onChange={async (e) => {
                                        setCharacterSearch(e.target.value);
                                        if (e.target.value.trim().length >= 2) {
                                            setIsSearching(true);
                                            try {
                                                const res = await characters.list({ search: e.target.value, limit: 10 });
                                                setSearchResults(res.characters.filter(c => !selectedCharacters.find(sc => sc.id === c.id)));
                                            } catch { setSearchResults([]); }
                                            finally { setIsSearching(false); }
                                        } else {
                                            setSearchResults([]);
                                        }
                                    }}
                                    placeholder="Search characters..."
                                    className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                            </div>

                            {isSearching && (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                                </div>
                            )}

                            {searchResults.length > 0 && (
                                <div className="border border-border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                                    {searchResults.map((char) => (
                                        <button
                                            key={char.id}
                                            onClick={() => {
                                                setSelectedCharacters(prev => [...prev, char]);
                                                setSearchResults(prev => prev.filter(c => c.id !== char.id));
                                                setCharacterSearch("");
                                            }}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left border-b border-border last:border-b-0"
                                        >
                                            {char.avatar ? (
                                                <img src={char.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                    {char.name[0]}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{char.name}</p>
                                            </div>
                                            <Plus className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {characterSearch.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No characters found</p>
                            )}
                        </div>

                        {/* Empty State */}
                        {selectedCharacters.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg">
                                <Users className="w-12 h-12 text-muted-foreground mb-3" />
                                <p className="text-sm text-muted-foreground">
                                    Search and add characters to bring your story to life
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {selectedTab === 3 && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-foreground">Publish Settings</h3>

                        {/* Visibility */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-muted-foreground" />
                                <label className="text-sm font-medium">Visibility</label>
                            </div>
                            <div className="flex gap-2">
                                {(["public", "followers", "private"] as const).map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setVisibility(v)}
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
                                            visibility === v
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-background text-foreground border-border hover:border-primary/40"
                                        }`}
                                    >
                                        {v.charAt(0).toUpperCase() + v.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Collaboration */}
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                            <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Allow Collaboration</p>
                                    <p className="text-xs text-muted-foreground">Let others contribute to your story</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCollaborationOpen(!isCollaborationOpen)}
                                className={`relative w-11 h-6 rounded-full transition-colors ${isCollaborationOpen ? "bg-primary" : "bg-gray-300"}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isCollaborationOpen ? "translate-x-5" : "translate-x-1"}`} />
                            </button>
                        </div>

                        {/* Comments */}
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Allow Comments</p>
                                    <p className="text-xs text-muted-foreground">Enable comments on your story</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAllowComments(!allowComments)}
                                className={`relative w-11 h-6 rounded-full transition-colors ${allowComments ? "bg-primary" : "bg-gray-300"}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${allowComments ? "translate-x-5" : "translate-x-1"}`} />
                            </button>
                        </div>

                        {/* AI Label */}
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                <div>
                                    <p className="text-sm font-medium">AI Content Label</p>
                                    <p className="text-xs text-muted-foreground">Show AI-generated content label</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAILabel(!showAILabel)}
                                className={`relative w-11 h-6 rounded-full transition-colors ${showAILabel ? "bg-purple-500" : "bg-gray-300"}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${showAILabel ? "translate-x-5" : "translate-x-1"}`} />
                            </button>
                        </div>

                        {/* Danger Zone */}
                        <div className="pt-4 border-t border-border">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-4 h-4 text-destructive" />
                                <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
                            </div>
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-destructive/50 transition-colors text-left group">
                                    <div>
                                        <p className="text-sm font-medium">Archive Story</p>
                                        <p className="text-xs text-muted-foreground">Hide this story from public view</p>
                                    </div>
                                    <AlertTriangle className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-destructive/30 hover:border-destructive transition-colors text-left group">
                                    <div>
                                        <p className="text-sm font-medium text-destructive">Delete Story</p>
                                        <p className="text-xs text-muted-foreground">Permanently remove this story</p>
                                    </div>
                                    <Trash2 className="w-4 h-4 text-destructive/50 group-hover:text-destructive" />
                                </button>
                            </div>
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
                        onClick={() => handleCreateWithStatus("draft")}
                        disabled={title.trim().length === 0}
                        className="flex-1 py-3 border border-border bg-card hover:bg-muted text-foreground font-medium rounded-lg flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleCreateWithStatus("published")}
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
                                Publish
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
