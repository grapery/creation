import { useState, useEffect } from 'react';
import { MobileNavigation } from './components/MobileNavigation';
import { Toaster } from './components/ui/sonner';
import { useAuthStore } from './stores';
import { Dashboard } from './pages/Dashboard';
import { StoryEditor } from './pages/StoryEditor';
import { StoryboardEditor } from './pages/StoryboardEditor';
import { CharacterEditor } from './pages/CharacterEditor';
import { CharacterProfile } from './pages/CharacterProfile';
import { StoryViewer } from './pages/StoryViewer';
import { StoryDetail } from './pages/StoryDetail';
import { StoryboardViewer } from './pages/StoryboardViewer';
import { ContinueStory } from './pages/ContinueStory';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { FollowersList } from './pages/FollowersList';
import { FollowingList } from './pages/FollowingList';
import { Groups } from './pages/Groups';
import { GroupDetail } from './pages/GroupDetail';
import { ChatList } from './pages/ChatList';
import { ChatConversation } from './pages/ChatConversation';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PasswordReset } from './pages/PasswordReset';
import { Settings } from './pages/Settings';
import { ProfileSettings } from './pages/ProfileSettings';
import { Notifications } from './pages/Notifications';
import { Membership } from './pages/Membership';
import { AppearanceSettings } from './pages/AppearanceSettings';
import { PrivacySettings } from './pages/PrivacySettings';
import { LanguageSettings } from './pages/LanguageSettings';
import { TermsOfService } from './pages/TermsOfService';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { About } from './pages/About';
import { RegulatoryInfo } from './pages/RegulatoryInfo';
import { DeleteAccount } from './pages/DeleteAccount';
import { SignOut } from './pages/SignOut';

type Page = 
  | 'dashboard' 
  | 'stories' 
  | 'characters' 
  | 'groups' 
  | 'assets' 
  | 'search' 
  | 'profile'
  | 'edit-profile'
  | 'followers-list'
  | 'following-list'
  | 'create-story'
  | 'story-editor'
  | 'story-viewer'
  | 'story-detail'
  | 'storyboard-editor'
  | 'storyboard-viewer'
  | 'continue-story'
  | 'character-editor'
  | 'character-viewer'
  | 'group-detail'
  | 'chat'
  | 'chat-conversation'
  | 'login'
  | 'register'
  | 'password-reset'
  | 'settings'
  | 'profile-settings'
  | 'notifications'
  | 'notification-settings'
  | 'membership'
  | 'appearance-settings'
  | 'privacy-settings'
  | 'language-settings'
  | 'terms'
  | 'privacy'
  | 'about'
  | 'regulatory'
  | 'delete-account'
  | 'sign-out';

interface NavigationState {
  page: Page;
  id?: string;
}

export default function App() {
  const { isAuthenticated, getCurrentUser } = useAuthStore();
  const [navState, setNavState] = useState<NavigationState>({ page: 'login' });

  useEffect(() => {
    // Check authentication on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      getCurrentUser().then(() => {
        // If authenticated and on login page, navigate to dashboard
        if (isAuthenticated && navState.page === 'login') {
          setNavState({ page: 'dashboard' });
        }
      }).catch(() => {
        // Token invalid, stay on login
        if (navState.page !== 'login') {
          setNavState({ page: 'login' });
        }
      });
    } else {
      // No token, ensure we're on login page
      if (navState.page !== 'login' && navState.page !== 'register' && navState.page !== 'password-reset') {
        setNavState({ page: 'login' });
      }
    }
  }, []);

  useEffect(() => {
    // Update navigation based on auth state changes
    if (!isAuthenticated && navState.page !== 'login' && navState.page !== 'register' && navState.page !== 'password-reset') {
      setNavState({ page: 'login' });
    }
  }, [isAuthenticated, navState.page]);

  const handleNavigate = (page: string, id?: string) => {
    // If navigating to dashboard and authenticated, allow it
    if (page === 'dashboard' && isAuthenticated) {
      setNavState({ page: page as Page, id });
    } 
    // Allow navigation to auth pages
    else if (['login', 'register', 'password-reset'].includes(page)) {
      setNavState({ page: page as Page, id });
    }
    // For other pages, check authentication
    else if (isAuthenticated) {
      setNavState({ page: page as Page, id });
    } else {
      // Redirect to login if not authenticated
      setNavState({ page: 'login' });
    }
  };

  const renderPage = () => {
    switch (navState.page) {
      case 'dashboard':
      case 'stories':
        return <Dashboard onNavigate={handleNavigate} />;
      
      case 'create-story':
        return <StoryEditor onNavigate={handleNavigate} />;
      
      case 'story-editor':
        return <StoryEditor storyId={navState.id} onNavigate={handleNavigate} />;
      
      case 'story-viewer':
        return <StoryViewer storyId={navState.id} onNavigate={handleNavigate} />;
      
      case 'story-detail':
        return <StoryDetail storyId={navState.id} onNavigate={handleNavigate} />;
      
      case 'storyboard-editor':
        return <StoryboardEditor storyId={navState.id} onNavigate={handleNavigate} />;
      
      case 'storyboard-viewer':
        return <StoryboardViewer storyId={navState.id} onNavigate={handleNavigate} />;
      
      case 'continue-story':
        return <ContinueStory storyId={navState.id} onNavigate={handleNavigate} />;
      
      case 'character-editor':
      case 'characters':
        return <CharacterEditor characterId={navState.id} onNavigate={handleNavigate} />;
      
      case 'character-viewer':
        return <CharacterProfile characterId={navState.id} onNavigate={handleNavigate} />;
      
      case 'profile':
        return <Profile userId={navState.id} onNavigate={handleNavigate} />;
      
      case 'edit-profile':
        return <EditProfile onNavigate={handleNavigate} />;
      
      case 'followers-list':
        return <FollowersList onNavigate={handleNavigate} />;
      
      case 'following-list':
        return <FollowingList onNavigate={handleNavigate} />;
      
      case 'groups':
        return <Groups onNavigate={handleNavigate} />;
      
      case 'group-detail':
        return <GroupDetail groupId={navState.id} onNavigate={handleNavigate} />;
      
      case 'chat':
        return <ChatList onNavigate={handleNavigate} />;
      
      case 'chat-conversation':
        return <ChatConversation chatId={navState.id} onNavigate={handleNavigate} />;
      
      case 'search':
        return <Dashboard onNavigate={handleNavigate} />;
      
      case 'assets':
        return <Dashboard onNavigate={handleNavigate} />;
      
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      
      case 'password-reset':
        return <PasswordReset onNavigate={handleNavigate} />;
      
      case 'settings':
        return <Settings onNavigate={handleNavigate} />;
      
      case 'profile-settings':
        return <ProfileSettings onNavigate={handleNavigate} />;
      
      case 'notifications':
        return <Notifications onNavigate={handleNavigate} />;
      
      case 'notification-settings':
        return <Notifications onNavigate={handleNavigate} />;
      
      case 'membership':
        return <Membership onNavigate={handleNavigate} />;
      
      case 'appearance-settings':
        return <AppearanceSettings onNavigate={handleNavigate} />;
      
      case 'privacy-settings':
        return <PrivacySettings onNavigate={handleNavigate} />;
      
      case 'language-settings':
        return <LanguageSettings onNavigate={handleNavigate} />;
      
      case 'terms':
        return <TermsOfService onNavigate={handleNavigate} />;
      
      case 'privacy':
        return <PrivacyPolicy onNavigate={handleNavigate} />;
      
      case 'about':
        return <About onNavigate={handleNavigate} />;
      
      case 'regulatory':
        return <RegulatoryInfo onNavigate={handleNavigate} />;
      
      case 'delete-account':
        return <DeleteAccount onNavigate={handleNavigate} />;
      
      case 'sign-out':
        return <SignOut onNavigate={handleNavigate} />;
      
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="w-full">
        {renderPage()}
      </main>
      
      {navState.page !== 'storyboard-viewer' && 
       navState.page !== 'continue-story' &&
       navState.page !== 'login' && 
       navState.page !== 'register' && 
       navState.page !== 'password-reset' && (
        <MobileNavigation currentPage={navState.page} onNavigate={handleNavigate} />
      )}
      <Toaster />
    </div>
  );
}