import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { User } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
    onNavigate: (view: 'feed' | 'profile' | 'auth' | 'notifications' | 'advertise', user?: User) => void;
    currentUser: User | null;
    theme: string;
    toggleTheme: () => void;
    onLogout: () => void;
    unreadCount: number;
    onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    onNavigate, 
    currentUser, 
    theme, 
    toggleTheme, 
    onLogout, 
    unreadCount,
    onSearch
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleReload = () => window.location.reload();

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-content-bg shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="h-6 flex items-center justify-end space-x-2">
          <button onClick={handleReload} className="p-1 rounded-full text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Recargar página">
            <Icon path="M20 11A8.1 8.1 0 004.5 9.5M4 5v4h4m-4 4a8.1 8.1 0 0015.5 1.5M20 19v-4h-4" className="w-5 h-5" />
          </button>
          <button onClick={handleFullscreen} className="p-1 rounded-full text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Pantalla completa">
            <Icon path={isFullscreen ? "M4 14h4v4m-4-12h4V4M16 4h4v4m0 8h-4v4" : "M4 8V4h4m12 4V4h-4M4 16v4h4m12-4v4h-4"} className="w-5 h-5" />
          </button>
        </div>
        
        <div className="h-12 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate('feed')} className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-content-bg focus:ring-primary rounded-md">
              <img src="https://appdesignmex.com/netbandera/wp-content/uploads/2025/10/Zone4Reyes-01-1.png" alt="Zone4Reyes Logo" className="h-[26px] md:h-7 lg:h-[30px] object-contain" />
            </button>
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
                <input
                    type="text"
                    placeholder="Buscar en Zone4Reyes"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-5 h-5 text-text-secondary"/>
                </div>
            </form>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            {currentUser ? (
              <>
                <div className="relative">
                    <button 
                        onClick={() => onNavigate('notifications')}
                        className="p-2 rounded-full text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
                        aria-label="Notificaciones"
                    >
                      <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.341 6 8.384 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" className="w-7 h-7" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-content-bg">
                            {unreadCount}
                        </span>
                      )}
                    </button>
                </div>

                <div className="relative">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
                    <img src={currentUser.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all" />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-content-bg rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 dark:ring-gray-700">
                      <button onClick={() => { onNavigate('profile', currentUser); setIsMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700">Mi Perfil</button>
                      <a href="#" className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700">Configuración</a>
                      <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700">Cerrar Sesión</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
                <button onClick={() => onNavigate('auth')} className="bg-auth-button text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-colors">
                    Entrar / Registrarse
                </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};