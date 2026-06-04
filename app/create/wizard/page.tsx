"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StepIndicator, WizardStep } from "@/components/create/wizard/step-indicator";
import { SetupStep } from "@/components/create/wizard/setup-step";
import { GeneratingStep } from "@/components/create/wizard/generating-step";
import { ImagesStep } from "@/components/create/wizard/images-step";
import { PublishStep } from "@/components/create/wizard/publish-step";
import { useGenerationPolling } from "@/hooks/use-generation-polling";
import { creation } from "@/lib/api/creation";
import { storyboards } from "@/lib/api/storyboards";
import type { Storyboard, StoryboardScene, Character } from "@/lib/types";

function WizardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const storyId = searchParams.get("storyId") || "";
    const parentStoryboardId = searchParams.get("parentStoryboardId") || "";
    const existingStoryboardId = searchParams.get("existingStoryboardId") || "";

    const [step, setStep] = useState<WizardStep>("setup");
    const [storyboardId, setStoryboardId] = useState<string>(existingStoryboardId);
    const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
    const [scenes, setScenes] = useState<StoryboardScene[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    // Setup form state — lifted into parent so handleSetupComplete receives actual user input
    const [rawInput, setRawInput] = useState("");
    const [style, setStyle] = useState("");
    const [sceneCount, setSceneCount] = useState(3);

    const setupData = {
        storyId,
        rawInput,
        style,
        sceneCount,
        characters,
    };

    const handleSetupChange = (updated: typeof setupData) => {
        if (updated.rawInput !== rawInput) setRawInput(updated.rawInput);
        if (updated.style !== style) setStyle(updated.style);
        if (updated.sceneCount !== sceneCount) setSceneCount(updated.sceneCount);
    };

    // Poll generation progress
    const { progress, isGenerating, retryFailedImages, cancelGeneration, refetch } =
        useGenerationPolling({
            storyboardId: step === "generating" ? storyboardId : null,
            enabled: step === "generating",
        });

    // Load existing storyboard if provided
    useEffect(() => {
        if (existingStoryboardId) {
            loadStoryboard(existingStoryboardId);
        }
    }, [existingStoryboardId]);

    const loadStoryboard = async (id: string) => {
        try {
            const data = await storyboards.get(id);
            setStoryboard(data);
            setScenes(data.storyboardScenes || []);
            setStoryboardId(id);
        } catch (err) {
            console.error("Failed to load storyboard:", err);
        }
    };

    // Step 1: Setup → Create storyboard and trigger generation
    const handleSetupComplete = async (data: typeof setupData) => {
        if (!data.rawInput.trim() || !storyId) return;
        setCreating(true);
        try {
            // Create the storyboard via the API
            const response = await fetch(`/api/v1/storyboards`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    storyId,
                    parentId: parentStoryboardId || undefined,
                    rawInput: data.rawInput,
                    sceneCount: data.sceneCount,
                }),
            });
            if (!response.ok) throw new Error("Failed to create storyboard");
            const result = await response.json();
            const newStoryboard = result.data || result;
            setStoryboardId(newStoryboard.id);
            setStoryboard(newStoryboard);

            // Trigger content generation
            await creation.generateContent(newStoryboard.id, {
                rawInput: data.rawInput,
                style: data.style || undefined,
            });

            setStep("generating");
        } catch (err) {
            console.error("Failed to create storyboard:", err);
        } finally {
            setCreating(false);
        }
    };

    // Step 2: Generating → move to images when done
    const handleGenerationComplete = () => {
        // Load the updated storyboard with scenes
        if (storyboardId) {
            loadStoryboard(storyboardId);
        }
        setStep("images");
    };

    // Step 3: Images → move to publish
    const handleImagesComplete = () => {
        setStep("publish");
    };

    // Step 4: Publish
    const handlePublish = (publishedId: string) => {
        router.push(`/storyboards/${publishedId}`);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">Creation Wizard</h2>
                <p className="text-muted-foreground">Create your storyboard with AI assistance</p>
            </div>

            <StepIndicator currentStep={step} />

            <div className="max-w-3xl mx-auto">
                {step === "setup" && (
                    <SetupStep
                        data={setupData}
                        onChange={handleSetupChange}
                        onNext={() => handleSetupComplete(setupData)}
                        onBack={() => router.back()}
                    />
                )}

                {step === "generating" && (
                    <GeneratingStep
                        progress={progress}
                        isPolling={isGenerating}
                        error={null}
                        onRetryFailedImages={retryFailedImages}
                        onCancel={cancelGeneration}
                        onComplete={handleGenerationComplete}
                        backgroundImage={coverImage || undefined}
                    />
                )}

                {step === "images" && (
                    <ImagesStep
                        storyboardId={storyboardId}
                        scenes={scenes}
                        onScenesUpdate={setScenes}
                        onNext={handleImagesComplete}
                        onBack={() => setStep("setup")}
                    />
                )}

                {step === "publish" && (
                    <PublishStep
                        storyboardId={storyboardId}
                        storyboard={storyboard}
                        scenes={scenes}
                        onBack={() => setStep("images")}
                        onPublish={handlePublish}
                    />
                )}
            </div>
        </div>
    );
}

export default function WizardPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20">Loading...</div>}>
            <WizardContent />
        </Suspense>
    );
}
