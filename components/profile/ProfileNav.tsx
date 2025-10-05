import React from 'react';

type ActiveTab = 'posts' | 'about' | 'friends' | 'photos';

interface ProfileNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const NavItem: React.FC<{label: string; isActive: boolean; onClick: () => void;}> = ({ label, isActive, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className={`px-4 py-3 font-semibold border-b-4 transition-colors ${
                isActive 
                ? 'text-primary border-primary' 
                : 'text-text-secondary border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
        >
            {label}
        </button>
    )
}

export const ProfileNav: React.FC<ProfileNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-content-bg rounded-lg shadow-sm mt-4">
        <nav className="flex items-center border-b border-divider">
            <NavItem label="Publicaciones" isActive={activeTab === 'posts'} onClick={() => setActiveTab('posts')} />
            <NavItem label="Información" isActive={activeTab === 'about'} onClick={() => setActiveTab('about')} />
            <NavItem label="Amigos" isActive={activeTab === 'friends'} onClick={() => setActiveTab('friends')} />
            <NavItem label="Fotos" isActive={activeTab === 'photos'} onClick={() => setActiveTab('photos')} />
        </nav>
    </div>
  );
};