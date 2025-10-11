
import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { useRouter } from './hooks/useRouter';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { Feed } from './components/Feed';
import { ProfilePage } from './components/profile/ProfilePage';
import { AuthPage } from './components/AuthPage';
import { ChatPage } from './components/ChatPage';
import { NotificationsPage } from './components/NotificationsPage';
import { SearchPage } from './components/SearchPage';
import { GroupsPage } from './components/groups/GroupsPage';
import { AdvertisePage } from './components/AdvertisePage';
import { BottomNav } from './components/BottomNav';
import { ChatLauncher } from './components/chat/ChatLauncher';
import { StoryViewer } from './components/stories/StoryViewer';
import { CreateStoryModal } from './components/stories/CreateStoryModal';
import { InstallPWA } from './components/InstallPWA';
import { SettingsPage } from './components/settings/SettingsPage';
import { MobileMenu } from './components/MobileMenu';

const AppContent: React.FC = () => {
  const { 
    currentUser, 
    users,
    notifications,
    messages,
    theme, 
    toggleTheme, 
    handleLogout,
    storyViewerState,
    handleCloseStoryViewer,
    storiesByAuthor,
    handleMarkAsSeen,
    isCreateStoryModalOpen,
    setCreateStoryModalOpen
  } = useData();
  const { page, params } = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const renderView = () => {
    switch(page) {
      case 'profile':
        return <ProfilePage userId={params.id} />;
      case 'auth':
        return <AuthPage />;
      case 'chat':
        return <ChatPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'search':
        return <SearchPage />;
      case 'groups':
        return <GroupsPage />;
      case 'advertise':
        return <AdvertisePage />;
      case 'settings':
        return <SettingsPage />;
      case 'feed':
      default:
        return <Feed />;
    }
  }
  
  const isAuthPage = page === 'auth';

  if (!currentUser && !isAuthPage && !['feed', 'profile', 'search'].includes(page)) {
     window.location.hash = '#/auth';
     return null;
  }

  return (
    <div className={`bg-background min-h-screen text-text-primary ${isAuthPage ? '' : 'pt-28 pb-16 md:pb-0'}`}>
      {!isAuthPage && (
        <Header 
          currentUser={currentUser}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={handleLogout}
          unreadCount={unreadNotifications}
        />
      )}

      <main className="max-w-screen-xl mx-auto px-2 sm:px-4">
        {isAuthPage ? (
          renderView()
        ) : (
          <div className="grid grid-cols-12 gap-4">
            <div className="hidden md:block md:col-span-3">
              <LeftSidebar currentUser={currentUser} />
            </div>
            <div className="col-span-12 md:col-span-6">
              {renderView()}
            </div>
            <div className="hidden md:block md:col-span-3">
              <RightSidebar />
            </div>
          </div>
        )}
      </main>
      
      {!isAuthPage && (
        <BottomNav
          activePage={page}
          unreadNotifications={unreadNotifications}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
      )}
      
      {isMobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}

      {currentUser && !isAuthPage && (
        <ChatLauncher
          currentUser={currentUser}
          users={users}
          messages={messages}
        />
      )}

      {storyViewerState.isOpen && storyViewerState.authorId && (
        <StoryViewer 
            userStoryGroups={storiesByAuthor}
            initialAuthorId={storyViewerState.authorId}
            onClose={handleCloseStoryViewer}
            onMarkAsSeen={handleMarkAsSeen}
        />
      )}

      {isCreateStoryModalOpen && (
          <CreateStoryModal onClose={() => setCreateStoryModalOpen(false)} />
      )}

      <InstallPWA />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;