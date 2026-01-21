import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';

export function RedditRightSidebar({ className }: { className?: string }) {
    const navigate = useNavigate();
    const { setCreateGroupDialogOpen } = useUIStore();
    return (
        <div className={cn("sticky top-[48px] pt-4 h-[calc(100vh-48px)] overflow-y-auto hidden lg:block w-[312px]", className)}>
            {/* Home Banner Card */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden mb-4">
                <div className="h-8 bg-blue-100 bg-[url('https://www.redditstatic.com/desktop2x/img/id-cards/home-banner@2x.png')] bg-cover bg-center" />
                <div className="px-3 pb-3">
                    <div className="flex items-center gap-2 -mt-3 mb-2">
                        <div className="h-10 w-10 bg-[url('https://www.redditstatic.com/desktop2x/img/id-cards/snoo-home@2x.png')] bg-cover bg-center" />
                        <span className="font-bold text-base mt-4">Home</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                        Your personal Grapery frontpage. Come here to check in with your favorite communities.
                    </p>
                    <div className="border-t border-gray-200 py-3 space-y-3">
                        <Button className="w-full rounded-full font-bold bg-[#FF4500] hover:bg-[#D43900]" onClick={() => navigate('/submit')}>Create Post</Button>
                        <Button variant="outline" className="w-full rounded-full font-bold border-[#FF4500] text-[#FF4500] hover:bg-orange-50" onClick={() => setCreateGroupDialogOpen(true)}>Create Space</Button>
                    </div>
                </div>
            </div>

            {/* Premium / Ad Placeholder */}
            <div className="bg-white rounded border border-gray-200 p-3 mb-4">
                <div className="flex items-start gap-2">
                    <ShieldCheck className="h-6 w-6 text-[#FF4500]" />
                    <div className="text-xs">
                        <p className="font-bold text-gray-900 mb-1">Grapery Premium</p>
                        <p className="text-gray-500 mb-2">The best Grapery experience, with monthly Coins and no ads.</p>
                        <Button size="sm" className="w-full rounded-full font-bold bg-[#FF4500]" onClick={() => navigate('/vip')}>Try Now</Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white rounded border border-gray-200 p-3 sticky top-[60px]">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
                    <span>User Agreement</span>
                    <span>Privacy Policy</span>
                    <span>Content Policy</span>
                    <span>Moderator Code of Conduct</span>
                </div>
                <div className="border-t pt-3 text-xs text-gray-500">
                    Grapery Inc © 2025. All rights reserved
                </div>
            </div>
        </div>
    );
}
