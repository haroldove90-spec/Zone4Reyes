import React, { useState } from 'react';
import { Post, User, Group } from '../../types';
import { ProfileHeader } from './ProfileHeader';
import { ProfileNav } from './ProfileNav';
import { CreatePost } from '../CreatePost';
import { PostCard } from '../PostCard';
import { ProfileAbout } from './ProfileAbout';
import { ProfileFriends } from './ProfileFriends';
import { ProfilePhotos } from './ProfilePhotos';
import { EditProfileModal } from './EditProfileModal';

interface ProfilePageProps {
  user: User;
  posts: Post[];
  isCurrentUser: boolean;
  onCreatePost: (content: string, media: { type: 'image' | 'video'; url: string } | null) => void;
  onViewProfile: (user: User) => void;
  currentUser: User | null;
  onAddComment: (postId: string, commentContent: string) => void;
  onToggleLike: (postId: string) => void;
  onSharePost: (postId: string) => void;
  likedPosts: Set<string>;
  onUpdateAvatar: (base64: string) => void;
  onUpdateCover: (base64: string) => void;
  onUpdateProfile: (updatedData: Partial<User>) => void;
  onNavigate: (view: 'auth' | 'profile' | 'advertise' | 'chat', data?: User | Group) => void;
  users: User[];
  onAddFriend: (friendId: string) => void;
  onRemoveFriend: (friendId: string) => void;
}

type ActiveTab = 'posts' | 'about' | 'friends' | 'photos';

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, posts, isCurrentUser, onCreatePost, onViewProfile, currentUser, onAddComment, onToggleLike, onSharePost, likedPosts, onUpdateAvatar, onUpdateCover, onUpdateProfile, onNavigate, users, onAddFriend, onRemoveFriend }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <ProfileAbout user={user} />;
      case 'friends':
        return <ProfileFriends user={user} onViewProfile={onViewProfile} users={users} />;
      case 'photos':
        return <ProfilePhotos user={user} />;
      case 'posts':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
             <div className="md:col-span-5 space-y-4">
                <ProfileAbout user={user} isPreview />
                <ProfilePhotos user={user} isPreview />
                <ProfileFriends user={user} onViewProfile={onViewProfile} isPreview users={users} />
            </div>
            <div className="md:col-span-7 space-y-4">
              {isCurrentUser && currentUser && <CreatePost onCreatePost={onCreatePost} currentUser={currentUser} />}
              {posts.length > 0 ? (
                posts.map(post => <PostCard 
                    key={post.id} 
                    post={post} 
                    onViewProfile={onViewProfile} 
                    currentUser={currentUser}
                    onAddComment={onAddComment}
                    onToggleLike={onToggleLike}
                    onSharePost={onSharePost}
                    isLiked={currentUser ? likedPosts.has(post.id) : false}
                    onNavigate={onNavigate}
                    users={users}
                />)
              ) : (
                <div className="bg-content-bg p-4 rounded-lg shadow-sm text-center text-text-secondary">
                  No hay publicaciones para mostrar.
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {isEditModalOpen && (
        <EditProfileModal 
            user={user}
            onClose={() => setIsEditModalOpen(false)}
            onSave={onUpdateProfile}
        />
      )}
      <div className="w-full">
        <ProfileHeader 
          user={user} 
          currentUser={currentUser}
          isCurrentUser={isCurrentUser} 
          onUpdateAvatar={onUpdateAvatar}
          onUpdateCover={onUpdateCover}
          onEditProfile={() => setIsEditModalOpen(true)}
          onAddFriend={onAddFriend}
          onRemoveFriend={onRemoveFriend}
          onNavigate={onNavigate}
        />
        <ProfileNav activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-4">
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};