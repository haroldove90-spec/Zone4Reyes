
import React, { useState, useEffect, useMemo, useCallback } from 'react';
// FIX: Renamed Notification to AppNotification to avoid conflict with DOM type
import { User, Post, Message, AppNotification, Group, Advertisement, Story, Comment, UserSettings } from './types';
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
import { SettingsPage } from './components/settings/SettingsPage';

type View = 'feed' | 'profile' | 'auth' | 'notifications' | 'chat' | 'groups' | 'advertise' | 'search' | 'settings' | 'menu';

type ViewData = {
  user?: User;
  group?: Group;
  query?: string;
  targetUser?: User;
}

// Helper to safely parse JSON from localStorage, isolating failures.
// FIX: Added a trailing comma inside the generic <T,> to prevent the TSX parser from misinterpreting it as a JSX tag. This resolves a large number of cascading parse errors.
const safeJSONParse = <T,>(key: string, fallback: T): T => {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    try {
        return JSON.parse(item) as T;
    } catch (e) {
        console.error(`CRITICAL: Failed to parse '${key}' from localStorage. Data may be corrupt. Resetting '${key}' to its default.`, e);
        localStorage.removeItem(key); // Clear the corrupted item to prevent future errors.
        return fallback;
    }
};

/**
 * ATTENTION: CRITICAL FIX IMPLEMENTED
 * This function has been completely rewritten to definitively solve the user and
 * credential persistence failure. The previous implementation was brittle and would
 * reset the entire application state if any part of the stored data was corrupt.
 *
 * The new robust implementation ensures:
 * 1.  **Isolated Parsing**: Each piece of state (users, posts, etc.) is parsed
 *     from localStorage in its own try-catch block. Corruption in one part (e.g., posts)
 *     will NOT affect others (e.g., users).
 * 2.  **Graceful Fallbacks**: If a piece of data fails to parse, only that specific
 *     piece is reset to its default, preventing a total data wipe. A critical error
 *     is logged, and the corrupted data is cleared to prevent future errors.
 * 3.  **Credential Verification**: When loading the current user session, it now explicitly
 *     checks for the existence of the `password` field on the loaded user object. If
 *     the user data is somehow incomplete, the session is safely invalidated. This
 *     directly addresses the "forgotten keys/credentials" issue.
 * 4.  **Flexible Session Storage**: It now checks both `localStorage` (for "Remember Me" sessions)
 *     and `sessionStorage` (for temporary sessions) to restore the user's logged-in state.
 */
function getInitialState() {
  // 1. Load users with robust parsing. This is the most critical part.
  const users: User[] = safeJSONParse('users', initialUsers);
  const usersMap = new Map(users.map(u => [u.id, u]));

  // 2. Load and re-hydrate posts, using the reliably-loaded user data.
  const rawPosts = safeJSONParse<Post[] | null>('posts', null);
  const posts: Post[] = rawPosts
    ? rawPosts.map(post => ({
        ...post,
        author: usersMap.get(post.author.id) || post.author,
        comments: post.comments.map(comment => ({
          ...comment,
          author: usersMap.get(comment.author.id) || comment.author,
        }))
      }))
    : initialPosts(users);

  // 3. Load other data slices with the same robust pattern.
  const messages: Message[] = safeJSONParse('messages', initialMessages);
  // FIX: Renamed Notification to AppNotification to avoid conflict with DOM type
  const rawNotifications = safeJSONParse<AppNotification[] | null>('notifications', null);
  const notifications: AppNotification[] = rawNotifications
    ? rawNotifications.map(notif => ({
        ...notif,
        actor: usersMap.get(notif.actor.id) || notif.actor,
      }))
    : initialNotifications(users);

  // 4. Get current user ID from persistent or session storage and find the full user object.
  let currentUser: User | null = null;
  const persistentUserId = localStorage.getItem('currentUserId');
  const sessionUserId = sessionStorage.getItem('currentUserId');
  const savedUserId = persistentUserId || sessionUserId; // Prioritize persistent session

  if (savedUserId) {
    const foundUser = users.find(u => u.id === savedUserId);
    if (foundUser && foundUser.isActive) {
      // CRITICAL CHECK: Ensure the loaded user data includes credentials.
      if (foundUser.password) {
        currentUser = foundUser;
      } else {
        console.warn(`User ${foundUser.id} was found, but their data is incomplete (missing password). Invalidating session for security.`);
        localStorage.removeItem('currentUserId');
        sessionStorage.removeItem('currentUserId');
      }
    }
  }

  // 5. Initialize other non-persistent data.
  const advertisements = initialAdvertisements(users);
  const stories = initialStories(users).filter(s => s.timestamp > Date.now() - 24 * 60 * 60 * 1000);

  return { users, posts, currentUser, messages, notifications, advertisements, stories };
}


// Run it once when the module loads.
const initialState = getInitialState();

// FIX: Changed App to a named export.
export const App: React.FC = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  const [users, setUsers] = useState<User[]>(initialState.users);
  const [posts, setPosts] = useState<Post[]>(initialState.posts);
  const [messages, setMessages] = useState<Message[]>(initialState.messages);
  // FIX: Renamed Notification to AppNotification to avoid conflict with DOM type
  const [notifications, setNotifications] = useState<AppNotification[]>(initialState.notifications);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(initialState.advertisements);
  const [stories, setStories] = useState<Story[]>(initialState.stories);
  const [currentUser, setCurrentUser] = useState<User | null>(initialState.currentUser);

  const [activeView, setActiveView] = useState<View>('feed');
  const [viewData, setViewData] = useState<ViewData | null>(null);

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [seenStories, setSeenStories] = useState<Set<string>>(new Set());
  
  const [storyViewerState, setStoryViewerState] = useState<{ isOpen: boolean; authorId?: string }>({ isOpen: false });
  const [isCreateStoryModalOpen, setCreateStoryModalOpen] = useState(false);

  const usersMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);
  
  // --- STATE PERSISTENCE ---
  const saveDataToStorage = useCallback((newState: { users?: User[], posts?: Post[], messages?: Message[], notifications?: AppNotification[] }) => {
    try {
        if (newState.users) {
            localStorage.setItem('users', JSON.stringify(newState.users));
        }
        if (newState.posts) {
            localStorage.setItem('posts', JSON.stringify(newState.posts));
        }
        if (newState.messages) {
            localStorage.setItem('messages', JSON.stringify(newState.messages));
        }
        if (newState.notifications) {
            localStorage.setItem('notifications', JSON.stringify(newState.notifications));
        }
    } catch (e) {
        console.error("CRITICAL: Failed to save app state to localStorage.", e);
    }
  }, []);

  // Sync state across tabs
  useEffect(() => {
    const syncTabs = (event: StorageEvent) => {
        if (['users', 'posts', 'messages', 'notifications', 'currentUserId'].includes(event.key || '')) {
            console.log('Reloading tab to sync storage changes.');
            window.location.reload();
        }
    };
    window.addEventListener('storage', syncTabs);
    return () => window.removeEventListener('storage', syncTabs);
  }, []);

  // Theme management
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');

  // Notifications
  const handleMarkNotificationsAsRead = useCallback(() => {
    setTimeout(() => {
      const newNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(newNotifications);
      saveDataToStorage({ notifications: newNotifications });
    }, 500);
  }, [notifications, saveDataToStorage]);

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
  const handleLogin = async (name: string, password: string, rememberMe: boolean): Promise<void> => {
    const user = users.find(u => u.name === name && u.password === password);
    if (user) {
      if (!user.isActive) {
        throw new Error('Esta cuenta ha sido desactivada.');
      }
      setCurrentUser(user);
      // Persist session based on "Remember Me" choice
      if (rememberMe) {
          localStorage.setItem('currentUserId', user.id);
      } else {
          sessionStorage.setItem('currentUserId', user.id);
      }
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
          isActive: true,
          blockedUserIds: [],
          settings: {
            account: { email: '' },
            privacy: { postVisibility: 'public', profileVisibility: 'public', messagePrivacy: 'public', searchPrivacy: 'public' },
            notifications: { likes: true, comments: true, mentions: true, messages: true, groupUpdates: true },
            general: { language: 'es' },
          }
      };
      const newUsers = [...users, newUser];
      setUsers(newUsers);
      setCurrentUser(newUser);
      
      // Explicitly save state
      saveDataToStorage({ users: newUsers });
      // By default, new registrations are persistent sessions
      localStorage.setItem('currentUserId', newUser.id);
      handleNavigate('feed');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
    sessionStorage.removeItem('currentUserId');
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
    const newPosts = [newPost, ...posts];
    setPosts(newPosts);
    saveDataToStorage({ posts: newPosts });
  };
  
  // Post Interactions
  const handleToggleLike = (postId: string) => {
    const newPosts = posts.map(p => {
      if (p.id === postId) {
        const isLiked = likedPosts.has(postId);
        return { ...p, likes: p.likes + (isLiked ? -1 : 1) };
      }
      return p;
    });
    setPosts(newPosts);
    saveDataToStorage({ posts: newPosts });

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
    const newPosts = posts.map(p => 
      p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    );
    setPosts(newPosts);
    saveDataToStorage({ posts: newPosts });
  };
  
  const handleSharePost = (postId: string) => {
     const newPosts = posts.map(p => 
      p.id === postId ? { ...p, shares: p.shares + 1 } : p
    );
    setPosts(newPosts);
    saveDataToStorage({ posts: newPosts });
  };
  
  // Profile & Settings
  const handleUpdateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updatedData };

    // Calculate all new states based on the single user update
    const newUsers = users.map(u => (u.id === updatedUser.id ? updatedUser : u));
    const newPosts = posts.map(post => {
        const newPost = post.author.id === updatedUser.id ? { ...post, author: updatedUser } : post;
        const newComments = newPost.comments.map(comment =>
          comment.author.id === updatedUser.id ? { ...comment, author: updatedUser } : comment
        );
        return { ...newPost, comments: newComments };
    });
    const newStories = stories.map(story => (story.author.id === updatedUser.id ? { ...story, author: updatedUser } : story));
    const newAds = advertisements.map(ad => (ad.author.id === updatedUser.id ? { ...ad, author: updatedUser } : ad));
    const newNotifs = notifications.map(notif => (notif.actor.id === updatedUser.id ? { ...notif, actor: updatedUser } : notif));
    
    // Set all states
    setCurrentUser(updatedUser);
    setUsers(newUsers);
    setPosts(newPosts);
    setStories(newStories);
    setAdvertisements(newAds);
    setNotifications(newNotifs);

    // Save all updated persistent states
    saveDataToStorage({ users: newUsers, posts: newPosts, notifications: newNotifs });
  };

  const handleUpdateUserSettings = (updatedSettings: Partial<UserSettings>) => {
     if (!currentUser) return;
     const newSettings = {
        ...currentUser.settings,
        ...updatedSettings,
        account: { ...currentUser.settings.account, ...updatedSettings.account },
        privacy: { ...currentUser.settings.privacy, ...updatedSettings.privacy },
        notifications: { ...currentUser.settings.notifications, ...updatedSettings.notifications },
        general: { ...currentUser.settings.general, ...updatedSettings.general },
     };
     handleUpdateProfile({ settings: newSettings });
  };

  const handleChangePassword = (newPassword: string) => {
    handleUpdateProfile({ password: newPassword });
  };

  const handleDeactivateAccount = () => {
    handleUpdateProfile({ isActive: false });
    handleLogout();
  };
  
  const handleDeleteAccount = () => {
    if (!currentUser) return;
    const newUsers = users.filter(u => u.id !== currentUser.id);
    setUsers(newUsers);
    saveDataToStorage({ users: newUsers });
    handleLogout();
  };

  const handleUpdateAvatar = (base64: string) => handleUpdateProfile({ avatarUrl: base64 });
  const handleUpdateCover = (base64: string) => handleUpdateProfile({ coverUrl: base64 });

  // Friends
  const handleAddFriend = (friendId: string) => {
    if (!currentUser) return;
    const friendUser = users.find(u => u.id === friendId);
    if (!friendUser) return;

    // Calculate new state for current user
    const newFriendIds = [...(currentUser.friendIds || []), friendId];
    const updatedCurrentUser = { ...currentUser, friendIds: newFriendIds };

    // Calculate new state for the whole users array
    const newUsers = users.map(u => {
        if (u.id === updatedCurrentUser.id) return updatedCurrentUser;
        if (u.id === friendId) return { ...u, friendIds: [...(u.friendIds || []), updatedCurrentUser.id] };
        return u;
    });

    // Create notification
    const newNotification: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'friend_request',
        actor: friendUser,
        message: 'ahora es tu amigo.',
        read: false,
        timestamp: Date.now(),
    };
    const newNotifications = [newNotification, ...notifications];

    // Update state
    setCurrentUser(updatedCurrentUser);
    setUsers(newUsers);
    setNotifications(newNotifications);

    // Persist
    saveDataToStorage({ users: newUsers, notifications: newNotifications });
  };

  const handleRemoveFriend = (friendId: string) => {
    if (!currentUser) return;

    // Calculate new state for current user
    const newFriendIds = (currentUser.friendIds || []).filter(id => id !== friendId);
    const updatedCurrentUser = { ...currentUser, friendIds: newFriendIds };

    // Calculate new state for the whole users array
    const newUsers = users.map(u => {
        if (u.id === updatedCurrentUser.id) return updatedCurrentUser;
        if (u.id === friendId) return { ...u, friendIds: (u.friendIds || []).filter(id => id !== updatedCurrentUser.id) };
        return u;
    });

    // Update state
    setCurrentUser(updatedCurrentUser);
    setUsers(newUsers);

    // Persist
    saveDataToStorage({ users: newUsers });
  };
  
  const handleBlockUser = (userIdToBlock: string) => {
    handleUpdateProfile({
        blockedUserIds: [...(currentUser?.blockedUserIds || []), userIdToBlock]
    });
  };
  
  const handleUnblockUser = (userIdToUnblock: string) => {
      handleUpdateProfile({
          blockedUserIds: (currentUser?.blockedUserIds || []).filter(id => id !== userIdToUnblock)
      });
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
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    
    // Create a notification for the recipient.
    const newNotification: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'message',
        actor: currentUser,
        message: `te ha enviado un mensaje.`,
        read: false,
        timestamp: Date.now(),
    };
    const newNotifications = [newNotification, ...notifications];
    setNotifications(newNotifications);
    
    // Persist
    saveDataToStorage({ messages: newMessages, notifications: newNotifications });
  };
  
  const handleMarkMessagesAsRead = (conversationId: string) => {
     if(!currentUser) return;
     const newMessages = messages.map(m => {
        const otherUserId = m.senderId === currentUser.id ? m.receiverId : m.senderId;
        const currentConvoId = [currentUser.id, otherUserId].sort().join('-');
        if (currentConvoId === conversationId && m.receiverId === currentUser.id) {
            return { ...m, read: true };
        }
        return m;
     });
     setMessages(newMessages);
     saveDataToStorage({ messages: newMessages });
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
          const profileUser = currentUser?.id === viewData.user.id ? currentUser : viewData.user;
          const userPosts = posts.filter(p => p.author.id === profileUser.id);
          return <ProfilePage 
            user={profileUser} 
            posts={userPosts}
            isCurrentUser={currentUser?.id === profileUser.id}
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
        />;
       case 'settings':
         if (!currentUser) return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
         return <SettingsPage
            currentUser={currentUser}
            users={users}
            onUpdateSettings={handleUpdateUserSettings}
            onChangePassword={handleChangePassword}
            onDeactivateAccount={handleDeactivateAccount}
            onDeleteAccount={handleDeleteAccount}
            onBlockUser={handleBlockUser}
            onUnblockUser={handleUnblockUser}
            onNavigate={handleNavigate}
            toggleTheme={toggleTheme}
         />;
      case 'menu':
        // On mobile, the menu view re-uses the LeftSidebar component
        return <div className="md:hidden"><LeftSidebar currentUser={currentUser} onNavigate={(view, data) => handleNavigate(view as View, { user: data as User })} /></div>;
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
        {activeView === 'auth' || activeView === 'settings' ? (
          renderContent()
        ) : (
          <div className="grid grid-cols-12 gap-4">
            <div className="hidden md:block md:col-span-3">
              <LeftSidebar currentUser={currentUser} onNavigate={(view, data) => handleNavigate(view as View, { user: data as User })} />
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
