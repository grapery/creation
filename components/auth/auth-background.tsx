"use client";

import React from "react";

interface AuthBackgroundProps {
    children: React.ReactNode;
}

export function AuthBackground({ children }: AuthBackgroundProps) {
    return (
        <div className="min-h-screen bg-muted/30">
            {children}
        </div>
    );
}
