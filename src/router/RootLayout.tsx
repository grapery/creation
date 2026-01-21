import { Outlet, useLocation } from 'react-router-dom';
import { RedditNavbar } from '../components/RedditNavbar';
import { RedditSidebar } from '../components/RedditSidebar';
import { RedditRightSidebar } from '../components/RedditRightSidebar';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export function RootLayout() {
    const location = useLocation();
    const { logout } = useAuthStore();
    // Hide sidebars on specific routes if needed (e.g., login)
    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    useEffect(() => {
        const handleUnauthorized = () => {
            logout();
            // Redirect to login if needed? 
            // The logout usually clears state. We can also force navigate.
            if (!['/login', '/register'].includes(location.pathname)) {
                window.location.href = '/login';
            }
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [logout, location.pathname]);

    if (isAuthPage) {
        return (
            <>
                <Outlet />
                <Toaster />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-[#DAE0E6]">
            <RedditNavbar />

            <div className="max-w-[1600px] mx-auto flex justify-center">
                {/* Left Sidebar - Hidden on mobile */}
                <div className="hidden md:block w-[270px] flex-shrink-0">
                    <RedditSidebar className="fixed left-0 lg:left-[max(0px,calc(50%-800px))]" />
                </div>

                {/* Main Content */}
                <main className="flex-1 min-w-0 max-w-[984px]">
                    <Outlet />
                </main>

                {/* Right Sidebar - Hidden on smaller screens */}
                <div className="hidden lg:block w-[312px] flex-shrink-0 ml-6">
                    <RedditRightSidebar className="fixed right-[max(0px,calc(50%-800px))]" />
                </div>
            </div>

            <Toaster />
        </div>
    );
}
