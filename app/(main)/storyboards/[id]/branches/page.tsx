"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { storyboards } from "@/lib/api/storyboards";
import { Storyboard } from "@/lib/types";
import { Loader2, GitBranch, GitCommit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TreeNode {
    id: string;
    title: string;
    author: string;
    children: TreeNode[];
    isCurrent?: boolean;
}

function buildTree(items: Storyboard[], currentId: string): TreeNode | null {
    if (!items.length) return null;
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    for (const item of items) {
        map.set(item.id, {
            id: item.id,
            title: item.title,
            author: item.creatorName || "Unknown",
            children: [],
            isCurrent: item.id === currentId,
        });
    }

    for (const item of items) {
        const node = map.get(item.id)!;
        if (item.parentId && item.parentId !== "root" && map.has(item.parentId)) {
            map.get(item.parentId)!.children.push(node);
        } else {
            roots.push(node);
        }
    }

    return roots[0] || null;
}

export default function BranchingPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [tree, setTree] = useState<TreeNode | null>(null);

    useEffect(() => {
        if (!id) return;
        let isMounted = true;
        async function load() {
            try {
                const data = await storyboards.getTree(id as string);
                const dataObj = data as { storyboards?: Storyboard[]; nodes?: Storyboard[] };
                const nodes = dataObj.storyboards || dataObj.nodes || (Array.isArray(data) ? (data as Storyboard[]) : []);
                const built = buildTree(nodes as Storyboard[], id as string);
                if (isMounted) setTree(built);
            } catch (e) {
                console.error("Failed to load tree:", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        load();
        return () => { isMounted = false; };
    }, [id]);

    return (
        <main className="flex-1 container max-w-6xl mx-auto px-4 py-6 md:px-6">
            <div className="flex items-center gap-2 mb-8">
                <GitBranch className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Story Tree</h1>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8" /></div>
            ) : !tree ? (
                <div className="text-center py-20 text-muted-foreground">No branching data available.</div>
            ) : (
                <div className="p-8 overflow-x-auto">
                    <TreeNodeComponent node={tree} />
                </div>
            )}
        </main>
    );
}

function TreeNodeComponent({ node }: { node: TreeNode }) {
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
                </div>
                {node.children.length > 0 && <div className="absolute bottom-[-2rem] left-1/2 w-0.5 h-8 bg-border" />}
            </div>

            {node.children.length > 0 && (
                <div className="flex gap-8 relative">
                    {node.children.length > 1 && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-border -translate-y-[1px]" />
                    )}
                    {node.children.map((child) => (
                        <div key={child.id} className="flex flex-col items-center">
                            <div className="w-0.5 h-8 bg-border -mt-8" />
                            <TreeNodeComponent node={child} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
