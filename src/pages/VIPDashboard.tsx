import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Crown, Zap, BarChart, Check } from 'lucide-react';
import type { VIPInfo, GenericResponse } from '../types';
import { toast } from 'sonner';


export default function VIPDashboard() {
    // const { user } = useAuthStore(); // Unused for now
    const [vipInfo, setVipInfo] = useState<VIPInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVIPInfo = async () => {
            setLoading(true);
            try {
                // The backend path is /api/vippay/vip/info based on the provided main.go
                // apiClient typically prepends /api, so we might need to adjust or ensure consistency.
                // If apiClient base is /api, then request /vippay/vip/info -> /api/vippay/vip/info
                const res = await apiClient.get<GenericResponse<VIPInfo>>('/vippay/vip/info');
                setVipInfo(res.data.data);
            } catch (error) {
                console.error("Failed to fetch VIP info", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVIPInfo();
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <div className="p-8 text-center">Loading membership details...</div>;


    return (
        <div className="container max-w-5xl mx-auto py-8 px-4">
            <div className="mb-8 flex items-center gap-3">
                <Crown className="w-10 h-10 text-yellow-500" />
                <div>
                    <h1 className="text-3xl font-bold">Membership & Billing</h1>
                    <p className="text-gray-500">Manage your subscription and usage limits.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Current Plan Card */}
                <Card className="md:col-span-2 border-l-4 border-l-yellow-500 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Current Plan</CardTitle>
                        <CardDescription>
                            You are currently on the <span className="font-bold text-gray-900">{vipInfo?.is_vip ? 'VIP Premium' : 'Free Starter'}</span> plan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className={`font-semibold ${vipInfo?.is_vip ? 'text-green-600' : 'text-gray-700'}`}>
                                    {vipInfo?.is_vip ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Expires</p>
                                <p className="font-semibold">{formatDate(vipInfo?.expires_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Auto-Renew</p>
                                <p className="font-semibold">{vipInfo?.auto_renew ? 'On' : 'Off'}</p>
                            </div>
                            {vipInfo?.is_vip ? (
                                <Button variant="outline">Manage Subscription</Button>
                            ) : (
                                <Button
                                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                                    onClick={() => {
                                        // Navigate to payment page or open payment dialog
                                        toast.info('Payment flow coming soon!');
                                    }}
                                >
                                    Upgrade to Premium
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Usage Stats Mockup */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart className="w-5 h-5 text-blue-500" />
                            Monthly Usage
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Story Quota</span>
                                <span className="font-bold">{vipInfo?.quota_used || 0} / {vipInfo?.quota_limit || 10}</span>
                            </div>
                            <Progress value={((vipInfo?.quota_used || 0) / (vipInfo?.quota_limit || 10)) * 100} className="h-2" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>AI Tokens</span>
                                <span className="font-bold">24% Used</span>
                            </div>
                            <Progress value={24} className="h-2 bg-gray-100" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Plans Comparison */}
            {!vipInfo?.is_vip && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-center mb-8">Unlock Your Creative Potential</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Free Plan */}
                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle>Starter</CardTitle>
                                <CardDescription>For casual explorers</CardDescription>
                                <div className="text-3xl font-bold mt-2">$0 <span className="text-sm font-normal text-gray-500">/mo</span></div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                <ul className="space-y-3 mb-6 flex-1">
                                    <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> 10 AI Generations / mo</li>
                                    <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> 2 Character Profiles</li>
                                    <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> 5 Story Contexts</li>
                                    <li className="flex items-center gap-2 text-sm text-gray-400"><Check className="w-4 h-4 text-gray-300" /> Standard Support</li>
                                </ul>
                                <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                            </CardContent>
                        </Card>

                        {/* Pro Plan */}
                        <Card className="flex flex-col border-yellow-500 shadow-xl relative overflow-hidden transform scale-105 z-10">
                            <div className="absolute top-0 right-0 bg-yellow-500 text-xs font-bold px-3 py-1 text-black rounded-bl">MOST POPULAR</div>
                            <CardHeader>
                                <CardTitle className="text-yellow-600">Premium</CardTitle>
                                <CardDescription>For serious creators</CardDescription>
                                <div className="text-3xl font-bold mt-2">$9.99 <span className="text-sm font-normal text-gray-500">/mo</span></div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                <ul className="space-y-3 mb-6 flex-1">
                                    <li className="flex items-center gap-2 text-sm"><Zap className="w-4 h-4 text-yellow-500" /> Unlimited AI Generations</li>
                                    <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> 50 Character Profiles</li>
                                    <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> Unlimited Contexts</li>
                                    <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> Priority Queue</li>
                                    <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> Early Access to New Features</li>
                                </ul>
                                <Button
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                                    onClick={() => {
                                        // Navigate to payment page
                                        toast.info('Payment flow coming soon!');
                                    }}
                                >
                                    Subscribe Now
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Enterprise Plan */}
                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle>Business</CardTitle>
                                <CardDescription>For teams and powertools</CardDescription>
                                <div className="text-3xl font-bold mt-2">$29.99 <span className="text-sm font-normal text-gray-500">/mo</span></div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                <ul className="space-y-3 mb-6 flex-1">
                                    <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> Everything in Premium</li>
                                    <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> Team Collaboration Tools</li>
                                    <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> API Access Keys</li>
                                    <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> Dedicated Account Manager</li>
                                    <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> Custom AI Models</li>
                                </ul>
                                <Button variant="outline" className="w-full">Contact Sales</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
