import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <main className="md:col-span-8 min-w-0">
                        {children}
                    </main>
                    <aside className="hidden md:block md:col-span-4 space-y-6">
                        <div className="sticky top-[72px]">
                            <Sidebar />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
