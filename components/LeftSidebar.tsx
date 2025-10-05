import React from 'react';
import { Icon } from './Icon';
import { User, Group } from '../types';

interface NavLinkProps {
  iconPath: string;
  label: string;
  href?: string;
  onClick?: () => void;
  imageUrl?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ iconPath, label, href = "#", onClick, imageUrl }) => (
  <a href={href} onClick={(e) => { if(onClick) { e.preventDefault(); onClick(); }}} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
    {imageUrl ? (
      <img src={imageUrl} alt={label} className="w-7 h-7 rounded-full"/>
    ) : (
      <Icon path={iconPath} className="w-7 h-7 text-primary" />
    )}
    <span className="font-semibold text-text-primary">{label}</span>
  </a>
);

interface LeftSidebarProps {
  currentUser: User | null;
  onNavigate: (view: 'profile' | 'chat' | 'auth' | 'groups' | 'advertise', data?: User | Group) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ currentUser, onNavigate }) => {
  return (
    <aside className="sticky top-28 space-y-2">
      {currentUser ? (
        <>
          <NavLink 
            imageUrl={currentUser.avatarUrl}
            iconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            label={currentUser.name}
            onClick={() => onNavigate('profile', currentUser)}
          />
           <NavLink 
            iconPath="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            label="Mensajes"
            onClick={() => onNavigate('chat')}
           />
          <NavLink 
            iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
            label="Grupos" 
            onClick={() => onNavigate('groups')}
          />
           <NavLink 
            iconPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            label="Anúnciate"
            onClick={() => onNavigate('advertise')}
           />
          <NavLink iconPath="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" label="Marketplace" />
          <NavLink iconPath="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" label="Eventos" />
          <NavLink iconPath="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" label="Noticias Locales" />
        </>
      ) : (
        <div className="bg-content-bg p-4 rounded-lg shadow-sm text-center">
            <h3 className="font-bold text-lg text-text-primary">¡Bienvenido a Zone4Reyes!</h3>
            <p className="text-text-secondary mt-2 text-sm">Inicia sesión o regístrate para conectar con tu comunidad, participar en eventos y apoyar a los negocios locales.</p>
            <button onClick={() => onNavigate('auth')} className="mt-4 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                Entrar / Registrarse
            </button>
        </div>
      )}
    </aside>
  );
};