import { Home, Flame, Clock, Users, Info, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Group } from '../types';
import { api } from '../lib/api';
import { CreateGroupDialog } from './CreateGroupDialog';

import { useUIStore } from '../stores/uiStore';

export function RedditSidebar({ className }: { className?: string }) {
    const navigate = useNavigate();
    const [groups, setGroups] = useState<Group[]>([]);
    const { isCreateGroupDialogOpen, setCreateGroupDialogOpen } = useUIStore();

    useEffect(() => {
        // Fetch some groups for the sidebar
        const fetchGroups = async () => {
            try {
                const res = await api.get<{ groups: Group[] }>('/groups');
                if (res && (res as any).groups) {
                    setGroups((res as any).groups.slice(0, 5));
                }
            } catch (e) {
                // Silently fail - groups are optional sidebar content
                // User can browse without seeing groups
            }
        };
        fetchGroups();
    }, []);

    return (
        <div className={`w-[270px] h-[calc(100vh-48px)] overflow-y-auto pt-4 pb-4 sticky top-[48px] border-r border-gray-100 bg-white ${className}`}>

            {/* Feeds */}
            <div className="mb-4">
                <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Feeds</div>
                <Button variant="ghost" className="w-full justify-start h-10 px-4 gap-3 text-gray-700 hover:bg-gray-100 rounded-none mb-1" onClick={() => navigate('/')}>
                    <Home className="h-5 w-5" />
                    Home
                </Button>
                <Button variant="ghost" className="w-full justify-start h-10 px-4 gap-3 text-gray-700 hover:bg-gray-100 rounded-none mb-1" onClick={() => navigate('/popular')}>
                    <Flame className="h-5 w-5" />
                    Popular
                </Button>
                <Button variant="ghost" className="w-full justify-start h-10 px-4 gap-3 text-gray-700 hover:bg-gray-100 rounded-none mb-1" onClick={() => navigate('/all')}>
                    <Clock className="h-5 w-5" />
                    All
                </Button>
            </div>

            <Separator className="my-3 mx-4 w-auto" />

            {/* Spaces */}
            <div className="mb-4">
                <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                    Spaces
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-gray-200" onClick={() => setCreateGroupDialogOpen(true)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {groups.map(group => (
                    <Button key={group.id} variant="ghost" className="w-full justify-start h-10 px-4 gap-3 text-gray-700 hover:bg-gray-100 rounded-none mb-1" onClick={() => navigate(`/r/${group.id}`)}>
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs overflow-hidden">
                            {group.avatar ? <img src={group.avatar} /> : group.name[0]}
                        </div>
                        <span className="truncate">r/{group.name}</span>
                    </Button>
                ))}

                <Button variant="ghost" className="w-full justify-start h-10 px-4 gap-3 text-gray-700 hover:bg-gray-100 rounded-none mb-1" onClick={() => navigate('/groups')}>
                    <Users className="h-5 w-5" />
                    See All
                </Button>
            </div>

            <Separator className="my-3 mx-4 w-auto" />

            {/* Characters */}
            <div className="mb-4">
                <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                    Characters
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-gray-200" onClick={() => navigate('/characters/create')}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <Button variant="ghost" className="w-full justify-start h-10 px-4 gap-3 text-gray-700 hover:bg-gray-100 rounded-none mb-1" onClick={() => navigate('/characters')}>
                    <Users className="h-5 w-5" />
                    My Characters
                </Button>
            </div>

            <Separator className="my-3 mx-4 w-auto" />

            {/* Topics/Resources */}
            <div className="mb-4">
                <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resources</div>
                <Button variant="ghost" className="w-full justify-start h-10 px-4 gap-3 text-gray-700 hover:bg-gray-100 rounded-none mb-1">
                    <Info className="h-5 w-5" />
                    About Grapery
                </Button>
            </div>

            <CreateGroupDialog open={isCreateGroupDialogOpen} onOpenChange={setCreateGroupDialogOpen} />
        </div>
    );
}
