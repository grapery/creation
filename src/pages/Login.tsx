import { useState } from 'react';
import { Mail, Lock, Apple, Chrome } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - navigate to dashboard
    onNavigate('dashboard');
  };

  const handleSocialLogin = (provider: string) => {
    // Mock social login
    console.log(`Logging in with ${provider}`);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="mb-2">StoryForge</h1>
          <p className="text-muted-foreground">Welcome back! Sign in to continue</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => onNavigate('password-reset')}
                    className="text-primary hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('Apple')}
                className="w-full"
              >
                <Apple className="mr-2 h-5 w-5" />
                Apple
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('Google')}
                className="w-full"
              >
                <Chrome className="mr-2 h-5 w-5" />
                Google
              </Button>
            </div>

            <div className="text-center pt-4">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-muted-foreground mt-6">
          By continuing, you agree to our{' '}
          <button onClick={() => onNavigate('terms')} className="text-primary hover:underline">
            Terms of Service
          </button>{' '}
          and{' '}
          <button onClick={() => onNavigate('privacy')} className="text-primary hover:underline">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
}
