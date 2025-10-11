
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  User,
  Post,
  Message,
  AppNotification,
  Group,
  Advertisement,
  Story,
  Navigate,
  UserSettings,
} from '../types';
import {
  initialMessages,
  initialNotifications,
} from '../initialData'; // Some mock data might still be used for non-persistent features

interface DataContextType {
  theme: string;
  toggleTheme: () => void;
  currentUser: User | null;
  users: User[];
  posts: Post[];
  messages: Message[];
  notifications: AppNotification[];
  groups: Group[];
  advertisements: Advertisement[];
  stories: Story[];
  likedPosts: Set<string>;
  seenStories: Set<string>;
  storyViewerState: { isOpen: boolean; authorId: string | null };
  isCreateStoryModalOpen: boolean;
  setCreateStoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingFeed: boolean;
  feedError: React.ReactNode | null;
  storiesByAuthor: { author: User; stories: Story[] }[];
  
  // Handlers
  handleLogin: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  handleLogout: () => void;
  handleRegister: (name: string, email: string, password: string) => Promise<User>;
  handleVerifyEmail: (userId: string) => Promise<void>;
  handleCreatePost: (content: string, media: { type: 'image' | 'video'; url: string } | null) => void;
  handleToggleLike: (postId: string) => void;
  handleAddComment: (postId: string, commentContent: string) => void;
  handleSharePost: (postId: string) => void;
  handleViewStory: (authorId: string) => void;
  handleCreateStory: (media: { type: 'image' | 'video'; url: string }) => void;
  handleCloseStoryViewer: () => void;
  handleMarkAsSeen: (storyId: string) => void;
  handleUpdateProfile: (updatedData: Partial<User>) => void;
  handleSendMessage: (receiverId: string, content: string) => void;
  handleMarkMessagesAsRead: (conversationId: string) => void;
  handleUpdateSettings: (updatedSettings: Partial<UserSettings>) => void;
  handleChangePassword: (newPassword: string) => void;
  handleDeactivateAccount: () => void;
  handleDeleteAccount: () => void;
  handleBlockUser: (userId: string) => void;
  handleUnblockUser: (userId: string) => void;
  handleCreateGroup: (name: string, description: string, privacy: 'public' | 'private') => void;
  handleJoinGroup: (groupId: string) => void;
  handleCreateAdvertisement: (adData: Omit<Advertisement, 'id' | 'author' | 'timestamp'>) => void;
  
  // Navigation
  navigate: (path: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
  
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoadingFeed, setIsLoadingFeed] = useState(true);
    const [feedError, setFeedError] = useState<React.ReactNode | null>(null);
  
    const [messages, setMessages] = useState<Message[]>([]);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [seenStories, setSeenStories] = useState<Set<string>>(new Set());
    const [storyViewerState, setStoryViewerState] = useState<{ isOpen: boolean; authorId: string | null }>({ isOpen: false, authorId: null });
    const [isCreateStoryModalOpen, setCreateStoryModalOpen] = useState(false);
  
    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setTheme('dark');
        } else {
            document.documentElement.classList.remove('dark');
            setTheme('light');
        }
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoadingFeed(true);
            setFeedError(null);
            try {
                const [usersRes, postsRes, storiesRes] = await Promise.all([
                    fetch('/api/users'),
                    fetch('/api/posts'),
                    fetch('/api/stories'),
                ]);

                if (!usersRes.ok || !postsRes.ok || !storiesRes.ok) {
                    throw new Error('Failed to fetch initial data from API');
                }
                
                const { users: fetchedUsers } = await usersRes.json();
                const { posts: fetchedPosts } = await postsRes.json();
                const { stories: fetchedStories } = await storiesRes.json();
                
                setUsers(fetchedUsers);
                setPosts(fetchedPosts);
                setStories(fetchedStories.filter((story: Story) => Date.now() - story.timestamp < 24 * 60 * 60 * 1000));
                
                // Keep some mock data for features not yet migrated
                setNotifications(initialNotifications(fetchedUsers));
                setMessages(initialMessages);

            } catch (error) {
                console.error("Error fetching data from API:", error);
                setFeedError(
                    <>
                        <strong className="font-bold">Error de Conexión.</strong>
                        <span className="block sm:inline"> No se pudo conectar a la base de datos. Por favor, revisa tu conexión o la configuración del servidor.</span>
                    </>
                );
            } finally {
                setIsLoadingFeed(false);
            }
        };

        fetchInitialData();
    }, []);

    const toggleTheme = () => {
        if (theme === 'light') {
            localStorage.theme = 'dark';
            document.documentElement.classList.add('dark');
            setTheme('dark');
        } else {
            localStorage.theme = 'light';
            document.documentElement.classList.remove('dark');
            setTheme('light');
        }
    };

    useEffect(() => {
        const savedUserId = localStorage.getItem('currentUser');
        if (savedUserId && users.length > 0) {
            const user = users.find(u => u.id === savedUserId);
            if (user) setCurrentUser(user);
        }
    }, [users]);
    
    const navigate = useCallback((path: string) => {
      window.location.hash = `#/${path}`;
    }, []);

    const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
        const user = users.find(u => u.settings.account.email === email && u.password === password);
        if (user) {
            if (!user.isVerified) throw new Error('Por favor, verifica tu correo electrónico.');
            setCurrentUser(user);
            if (rememberMe) localStorage.setItem('currentUser', user.id);
            navigate('feed');
        } else {
            throw new Error('Correo o contraseña incorrectos.');
        }
    };

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        navigate('feed');
    }, [navigate]);

    const handleRegister = async (name: string, email: string, password: string): Promise<User> => {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to register.');
        }
        
        const newUser = data.user;
        
        setUsers(prevUsers => [...prevUsers, newUser]);
        
        return newUser;
    };
    
    const handleVerifyEmail = async (userId: string) => {
       const user = users.find(u => u.id === userId);
       if(user) {
            const verifiedUser = {...user, isVerified: true};
            setUsers(users => users.map(u => u.id === userId ? verifiedUser : u));
            setCurrentUser(verifiedUser);
            localStorage.setItem('currentUser', verifiedUser.id);
            navigate('feed');
       } else {
           throw new Error("Usuario no encontrado para verificar.");
       }
    };
    
    const handleCreatePost = async (content: string, media: { type: 'image' | 'video'; url: string } | null) => {
        if (!currentUser) return;

        // Optimistic update
        const tempId = `temp-post-${Date.now()}`;
        const newPost: Post = {
          id: tempId,
          author: currentUser,
          timestamp: 'Ahora mismo',
          content, media, likes: 0, comments: [], shares: 0
        };
        setPosts(prevPosts => [newPost, ...prevPosts]);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, media, authorId: currentUser.id }),
            });
            if (!response.ok) throw new Error('Failed to create post');
            
            const { post: createdPost } = await response.json();
            // Replace temporary post with the real one from the server
            setPosts(prevPosts => prevPosts.map(p => p.id === tempId ? createdPost : p));

        } catch (error) {
            console.error("Error creating post:", error);
            // Rollback optimistic update
            setPosts(prevPosts => prevPosts.filter(p => p.id !== tempId));
            alert("Error al publicar. Inténtalo de nuevo.");
        }
    };
      
    const handleToggleLike = (postId: string) => {
        if (!currentUser) { navigate('auth'); return; }
        const isLiked = likedPosts.has(postId);
        
        // Optimistic update
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          isLiked ? newSet.delete(postId) : newSet.add(postId);
          return newSet;
        });
        setPosts(prevPosts => prevPosts.map(p => 
            p.id === postId ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p
        ));
        
        // API call in background
        fetch(`/api/posts/${postId}/like`, { method: 'POST' }).catch(error => {
            console.error("Error toggling like:", error);
            // Rollback optimistic update
             setLikedPosts(prev => {
                const newSet = new Set(prev);
                isLiked ? newSet.add(postId) : newSet.delete(postId);
                return newSet;
            });
            setPosts(prevPosts => prevPosts.map(p => 
                p.id === postId ? { ...p, likes: isLiked ? p.likes + 1 : p.likes - 1 } : p
            ));
        });
    };
    
    const handleAddComment = (postId: string, commentContent: string) => {
        if (!currentUser) { navigate('auth'); return; }
        const newComment = { id: `c-${Date.now()}`, author: currentUser, content: commentContent, timestamp: 'Ahora mismo' };
        setPosts(prevPosts => prevPosts.map(p => 
            p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
        ));
    };

    const handleSharePost = (postId: string) => {
        if (!currentUser) return;
        setPosts(prevPosts => prevPosts.map(p => 
            p.id === postId ? { ...p, shares: p.shares + 1 } : p
        ));
    };

    const handleViewStory = (authorId: string) => setStoryViewerState({ isOpen: true, authorId });
    const handleCloseStoryViewer = () => setStoryViewerState({ isOpen: false, authorId: null });
    const handleMarkAsSeen = (storyId: string) => setSeenStories(prev => new Set(prev).add(storyId));
    
    const handleCreateStory = (media: { type: 'image' | 'video'; url: string }) => {
        if (!currentUser) return;
        const newStory: Story = {
            id: `story-${Date.now()}`,
            author: currentUser,
            mediaUrl: media.url,
            mediaType: media.type,
            timestamp: Date.now()
        };
        setStories(prev => [newStory, ...prev]);
        setCreateStoryModalOpen(false);
    };

    const handleUpdateProfile = useCallback((updatedData: Partial<User>) => {
        if (!currentUser) return;
        const updatedUser = { ...currentUser, ...updatedData };
        setCurrentUser(updatedUser);
        setUsers(users => users.map(u => u.id === currentUser.id ? updatedUser : u));
    }, [currentUser]);

    const handleSendMessage = (receiverId: string, content: string) => {
        if (!currentUser) return;
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id, receiverId, content,
          timestamp: Date.now(), read: false,
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleMarkMessagesAsRead = (conversationId: string) => {
        if (!currentUser) return;
        setMessages(msgs => msgs.map(m => {
            const conversationKey = [m.senderId, m.receiverId].sort().join('-');
            if (conversationKey === conversationId && m.receiverId === currentUser.id) {
                return { ...m, read: true };
            }
            return m;
        }))
    };
    
    const handleUpdateSettings = useCallback((updatedSettings: Partial<UserSettings>) => {
        if (!currentUser) return;
        
        const newSettings: UserSettings = {
            ...currentUser.settings,
            ...updatedSettings,
            account: { ...currentUser.settings.account, ...updatedSettings.account },
            privacy: { ...currentUser.settings.privacy, ...updatedSettings.privacy },
            notifications: { ...currentUser.settings.notifications, ...updatedSettings.notifications },
            general: { ...currentUser.settings.general, ...updatedSettings.general },
        };

        handleUpdateProfile({ settings: newSettings });
    }, [currentUser, handleUpdateProfile]);

    const handleChangePassword = useCallback((newPassword: string) => {
        if (!currentUser) return;
        handleUpdateProfile({ password: newPassword });
    }, [currentUser, handleUpdateProfile]);

    const handleDeactivateAccount = useCallback(() => {
        if (!currentUser) return;
        handleUpdateProfile({ isActive: false });
        handleLogout();
    }, [currentUser, handleUpdateProfile, handleLogout]);

    const handleDeleteAccount = useCallback(() => {
        if (!currentUser) return;
        setUsers(users => users.filter(u => u.id !== currentUser.id));
        handleLogout();
    }, [currentUser, handleLogout]);

    const handleBlockUser = useCallback((userId: string) => {
        if (!currentUser) return;
        handleUpdateProfile({
            blockedUserIds: [...new Set([...(currentUser.blockedUserIds || []), userId])]
        });
    }, [currentUser, handleUpdateProfile]);

    const handleUnblockUser = useCallback((userId: string) => {
        if (!currentUser) return;
        handleUpdateProfile({
            blockedUserIds: (currentUser.blockedUserIds || []).filter(id => id !== userId)
        });
    }, [currentUser, handleUpdateProfile]);

    const handleCreateGroup = useCallback((name: string, description: string, privacy: 'public' | 'private') => {
        if (!currentUser) return;
        const newGroup: Group = {
            id: `group-${Date.now()}`,
            name,
            description,
            coverUrl: `https://picsum.photos/seed/${Date.now()}/800/200`,
            privacy,
            members: [{ userId: currentUser.id, role: 'admin' }],
        };
        setGroups(prev => [newGroup, ...prev]);
    }, [currentUser]);

    const handleJoinGroup = useCallback((groupId: string) => {
        if (!currentUser) { navigate('auth'); return; }
        setGroups(prevGroups => prevGroups.map(g => 
            g.id === groupId 
            ? { ...g, members: [...g.members, { userId: currentUser.id, role: 'member'}] } 
            : g
        ));
    }, [currentUser, navigate]);
    
    const handleCreateAdvertisement = useCallback((adData: Omit<Advertisement, 'id' | 'author' | 'timestamp'>) => {
        if(!currentUser) return;
        const newAd: Advertisement = {
            ...adData,
            id: `ad-${Date.now()}`,
            author: currentUser,
            timestamp: Date.now(),
        };
        setAdvertisements(prev => [newAd, ...prev]);
    }, [currentUser]);

    const storiesByAuthor = useMemo(() => {
        const grouped: Record<string, { author: User; stories: Story[] }> = {};
        stories.forEach(story => {
          if (!grouped[story.author.id]) {
            grouped[story.author.id] = { author: story.author, stories: [] };
          }
          grouped[story.author.id].stories.push(story);
        });
        return Object.values(grouped);
    }, [stories]);

    const value = {
        theme, toggleTheme, currentUser, users, posts, messages, notifications,
        groups, advertisements, stories, likedPosts, seenStories,
        storyViewerState, isCreateStoryModalOpen, setCreateStoryModalOpen,
        isLoadingFeed, feedError, storiesByAuthor,
        handleLogin, handleLogout, handleRegister, handleVerifyEmail,
        handleCreatePost, handleToggleLike, handleAddComment, handleSharePost,
        handleViewStory, handleCreateStory, handleCloseStoryViewer, handleMarkAsSeen,
        handleUpdateProfile, handleSendMessage, handleMarkMessagesAsRead,
        handleUpdateSettings, handleChangePassword, handleDeactivateAccount,
        handleDeleteAccount, handleBlockUser, handleUnblockUser,
        handleCreateGroup, handleJoinGroup, handleCreateAdvertisement,
        navigate,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
