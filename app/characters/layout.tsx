import { Header } from "@/components/layout/header";

export default function CharactersLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto">
                {children}
            </div>
        </div>
    );
}
