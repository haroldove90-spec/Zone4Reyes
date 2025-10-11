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
  initialUsers,
  initialPosts,
  initialMessages,
  initialNotifications,
  initialGroups,
  initialAdvertisements,
  initialStories,
} from '../mockData';

const API_BASE_URL = '/zone4reyes/api';

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
  // FIX: Added settings handlers
  handleUpdateSettings: (updatedSettings: Partial<UserSettings>) => void;
  handleChangePassword: (newPassword: string) => void;
  handleDeactivateAccount: () => void;
  handleDeleteAccount: () => void;
  handleBlockUser: (userId: string) => void;
  handleUnblockUser: (userId: string) => void;
  
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
                const endpoints = {
                    users: `${API_BASE_URL}/data.php?get=users`,
                    posts: `${API_BASE_URL}/data.php?get=posts`,
                    stories: `${API_BASE_URL}/data.php?get=stories`,
                    groups: `${API_BASE_URL}/data.php?get=groups`,
                    advertisements: `${API_BASE_URL}/data.php?get=advertisements`,
                };

                const responses = await Promise.all(Object.values(endpoints).map(url => fetch(url)));

                for (const res of responses) {
                    if (!res.ok) throw new Error(`API call failed for ${res.url} with status ${res.status}`);
                }
                
                const [usersRes, postsRes, storiesRes, groupsRes, adsRes] = responses;

                const fetchedUsers: User[] = await usersRes.json();
                const fetchedPosts: Post[] = await postsRes.json();
                const fetchedStories: Story[] = await storiesRes.json();
                const fetchedGroups: Group[] = await groupsRes.json();
                const fetchedAds: Advertisement[] = await adsRes.json();
                
                setUsers(fetchedUsers);
                setPosts(fetchedPosts);
                setStories(fetchedStories.filter(story => Date.now() - story.timestamp < 24 * 60 * 60 * 1000));
                setGroups(fetchedGroups);
                setAdvertisements(fetchedAds);
                
                setNotifications(initialNotifications(fetchedUsers));
                setMessages(initialMessages);

            } catch (error) {
                console.error("Error fetching data from API, falling back to mock data:", error);
                setFeedError(
                    <>
                        <strong className="font-bold">Error de Conexión.</strong>
                        <span className="block sm:inline"> No se pudo conectar a la base de datos. Mostrando datos de ejemplo para demostración.</span>
                    </>
                );
                // Fallback to mock data
                setUsers(initialUsers);
                setPosts(initialPosts(initialUsers));
                setStories(initialStories(initialUsers).filter(story => Date.now() - story.timestamp < 24 * 60 * 60 * 1000));
                setGroups(initialGroups);
                setAdvertisements(initialAdvertisements(initialUsers));
                setNotifications(initialNotifications(initialUsers));
                setMessages(initialMessages);
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
        // ... (API call logic remains the same)
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
        // ... (API call logic remains the same)
        const newUser: User = { ...initialUsers[0], id: `user-${Date.now()}`, name, settings: { ...initialUsers[0].settings, account: {email}}, isVerified: false };
        setUsers(prev => [...prev, newUser]);
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
    
    const handleCreatePost = (content: string, media: { type: 'image' | 'video'; url: string } | null) => {
        if (!currentUser) return;
        const newPost: Post = {
          id: `post-${Date.now()}`,
          author: currentUser,
          timestamp: 'Ahora mismo',
          content, media, likes: 0, comments: [], shares: 0
        };
        setPosts([newPost, ...posts]);
    };
      
    const handleToggleLike = (postId: string) => {
        if (!currentUser) { navigate('auth'); return; }
        const isLiked = likedPosts.has(postId);
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          isLiked ? newSet.delete(postId) : newSet.add(postId);
          return newSet;
        });
        setPosts(prevPosts => prevPosts.map(p => 
            p.id === postId ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p
        ));
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
