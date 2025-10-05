import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Post, Message, Notification, Group, Advertisement, Story, Comment } from './types';
import { initialUsers, initialPosts, initialMessages, initialNotifications, initialGroups, initialAdvertisements, initialStories } from './mockData';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { Feed } from './components/Feed';
import { BottomNav } from './components/BottomNav';
import { AuthPage } from './components/AuthPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { ChatPage } from './components/ChatPage';
import { NotificationsPage } from './components/NotificationsPage';
import { GroupsPage } from './components/groups/GroupsPage';
import { AdvertisePage } from './components/AdvertisePage';
import { ChatLauncher } from './components/chat/ChatLauncher';
import { StoryViewer } from './components/stories/StoryViewer';
import { CreateStoryModal } from './components/stories/CreateStoryModal';
import { SearchPage } from './components/SearchPage';
import { InstallPWA } from './components/InstallPWA';

type View = 'feed' | 'profile' | 'auth' | 'notifications' | 'chat' | 'groups' | 'advertise' | 'search';

type ViewData = {
  user?: User;
  group?: Group;
  query?: string;
  targetUser?: User;
}

const App: React.FC = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  
  const [posts, setPosts] = useState<Post[]>(() => initialPosts(users));
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [notifications, setNotifications] = useState<Notification[]>(() => initialNotifications(users));
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => initialAdvertisements(users));
  const [stories, setStories] = useState<Story[]>(() => initialStories(users).filter(s => s.timestamp > Date.now() - 24 * 60 * 60 * 1000));

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const savedUsers = localStorage.getItem('users');
        const currentUsers = savedUsers ? JSON.parse(savedUsers) : initialUsers;
        return currentUsers.find((u: User) => u.id === parsedUser.id) || null;
    }
    return null;
  });

  const [activeView, setActiveView] = useState<View>('feed');
  const [viewData, setViewData] = useState<ViewData | null>(null);

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [seenStories, setSeenStories] = useState<Set<string>>(new Set());
  
  const [storyViewerState, setStoryViewerState] = useState<{ isOpen: boolean; authorId?: string }>({ isOpen: false });
  const [isCreateStoryModalOpen, setCreateStoryModalOpen] = useState(false);

  const usersMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);
  
  // Persist users to localStorage
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Theme management
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  // Notifications
  const handleMarkNotificationsAsRead = useCallback(() => {
    // A small delay feels more natural, allowing the user to briefly see the unread state
    setTimeout(() => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, 500);
  }, []);

  // Navigation
  const handleNavigate = useCallback((view: View, data?: any) => {
    if (view === 'notifications') {
        handleMarkNotificationsAsRead();
    }
    setActiveView(view);
    setViewData(data || null);
    window.scrollTo(0, 0);
  }, [handleMarkNotificationsAsRead]);

  // Auth
  const handleLogin = async (name: string, password: string): Promise<void> => {
    const user = users.find(u => u.name === name && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      handleNavigate('feed');
    } else {
      throw new Error('Nombre de usuario o contraseña incorrectos.');
    }
  };
  
  const handleRegister = async (name: string, password: string): Promise<void> => {
      if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
          throw new Error('El nombre de usuario ya existe.');
      }
      const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          password,
          avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
          profileUrl: '#',
          coverUrl: `https://picsum.photos/seed/${Date.now()}-cover/1000/300`,
          friendIds: [],
          photos: [],
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      handleNavigate('feed');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    handleNavigate('feed');
  };

  // Content Creation
  const handleCreatePost = (content: string, media: { type: 'image' | 'video'; url: string } | null) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: currentUser,
      timestamp: 'Ahora mismo',
      content,
      media,
      likes: 0,
      comments: [],
      shares: 0,
    };
    setPosts(prev => [newPost, ...prev]);
  };
  
  // Post Interactions
  const handleToggleLike = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === postId) {
        const isLiked = likedPosts.has(postId);
        return { ...p, likes: p.likes + (isLiked ? -1 : 1) };
      }
      return p;
    }));
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleAddComment = (postId: string, commentContent: string) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: currentUser,
      content: commentContent,
      timestamp: 'Ahora mismo',
    };
    setPosts(prevPosts => prevPosts.map(p => 
      p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    ));
  };
  
  const handleSharePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(p => 
      p.id === postId ? { ...p, shares: p.shares + 1 } : p
    ));
  };
  
  // Profile
  const handleUpdateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const handleUpdateAvatar = (base64: string) => handleUpdateProfile({ avatarUrl: base64 });
  const handleUpdateCover = (base64: string) => handleUpdateProfile({ coverUrl: base64 });

  // Friends
  const handleAddFriend = (friendId: string) => {
      if(!currentUser) return;
      handleUpdateProfile({ friendIds: [...(currentUser.friendIds || []), friendId] });
      // Also add current user to the other user's friend list
      setUsers(users.map(u => u.id === friendId ? { ...u, friendIds: [...(u.friendIds || []), currentUser.id]} : u));
  };

  const handleRemoveFriend = (friendId: string) => {
      if(!currentUser) return;
      handleUpdateProfile({ friendIds: (currentUser.friendIds || []).filter(id => id !== friendId) });
      setUsers(users.map(u => u.id === friendId ? { ...u, friendIds: (u.friendIds || []).filter(id => id !== currentUser.id)} : u));
  };
  
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  
  // Chat
  const handleSendMessage = (receiverId: string, content: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        receiverId,
        content,
        timestamp: Date.now(),
        read: false,
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  const handleMarkMessagesAsRead = (conversationId: string) => {
     if(!currentUser) return;
     setMessages(prev => prev.map(m => {
        const otherUserId = m.senderId === currentUser.id ? m.receiverId : m.senderId;
        const currentConvoId = [currentUser.id, otherUserId].sort().join('-');
        if (currentConvoId === conversationId && m.receiverId === currentUser.id) {
            return { ...m, read: true };
        }
        return m;
     }));
  };
  
  const onChatStarted = () => {
    setViewData(prev => {
        if (!prev || !prev.targetUser) return prev;
        const { targetUser, ...rest } = prev;
        return rest as ViewData;
    });
  };

  // Groups
  const handleCreateGroup = (name: string, description: string, privacy: 'public' | 'private') => {
      if (!currentUser) return;
      const newGroup: Group = {
          id: `group-${Date.now()}`,
          name,
          description,
          privacy,
          coverUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '-')}/1000/300`,
          members: [{ userId: currentUser.id, role: 'admin' }],
          posts: [],
      };
      setGroups(prev => [...prev, newGroup]);
  };

  const handleJoinGroup = (groupId: string) => {
      if (!currentUser) return;
      setGroups(prev => prev.map(g => {
          if (g.id === groupId && !g.members.some(m => m.userId === currentUser.id)) {
              return { ...g, members: [...g.members, { userId: currentUser.id, role: 'member' }]};
          }
          return g;
      }));
  };
  
  // Advertisements
  const handleCreateAdvertisement = (adData: Omit<Advertisement, 'id' | 'author' | 'timestamp'>) => {
      if (!currentUser) return;
      const newAd: Advertisement = {
          ...adData,
          id: `ad-${Date.now()}`,
          author: currentUser,
          timestamp: Date.now(),
      };
      setAdvertisements(prev => [newAd, ...prev]);
  };
  
  // Stories
  const handleViewStory = (authorId: string) => setStoryViewerState({ isOpen: true, authorId });
  const handleCloseStoryViewer = () => setStoryViewerState({ isOpen: false });
  const handleMarkStoryAsSeen = (storyId: string) => setSeenStories(prev => new Set(prev).add(storyId));
  const handleCreateStory = (media: { type: 'image' | 'video'; url: string }) => {
    if (!currentUser) return;
    const newStory: Story = {
        id: `story-${Date.now()}`,
        author: currentUser,
        mediaUrl: media.url,
        mediaType: media.type,
        timestamp: Date.now(),
    };
    setStories(prev => [newStory, ...prev]);
    setCreateStoryModalOpen(false);
  };
  
  // Search
  const handleSearch = (query: string) => {
      handleNavigate('search', { query });
  };
  
  const storiesByAuthor = useMemo(() => {
    const grouped: Record<string, { author: User, stories: Story[] }> = {};
    stories.forEach(story => {
      if (!grouped[story.author.id]) {
        grouped[story.author.id] = { author: story.author, stories: [] };
      }
      grouped[story.author.id].stories.push(story);
    });
    return Object.values(grouped);
  }, [stories]);

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        if (viewData?.user) {
          const userPosts = posts.filter(p => p.author.id === viewData.user?.id);
          return <ProfilePage 
            user={viewData.user} 
            posts={userPosts}
            isCurrentUser={currentUser?.id === viewData.user.id}
            onCreatePost={handleCreatePost}
            onViewProfile={(user) => handleNavigate('profile', { user })}
            currentUser={currentUser}
            onAddComment={handleAddComment}
            onToggleLike={handleToggleLike}
            onSharePost={handleSharePost}
            likedPosts={likedPosts}
            onUpdateAvatar={handleUpdateAvatar}
            onUpdateCover={handleUpdateCover}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={(view, data) => handleNavigate(view as View, data)}
            users={users}
            onAddFriend={handleAddFriend}
            onRemoveFriend={handleRemoveFriend}
          />;
        }
        return <Feed {...feedProps} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
      case 'notifications':
        return <NotificationsPage notifications={notifications} onNavigate={(view, user) => handleNavigate(view as View, { user })} />;
      case 'chat':
        if (!currentUser) return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
        return <ChatPage 
            currentUser={currentUser}
            users={users}
            messages={messages}
            onSendMessage={handleSendMessage}
            onViewProfile={(user) => handleNavigate('profile', { user })}
            onMarkMessagesAsRead={handleMarkMessagesAsRead}
            targetUser={viewData?.targetUser || null}
            onChatStarted={onChatStarted}
        />;
      case 'groups':
         if (!currentUser) return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
         return <GroupsPage currentUser={currentUser} groups={groups} onCreateGroup={handleCreateGroup} onJoinGroup={handleJoinGroup} usersMap={usersMap} />;
      case 'advertise':
         if (!currentUser) return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
         return <AdvertisePage currentUser={currentUser} advertisements={advertisements} onCreateAdvertisement={handleCreateAdvertisement} />;
      case 'search':
        return <SearchPage 
            initialQuery={viewData?.query || ''}
            users={users}
            posts={posts}
            groups={groups}
            onViewProfile={(user) => handleNavigate('profile', { user })}
            onNavigate={(view, data) => handleNavigate(view as View, data)}
            currentUser={currentUser}
            likedPosts={likedPosts}
            onAddComment={handleAddComment}
            onToggleLike={handleToggleLike}
            onSharePost={handleSharePost}
        />
      case 'feed':
      default:
        return <Feed {...feedProps} />;
    }
  };
  
  const feedProps = {
    posts: posts,
    stories: stories,
    seenStories: seenStories,
    onCreatePost: handleCreatePost,
    onViewProfile: (user: User) => handleNavigate('profile', { user }),
    currentUser: currentUser,
    onAddComment: handleAddComment,
    onToggleLike: handleToggleLike,
    onSharePost: handleSharePost,
    likedPosts: likedPosts,
    onNavigate: (view: any, data: any) => handleNavigate(view, data),
    users: users,
    onViewStory: handleViewStory,
    onCreateStory: () => setCreateStoryModalOpen(true),
  };

  const mainContentPadding = activeView === 'auth' ? 'pt-0' : 'pt-24 pb-24 md:pb-8';

  return (
    <div className={`bg-background min-h-screen font-sans ${theme}`}>
      {activeView !== 'auth' && (
        <Header 
          onNavigate={(view, user) => handleNavigate(view, { user })} 
          currentUser={currentUser} 
          theme={theme} 
          toggleTheme={toggleTheme} 
          onLogout={handleLogout}
          unreadCount={unreadNotificationsCount}
          onSearch={handleSearch}
        />
      )}
      <main className={`max-w-screen-xl mx-auto px-2 sm:px-4 ${mainContentPadding}`}>
        {activeView === 'auth' ? (
          renderContent()
        ) : (
          <div className="grid grid-cols-12 gap-4">
            <div className="hidden md:block md:col-span-3">
              <LeftSidebar currentUser={currentUser} onNavigate={(view, data) => handleNavigate(view as View, data)} />
            </div>
            <div className="col-span-12 md:col-span-9 lg:col-span-6">
              {renderContent()}
            </div>
            <div className="hidden lg:block lg:col-span-3">
              <RightSidebar />
            </div>
          </div>
        )}
      </main>
      {activeView !== 'auth' && (
        <BottomNav 
          onNavigate={(view, data) => handleNavigate(view as View, data)} 
          currentUser={currentUser}
          activeView={activeView as any}
          unreadNotifications={unreadNotificationsCount}
        />
      )}
      {currentUser && activeView !== 'chat' && (
         <ChatLauncher 
            currentUser={currentUser}
            users={users}
            messages={messages}
            onNavigate={(view, data) => handleNavigate(view as View, data)}
         />
      )}
       {storyViewerState.isOpen && storyViewerState.authorId && (
        <StoryViewer
          userStoryGroups={storiesByAuthor}
          initialAuthorId={storyViewerState.authorId}
          onClose={handleCloseStoryViewer}
          onMarkAsSeen={handleMarkStoryAsSeen}
        />
      )}
      {isCreateStoryModalOpen && (
        <CreateStoryModal onClose={() => setCreateStoryModalOpen(false)} onCreateStory={handleCreateStory} />
      )}
      <InstallPWA />
    </div>
  );
}

export default App;