"use client";

export type WizardStep = "setup" | "generating" | "images" | "publish";

interface StepIndicatorProps {
    currentStep: WizardStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = [
        { id: "setup" as WizardStep, label: "Setup", icon: "1" },
        { id: "generating" as WizardStep, label: "Generate", icon: "2" },
        { id: "images" as WizardStep, label: "Images", icon: "3" },
        { id: "publish" as WizardStep, label: "Publish", icon: "4" },
    ];

    const currentIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="px-4 py-3">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
                {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isPast = currentIndex > index;

                    return (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : isPast
                                            ? "bg-primary/70 text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                    {step.icon}
                                </div>
                                <span
                                    className={`text-[10px] mt-1 font-medium ${
                                        isActive ? "text-primary" : isPast ? "text-primary/70" : "text-muted-foreground"
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-2 ${
                                        currentIndex > index ? "bg-primary/50" : "bg-border"
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
