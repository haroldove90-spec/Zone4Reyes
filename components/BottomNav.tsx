import React from 'react';
import { Icon } from './Icon';
import { User, Group } from '../types';

interface BottomNavProps {
    onNavigate: (view: 'feed' | 'profile' | 'auth' | 'groups' | 'notifications' | 'search' | 'advertise' | 'menu', data?: User | Group) => void;
    currentUser: User | null;
    // FIX: Add 'settings' to the activeView type to allow correct comparison for highlighting the menu button.
    activeView: 'feed' | 'profile' | 'auth' | 'chat' | 'notifications' | 'groups' | 'search' | 'advertise' | 'menu' | 'settings';
    unreadNotifications: number;
}

const NavButton: React.FC<{
    iconPath: string;
    label: string;
    onClick: () => void;
    isActive?: boolean;
    badgeCount?: number;
    isAuthButton?: boolean;
}> = ({ iconPath, label, onClick, isActive = false, badgeCount = 0, isAuthButton = false }) => {
    const activeColorClass = isAuthButton ? 'text-auth-button dark:text-text-primary' : 'text-primary';

    return (
        <button
            onClick={onClick}
            className={`relative flex flex-col items-center justify-center space-y-1 w-full pt-2 pb-1 transition-colors ${
                isActive ? activeColorClass : 'text-text-secondary hover:text-primary'
            }`}
        >
            <Icon path={iconPath} className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
            {badgeCount > 0 && (
                <span className="absolute top-1 right-1/2 translate-x-3 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center ring-2 ring-content-bg">
                    {badgeCount}
                </span>
            )}
        </button>
    );
};


export const BottomNav: React.FC<BottomNavProps> = ({ onNavigate, currentUser, activeView, unreadNotifications }) => {

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-content-bg border-t border-divider shadow-t-lg z-40">
            <div className="flex justify-around items-center">
                <NavButton
                    iconPath="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    label="Inicio"
                    onClick={() => onNavigate('feed')}
                    isActive={activeView === 'feed'}
                />
                <NavButton
                    iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    label="Grupos"
                    onClick={() => onNavigate('groups')}
                    isActive={activeView === 'groups'}
                />
                 <NavButton
                    iconPath="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.341 6 8.384 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    label="Notificaciones"
                    onClick={() => onNavigate('notifications')}
                    isActive={activeView === 'notifications'}
                    badgeCount={unreadNotifications}
                />
                {currentUser ? (
                    <NavButton
                        iconPath="M4 6h16M4 12h16M4 18h16"
                        label="Menú"
                        onClick={() => onNavigate('menu')}
                        isActive={activeView === 'menu' || activeView === 'settings'}
                    />
                ) : (
                    <NavButton
                        iconPath="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        label="Entrar"
                        onClick={() => onNavigate('auth')}
                        isActive={activeView === 'auth'}
                        isAuthButton={true}
                    />
                )}
            </div>
        </nav>
    );
};