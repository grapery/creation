import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from './router/RootLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import StoryDetail from './pages/StoryDetail';
import GroupDetail from './pages/GroupDetail';
import SubmitStory from './pages/SubmitStory';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import VIPDashboard from './pages/VIPDashboard';
import AgentChat from './pages/AgentChat';
import CreateCharacter from './pages/CreateCharacter';
import CharacterDetail from './pages/CharacterDetail';
import StoryboardDetail from './pages/StoryboardDetail';
import Notifications from './pages/Notifications';
import Register from './pages/Register';
import Groups from './pages/Groups';
import CharactersList from './pages/CharactersList';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/popular" element={<Dashboard />} />
          <Route path="/all" element={<Dashboard />} />
          <Route path="/submit" element={<SubmitStory />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/storyboards/:id" element={<StoryboardDetail />} />
          <Route path="/r/:id" element={<GroupDetail />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/u/:id" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/vip" element={<VIPDashboard />} />
          <Route path="/chat" element={<AgentChat />} />

          <Route path="/characters" element={<CharactersList />} />
          <Route path="/characters/create" element={<CreateCharacter />} />
          <Route path="/characters/:id" element={<CharacterDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
