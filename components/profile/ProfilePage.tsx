
import React, { useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileNav } from './ProfileNav';
import { CreatePost } from '../CreatePost';
import { PostCard } from '../PostCard';
import { ProfileAbout } from './ProfileAbout';
import { ProfileFriends } from './ProfileFriends';
import { ProfilePhotos } from './ProfilePhotos';
import { EditProfileModal } from './EditProfileModal';
import { Icon } from '../Icon';
import { useData } from '../../context/DataContext';

interface ProfilePageProps {
  userId: string | undefined;
}

type ActiveTab = 'posts' | 'about' | 'friends' | 'photos';

export const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const { currentUser, users, posts, likedPosts, handleCreatePost, handleUpdateProfile } = useData();
  const [activeTab, setActiveTab] = useState<ActiveTab>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const user = users.find(u => u.id === userId);
  const userPosts = posts.filter(p => p.author.id === userId);
  const isCurrentUser = currentUser?.id === userId;

  if (!user) {
    return (
      <div className="bg-content-bg p-8 rounded-lg shadow-sm text-center text-text-secondary">
        <h3 className="font-bold text-lg text-text-primary mb-1">Usuario no encontrado</h3>
        <p className="text-sm">No pudimos encontrar el perfil que estás buscando.</p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <ProfileAbout user={user} />;
      case 'friends':
        return <ProfileFriends user={user} />;
      case 'photos':
        return <ProfilePhotos user={user} />;
      case 'posts':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
             <div className="md:col-span-5 space-y-4">
                <ProfileAbout user={user} isPreview onSeeAll={() => setActiveTab('about')} />
                <ProfilePhotos user={user} isPreview onSeeAll={() => setActiveTab('photos')} />
                <ProfileFriends user={user} isPreview onSeeAll={() => setActiveTab('friends')} />
            </div>
            <div className="md:col-span-7 space-y-4">
              {isCurrentUser && currentUser && <CreatePost onCreatePost={handleCreatePost} currentUser={currentUser} />}
              {userPosts.length > 0 ? (
                userPosts.map(post => <PostCard 
                    key={post.id} 
                    post={post} 
                    isLiked={currentUser ? likedPosts.has(post.id) : false}
                />)
              ) : (
                <div className="bg-content-bg p-8 rounded-lg shadow-sm text-center text-text-secondary">
                  <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                   <h3 className="font-bold text-lg text-text-primary mb-1">
                    {isCurrentUser ? "Comparte tu primera publicación" : "Sin publicaciones"}
                  </h3>
                  <p className="text-sm">
                    {isCurrentUser ? "Tu perfil está un poco vacío. ¡Anímate a compartir algo con la comunidad!" : `${user.name} aún no ha publicado nada.`}
                  </p>
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
            onSave={handleUpdateProfile}
        />
      )}
      <div className="w-full">
        <ProfileHeader 
          user={user}
          isCurrentUser={isCurrentUser} 
          onEditProfile={() => setIsEditModalOpen(true)}
        />
        <ProfileNav activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-4">
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};
