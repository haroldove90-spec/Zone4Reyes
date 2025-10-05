import React, { useMemo } from 'react';
import { User } from '../../types';

interface ProfileFriendsProps {
  user: User;
  onViewProfile: (user: User) => void;
  isPreview?: boolean;
  users: User[];
}

export const ProfileFriends: React.FC<ProfileFriendsProps> = ({ user, onViewProfile, isPreview = false, users }) => {
  const friends = useMemo(() => {
    if (!user.friendIds || !users) return [];
    const friendsMap = new Map(users.map(u => [u.id, u]));
    return user.friendIds.map(id => friendsMap.get(id)).filter(Boolean) as User[];
  }, [user.friendIds, users]);

  const friendsToShow = isPreview ? friends.slice(0, 9) : friends;

  return (
    <div className="bg-content-bg p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
            <h3 className="text-xl font-bold text-text-primary">Amigos</h3>
            <p className="text-text-secondary">{friends.length} amigos</p>
        </div>
        {!isPreview && (
             <input type="text" placeholder="Buscar amigos" className="bg-background rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"/>
        )}
      </div>
      <div className={`grid gap-2 ${isPreview ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'}`}>
        {friendsToShow.map(friend => (
          <div key={friend.id}>
            <a href="#" onClick={(e) => { e.preventDefault(); onViewProfile(friend); }} className="block group">
              <img src={friend.avatarUrl} alt={friend.name} className="w-full aspect-square object-cover rounded-lg" />
              <p className="text-sm font-semibold text-text-primary mt-1 truncate group-hover:underline">{friend.name}</p>
            </a>
          </div>
        ))}
      </div>
      {isPreview && friends.length > 9 && (
         <button className="w-full mt-4 bg-gray-200 text-text-primary font-semibold py-2 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
            Ver todos los amigos
        </button>
      )}
    </div>
  );
};