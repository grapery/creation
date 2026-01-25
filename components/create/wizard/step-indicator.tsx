"use client";

export type WizardStep = "setup" | "create" | "images" | "video" | "publish";

interface StepIndicatorProps {
    currentStep: WizardStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = [
        { id: "setup" as WizardStep, label: "Setup", icon: "⚙️" },
        { id: "create" as WizardStep, label: "Create", icon: "✏️" },
        { id: "images" as WizardStep, label: "Images", icon: "🖼️" },
        { id: "video" as WizardStep, label: "Video", icon: "🎬" },
        { id: "publish" as WizardStep, label: "Publish", icon: "📤" },
    ];

    const currentIndex = steps.findIndex(s => s.id === currentStep);
    const canNavigateToStep = (stepIndex: number) => stepIndex <= currentIndex + 1;

    return (
        <div className="px-4 py-3">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
                {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isPast = currentIndex > index;
                    const canNavigate = canNavigateToStep(index);

                    return (
                        <div key={step.id} className="flex items-center flex-1">
                            {/* Step Circle */}
                            <button
                                disabled={!canNavigate}
                                className={`relative flex flex-col items-center ${
                                    canNavigate ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                                }`}
                            >
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                        isActive
                                            ? "bg-black text-white"
                                            : isPast
                                            ? "bg-black/70 text-white"
                                            : "bg-gray-300"
                                    }`}
                                >
                                    <span className="text-[14px] font-semibold">{step.icon}</span>
                                </div>
                                
                                {/* Step Label */}
                                <span
                                    className={`text-[9px] mt-1 font-medium ${
                                        isActive ? "text-black" : isPast ? "text-black/70" : "text-gray-400"
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </button>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-1 ${
                                        currentIndex > index ? "bg-black/50" : "bg-gray-300"
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
