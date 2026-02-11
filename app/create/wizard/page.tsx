"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StepIndicator, WizardStep } from "@/components/create/wizard/step-indicator";
import { SetupStep } from "@/components/create/wizard/setup-step";
import { CreateStep } from "@/components/create/wizard/create-step";
import { ImagesStep } from "@/components/create/wizard/images-step";
import { VideoStep } from "@/components/create/wizard/video-step";
import { PublishStep } from "@/components/create/wizard/publish-step";

function WizardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState<WizardStep>('setup');
    const [data, setData] = useState({
        title: "",
        style: "",
        useAI: true,
        sceneCount: 3,
        characters: [] as any[],
        content: "",
        generatedContent: "",
        scenes: [] as any[],
        images: [] as any[],
        video: "",
    });

    // Check if continuing from an existing story
    useEffect(() => {
        const storyId = searchParams.get('storyId');
        if (storyId) {
            // Load existing story data
            setData(prev => ({
                ...prev,
                title: `Continuing from Story ${storyId}`,
                content: "Loading story content..."
            }));
        }
    }, [searchParams]);

    const handleNext = () => {
        const steps: WizardStep[] = ['setup', 'create', 'images', 'video', 'publish'];
        const idx = steps.indexOf(step);
        if (idx < steps.length - 1) {
            setStep(steps[idx + 1]);
        }
    };

    const handleBack = () => {
        const steps: WizardStep[] = ['setup', 'create', 'images', 'video', 'publish'];
        const idx = steps.indexOf(step);
        if (idx > 0) {
            setStep(steps[idx - 1]);
        }
    };

    const handlePublish = () => {
        // Navigate to the created storyboard
        router.push('/storyboards/new-created-id');
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">Creation Wizard</h2>
                <p className="text-muted-foreground">Create your story step by step.</p>
            </div>

            {/* Step Indicator */}
            <StepIndicator currentStep={step} />

            {/* Content */}
            <div className="max-w-3xl mx-auto">
                {step === 'setup' && (
                    <SetupStep
                        data={data}
                        onChange={setData}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )}

                {step === 'create' && (
                    <CreateStep
                        data={data}
                        onChange={setData}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )}

                {step === 'images' && (
                    <ImagesStep
                        data={data}
                        onChange={setData}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )}

                {step === 'video' && (
                    <VideoStep
                        data={data}
                        onChange={setData}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )}

                {step === 'publish' && (
                    <PublishStep
                        data={data}
                        onChange={setData}
                        onBack={handleBack}
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
