"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { storyboards } from "@/lib/api/storyboards";
import { Storyboard } from "@/lib/types";
import { Header } from "@/components/layout/header";
import { Loader2, GitBranch, GitCommit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock Tree Data
interface BranchNode {
    id: string;
    title: string;
    author: string;
    children?: BranchNode[];
    isCurrent?: boolean;
}

export default function BranchingPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    // In real app, we fetch tree structure.
    // Mocking for UI dev
    const mockTree: BranchNode = {
        id: "root",
        title: "The Beginning",
        author: "Alice",
        children: [
            {
                id: "b1",
                title: "Enter the Cave",
                author: "Bob",
                children: [
                    { id: "b1-1", title: "Fight the Bear", author: "Charlie" },
                    { id: "b1-2", title: "Run Away", author: "Bob" }
                ]
            },
            {
                id: "b2",
                title: "Climb the Mountain",
                author: "Alice",
                isCurrent: true,
                children: []
            }
        ]
    };

    useEffect(() => {
        // Fetch logic here
        setTimeout(() => setLoading(false), 1000);
    }, [id]);

    const renderTree = (node: BranchNode, depth = 0) => {
        return (
            <div key={node.id} className="relative pl-8">
                {/* Connector line */}
                {depth > 0 && (
                    <div className="absolute left-0 top-4 w-8 h-0.5 bg-border" />
                )}
                {/* Vertical line helper if needed for siblings, simplified here */}

                <div className="mb-4">
                    <div className={`p-4 rounded-lg border bg-card hover:border-primary transition-colors w-64 ${node.isCurrent ? 'ring-2 ring-primary' : ''}`}>
                        <div className="font-semibold text-sm flex items-center gap-2">
                            <GitCommit className="h-4 w-4 text-muted-foreground" />
                            {node.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">by {node.author}</div>
                        <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                                <Link href={`/storyboards/${node.id}`}>Read</Link>
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs" asChild>
                                <Link href={`/storyboards/${node.id}/editor`}>Branch</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-l-2 border-border ml-[-2rem] pl-8 space-y-4">
                    {/* Requires complex CSS for proper tree lines. MVP: Nested steps. */}
                    {node.children?.map(child => renderTree(child, depth + 1))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container px-4 py-8 overflow-auto">
                <div className="flex items-center gap-2 mb-8">
                    <GitBranch className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">Story Tree</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
                ) : (
                    <div className="p-8 min-w-max">
                        {/* Recursive Tree Renderer */}
                        <div className="flex flex-col gap-4">
                            {/* Custom simple recursive view */}
                            <div className="relative">
                                {/* Simplistic visual for now */}
                                <TreeNode node={mockTree} />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function TreeNode({ node }: { node: BranchNode }) {
    return (
        <div className="flex flex-col items-center">
            <div className={`z-10 p-4 rounded-lg border bg-card hover:border-primary transition-colors w-64 mb-8 relative ${node.isCurrent ? 'ring-2 ring-primary' : ''}`}>
                <div className="font-semibold text-sm flex items-center gap-2">
                    <GitCommit className="h-4 w-4 text-muted-foreground" />
                    {node.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1">by {node.author}</div>
                <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                        <Link href={`/storyboards/${node.id}`}>Read</Link>
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" asChild>
                        <Link href={`/storyboards/${node.id}/editor`}>Branch</Link>
                    </Button>
                </div>

                {node.children && node.children.length > 0 && <div className="absolute bottom-[-2rem] left-1/2 w-0.5 h-8 bg-border"></div>}
            </div>

            {node.children && node.children.length > 0 && (
                <div className="flex gap-8 relative">
                    {node.children.length > 1 && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-border -translate-y-[1px]" />
                    )}
                    {node.children.map((child, i) => (
                        <div key={child.id} className="flex flex-col items-center">
                            {/* Connector from horizontal bar to child */}
                            <div className="w-0.5 h-8 bg-border -mt-8 mb-0"></div>
                            {/* Wait, simple flex gap approach needs careful line drawing. */}
                            {/* For MVP, let's just show boxes. Tree lines are hard in pure CSS flex. */}
                            <TreeNode node={child} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
