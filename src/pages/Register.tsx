import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { toast } from 'sonner';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        displayName: '',
        email: '',
        password: '',
        invitationCode: '',
        agreeTerms: false
    });

    const { register, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, agreeTerms: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.agreeTerms) {
            toast.error("You must agree to the terms and conditions");
            return;
        }

        try {
            await register(formData);
            toast.success('Account created successfully');
            navigate('/');
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.msg || 'Failed to create account. Please try again.';
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>Enter your details below to create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    minLength={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    name="displayName"
                                    placeholder="Display Name"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                name="invitationCode"
                                placeholder="Invitation Code (Optional)"
                                value={formData.invitationCode}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="terms"
                                checked={formData.agreeTerms}
                                onCheckedChange={handleCheckboxChange}
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I agree to the terms and conditions
                            </label>
                        </div>

                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
