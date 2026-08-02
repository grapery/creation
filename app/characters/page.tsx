"use client";

import { useState, useEffect } from "react";
import { characters } from "@/lib/api/characters";
import { Character } from "@/lib/types/character";
import { CharacterCard } from "@/components/character/character-card";
import { Loader2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/providers/language-provider";
import { useAuthRequired } from "@/lib/hooks/use-auth-required";
import { useRouter } from "next/navigation";

export default function CharactersPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [items, setItems] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { isAuthenticated, isCheckingAuth, LoginPromptModal, showPrompt, requiresAuth } = useAuthRequired();

    useEffect(() => {
        if (!isCheckingAuth && !isAuthenticated) {
            showPrompt({
                title: "Sign in to browse characters",
                description: "Character directory requires an account.",
            });
        }
    }, [isAuthenticated, isCheckingAuth, showPrompt]);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            setItems([]);
            return;
        }
        async function fetchData() {
            setLoading(true);
            try {
                const res = await characters.list();
                setItems(res.characters || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [isAuthenticated]);

    const filteredItems = items.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (isCheckingAuth) {
        return (
            <main className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto">
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto">
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                    <p className="text-muted-foreground">
                        Sign in to browse the character directory.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Public character detail pages and share links still work without signing in.
                    </p>
                    <LoginPromptModal
                        title="Sign in to browse characters"
                        description="Character directory requires an account."
                    />
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{t("characters.title")}</h1>
                    <p className="text-muted-foreground mt-1">{t("characters.subtitle")}</p>
                </div>
                <Button
                    onClick={() =>
                        requiresAuth(() => {
                            router.push("/characters/create");
                        }, {
                            title: "Sign in to create",
                            description: "Please sign in to create characters.",
                        })
                    }
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {t("characters.create_button")}
                </Button>
            </div>

            <div className="relative mb-8">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    className="pl-9 bg-secondary/50 border-0"
                    placeholder={t("characters.search_placeholder")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredItems.map((char) => (
                        <CharacterCard key={char.id} character={char} />
                    ))}
                </div>
            )}
            <LoginPromptModal />
        </main>
    );
}
