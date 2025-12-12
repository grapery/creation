import { LogOut } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface SignOutProps {
  onNavigate: (page: string) => void;
}

export function SignOut({ onNavigate }: SignOutProps) {
  const handleSignOut = () => {
    // Mock sign out
    console.log('Signing out...');
    onNavigate('login');
  };

  return (
    <div className="min-h-screen pt-14">
      <MobileHeader title="Sign Out" showBack onBack={() => onNavigate('settings')} />

      <div className="p-4 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <LogOut className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="mb-2">Sign Out?</h2>
              <p className="text-muted-foreground">
                Are you sure you want to sign out of your account? You can sign back in anytime.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="destructive" size="lg" onClick={handleSignOut} className="w-full">
                <LogOut className="mr-2 h-5 w-5" />
                Yes, Sign Out
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate('settings')}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
