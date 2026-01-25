"use client";

import React from "react";
import { GitFork } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black opacity-90" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-6 w-6"
                    >
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    Voyager
                </div>

                {/* GitHub Fork Icon and Community Info - Centered */}
                <div className="relative z-20 flex flex-1 flex-col items-center justify-center">
                    <div className="flex flex-col items-center space-y-6">
                        <GitFork className="h-56 w-56 text-white" strokeWidth={1.5} />
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">Join the Community</h2>
                            <p className="text-xl text-zinc-300 max-w-md">
                                Fork, collaborate, and build amazing stories together
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Create, explore, and share interactive stories with the world. Join the Voyager community today.&rdquo;
                        </p>
                        <footer className="text-sm">The Voyager Team</footer>
                    </blockquote>
                </div>
            </div>
            <div className="flex h-full items-center justify-center p-8 bg-background">
                {children}
            </div>
        </div>
    )
}
