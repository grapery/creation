export const ONBOARDING_DONE_KEY = "voyager_onboarding_done";

export function hasCompletedOnboarding(): boolean {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(ONBOARDING_DONE_KEY) === "1";
}

export function markOnboardingDone(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ONBOARDING_DONE_KEY, "1");
}
