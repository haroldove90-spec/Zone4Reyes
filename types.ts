export interface UserSettings {
  account: {
    email?: string;
    phone?: string;
  };
  privacy: {
    postVisibility: 'public' | 'friends' | 'only_me';
    profileVisibility: 'public' | 'friends';
    messagePrivacy: 'public' | 'friends';
    searchPrivacy: 'public' | 'friends';
  };
  notifications: {
    likes: boolean;
    comments: boolean;
    mentions: boolean;
    messages: boolean;
    groupUpdates: boolean;
  };
  general: {
    language: 'es' | 'en';
  };
}


export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
  password?: string; // Added for authentication
  coverUrl?: string;
  bio?: string;
  info?: {
    work?: string;
    education?: string;
    location?: string;
    contact?: string;
  };
  friendIds?: string[];
  photos?: string[];
  groups?: GroupMembership[];
  settings: UserSettings;
  blockedUserIds?: string[];
  isActive: boolean;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
}

export interface Post {
  id:string;
  author: User;
  timestamp: string;
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  } | null;
  likes: number;
  comments: Comment[];
  shares: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: [string, string];
  lastMessage: Message;
}

export type NotificationType = 'like' | 'comment' | 'share' | 'mention' | 'message' | 'group_join_request' | 'friend_request';

// FIX: Renamed Notification to AppNotification to avoid naming conflicts with the browser's built-in Notification API.
export interface AppNotification {
  id:string;
  type: NotificationType;
  actor: User;
  postId?: string; // The post that was interacted with
  groupId?: string; // For group-related notifications
  message?: string; // A short message for the notification
  read: boolean;
  timestamp: number;
}

export interface GroupMembership {
    groupId: string;
    role: 'admin' | 'member';
}

export interface Group {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
    privacy: 'public' | 'private';
    members: { userId: string; role: 'admin' | 'member' }[];
    posts?: Post[]; // Posts specific to this group
}

export interface Advertisement {
  id: string;
  author: User;
  type: 'flyer' | 'content' | 'video';
  title: string;
  description: string;
  mediaUrl?: string; // For flyer image or video
  category: 'Servicios' | 'Productos' | 'Eventos' | 'Ofertas';
  timestamp: number;
}

export interface Story {
  id: string;
  author: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  timestamp: number;
}
