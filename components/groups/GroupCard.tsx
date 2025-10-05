import React from 'react';
import { Group, User } from '../../types';
import { Icon } from '../Icon';

interface GroupCardProps {
  group: Group;
  onJoin: (groupId: string) => void;
  currentUser: User | null;
  usersMap: Map<string, User>;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onJoin, currentUser, usersMap }) => {
  const isMember = currentUser ? group.members.some(m => m.userId === currentUser.id) : false;

  return (
    <div className="bg-content-bg rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="h-28 bg-gray-200 dark:bg-gray-800">
        <img src={group.coverUrl} alt={`${group.name} cover`} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-text-primary hover:underline cursor-pointer">{group.name}</h3>
        <p className="text-sm text-text-secondary mt-1 flex-grow">
          {group.members.length} {group.members.length === 1 ? 'miembro' : 'miembros'} &bull; {group.privacy === 'public' ? 'Público' : 'Privado'}
        </p>
        <div className="mt-3">
          {isMember ? (
            <button className="w-full bg-gray-200 text-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
              Ver Grupo
            </button>
          ) : (
            <button 
                onClick={() => onJoin(group.id)}
                className="w-full flex items-center justify-center space-x-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Icon path="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" className="w-5 h-5"/>
              <span>{group.privacy === 'public' ? 'Unirse al grupo' : 'Solicitar unirse'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
