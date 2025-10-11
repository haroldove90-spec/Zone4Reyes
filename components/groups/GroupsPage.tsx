
import React, { useState, useMemo } from 'react';
import { Group, User } from '../../types';
import { Icon } from '../Icon';
import { GroupCard } from './GroupCard';
import { CreateGroupModal } from './CreateGroupModal';
import { useData } from '../../context/DataContext';

export const GroupsPage: React.FC = () => {
  const { currentUser, groups, handleCreateGroup, handleJoinGroup, users } = useData();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const usersMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

  if (!currentUser) {
    // Or a redirect, this is a safeguard
    return <div className="text-center p-8">Por favor, inicia sesión para ver los grupos.</div>;
  }

  const myGroups = groups.filter(g => g.members.some(m => m.userId === currentUser.id));
  const discoverGroups = groups.filter(g => !g.members.some(m => m.userId === currentUser.id));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {isCreateModalOpen && (
        <CreateGroupModal 
            onClose={() => setCreateModalOpen(false)} 
            onCreate={handleCreateGroup} 
        />
      )}
      <div className="bg-content-bg rounded-lg shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">Grupos</h1>
        <button 
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Icon path="M12 6v6m0 0v6m0-6h6m-6 0H6" className="w-5 h-5"/>
          <span>Crear Grupo</span>
        </button>
      </div>

      {myGroups.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-text-primary mb-3">Mis Grupos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGroups.map(group => (
              <GroupCard key={group.id} group={group} onJoin={handleJoinGroup} currentUser={currentUser} usersMap={usersMap} />
            ))}
          </div>
        </section>
      )}

      {discoverGroups.length > 0 && (
         <section>
          <h2 className="text-xl font-bold text-text-primary mb-3">Descubrir Grupos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {discoverGroups.map(group => (
              <GroupCard key={group.id} group={group} onJoin={handleJoinGroup} currentUser={currentUser} usersMap={usersMap} />
            ))}
          </div>
        </section>
      )}
      
       {groups.length === 0 && (
        <div className="bg-content-bg rounded-lg shadow-sm p-8 text-center text-text-secondary">
          <p>No hay grupos para mostrar. ¡Sé el primero en crear uno!</p>
        </div>
      )}
    </div>
  );
};