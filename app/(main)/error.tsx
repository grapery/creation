"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function MainError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground text-center max-w-md">
                An unexpected error occurred. Please try again.
            </p>
            <Button onClick={reset}>Try again</Button>
        </main>
    );
}
