import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

interface DeleteAccountProps {
  onNavigate: (page: string) => void;
}

export function DeleteAccount({ onNavigate }: DeleteAccountProps) {
  const [confirmText, setConfirmText] = useState('');
  const [understandData, setUnderstandData] = useState(false);
  const [understandPermanent, setUnderstandPermanent] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const canDelete =
    confirmText.toLowerCase() === 'delete my account' &&
    understandData &&
    understandPermanent;

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    // Mock account deletion
    console.log('Account deleted');
    onNavigate('login');
  };

  return (
    <div className="min-h-screen pt-14">
      <MobileHeader title="Delete Account" showBack onBack={() => onNavigate('settings')} />

      <div className="p-4 space-y-4">
        {/* Warning */}
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-destructive">Warning: This action cannot be undone</h3>
                <p className="text-muted-foreground">
                  Deleting your account is permanent. All your data will be permanently removed from
                  our servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What will be deleted */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3>What will be deleted:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>Your profile and all personal information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>All stories and storyboards you've created</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>All characters and assets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>Comments, likes, and social interactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>Group memberships and collaborations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>Subscription and payment history</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Before you go */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3>Before you go...</h3>
            <p className="text-muted-foreground">Consider these alternatives:</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate('privacy-settings')}
              >
                Adjust your privacy settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate('profile-settings')}
              >
                Update your profile preferences
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  alert('Temporarily deactivating account...');
                }}
              >
                Temporarily deactivate instead
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3>Confirm Account Deletion</h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="understand-data"
                  checked={understandData}
                  onCheckedChange={(checked) => setUnderstandData(checked as boolean)}
                />
                <label htmlFor="understand-data" className="leading-tight text-muted-foreground">
                  I understand that all my data will be permanently deleted and cannot be recovered
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="understand-permanent"
                  checked={understandPermanent}
                  onCheckedChange={(checked) => setUnderstandPermanent(checked as boolean)}
                />
                <label htmlFor="understand-permanent" className="leading-tight text-muted-foreground">
                  I understand this action is permanent and my account cannot be restored
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">
                Type <strong>"delete my account"</strong> to confirm
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete my account"
              />
            </div>

            <Button
              variant="destructive"
              className="w-full"
              size="lg"
              disabled={!canDelete}
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Delete My Account Permanently
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 text-center text-muted-foreground">
            <p>
              If you're experiencing issues or have concerns, please{' '}
              <button className="text-primary hover:underline">contact support</button> before
              deleting your account.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Final Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This is your last chance. Once you confirm, your account and all associated data will
              be permanently deleted within 30 days. You will be immediately logged out.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
