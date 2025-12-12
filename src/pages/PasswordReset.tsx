import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

interface PasswordResetProps {
  onNavigate: (page: string) => void;
}

export function PasswordReset({ onNavigate }: PasswordResetProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="mb-2">Check Your Email</h2>
                <p className="text-muted-foreground">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
              </div>
              <p className="text-muted-foreground">
                Didn't receive the email? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} className="text-primary hover:underline">
                  try again
                </button>
              </p>
              <Button onClick={() => onNavigate('login')} className="w-full">
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => onNavigate('login')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you instructions to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
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

              <Button type="submit" className="w-full" size="lg">
                Send Reset Link
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
