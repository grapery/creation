import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, MessageSquare, LogOut, User as UserIcon, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import type { GenericResponse } from '../types';

export function RedditNavbar() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [unreadCount, setUnreadCount] = useState(0);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        if (isAuthenticated) {
            const fetchUnread = async () => {
                try {
                    const res = await apiClient.get<GenericResponse<{ count: number }>>('/notifications/unread/count');
                    setUnreadCount(res.data.data.count);
                } catch (err) {
                    console.error("Failed to fetch unread count", err);
                }
            };
            fetchUnread();
            // Poll every minute?
            const interval = setInterval(fetchUnread, 60000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 h-[48px] px-4 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-[#FF4500] rounded-full flex items-center justify-center text-white font-bold text-xl">
                        G
                    </div>
                    <span className="hidden md:block font-bold text-xl tracking-tight">grapery</span>
                </Link>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-[600px] px-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        className="bg-gray-100 border-transparent hover:bg-white hover:border-blue-500 focus:bg-white focus:border-blue-500 h-[40px] rounded-full pl-10"
                        placeholder="Search Grapery"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                toast.info("Search feature coming soon in next update!");
                            }
                        }}
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {isAuthenticated ? (
                    <>
                        <Button variant="ghost" size="icon" className="text-gray-600" onClick={() => navigate('/chat')}>
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-600 relative" onClick={() => navigate('/notifications')}>
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full min-w-[1.25rem] h-4 flex items-center justify-center border border-white leading-none">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-600 md:hidden" onClick={() => navigate('/submit')}>
                            <Plus className="h-6 w-6" />
                        </Button>
                        <Button className="hidden md:flex items-center gap-2 rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 border-none font-bold" onClick={() => navigate('/submit')}>
                            <Plus className="h-5 w-5" />
                            Create
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
                                    <Avatar className="h-8 w-8 border border-gray-200">
                                        <AvatarImage src={user?.avatar} alt={user?.username} />
                                        <AvatarFallback className="bg-orange-500 text-white">
                                            {user?.username?.[0]?.toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.displayName || user?.username}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            u/{user?.username}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate(`/u/${user?.id}`)}>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/settings')}>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/vip')}>
                                    <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                                    <span>Premium</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" className="rounded-full font-bold text-gray-900 bg-gray-100 hover:bg-gray-200" onClick={() => navigate('/login')}>
                            Log In
                        </Button>
                        <Button className="rounded-full font-bold bg-[#FF4500] hover:bg-[#D43900]" onClick={() => navigate('/register')}>
                            Sign Up
                        </Button>
                    </div>
                )}
            </div>
        </nav >
    );
}
