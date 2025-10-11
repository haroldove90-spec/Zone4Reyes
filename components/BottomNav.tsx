
import React from 'react';
import { Icon } from './Icon';
import { useData } from '../context/DataContext';

interface BottomNavProps {
    activePage: string;
    unreadNotifications: number;
    onMenuClick: () => void;
}

const NavButton: React.FC<{
    iconPath: string;
    label: string;
    href?: string;
    onClick?: () => void;
    isActive?: boolean;
    badgeCount?: number;
    isAuthButton?: boolean;
}> = ({ iconPath, label, href, onClick, isActive = false, badgeCount = 0, isAuthButton = false }) => {
    const activeColorClass = isAuthButton ? 'text-auth-button dark:text-text-primary' : 'text-primary';

    const content = (
        <>
            <Icon path={iconPath} className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
            {badgeCount > 0 && (
                <span className="absolute top-1 right-1/2 translate-x-3 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center ring-2 ring-content-bg">
                    {badgeCount}
                </span>
            )}
        </>
    );

    const className = `relative flex flex-1 flex-col items-center justify-center space-y-1 pt-2 pb-1 transition-colors ${
        isActive ? activeColorClass : 'text-text-secondary hover:text-primary'
    }`;

    if (href) {
        return <a href={href} className={className}>{content}</a>;
    }

    return <button onClick={onClick} className={className}>{content}</button>;
};


export const BottomNav: React.FC<BottomNavProps> = ({ activePage, unreadNotifications, onMenuClick }) => {
    const { currentUser } = useData();
    
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-content-bg border-t border-divider shadow-t-lg z-40">
            <div className="flex justify-around items-center">
                <NavButton
                    iconPath="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    label="Inicio"
                    href="#/feed"
                    isActive={activePage === 'feed'}
                />
                <NavButton
                    iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    label="Grupos"
                    href="#/groups"
                    isActive={activePage === 'groups'}
                />
                 <NavButton
                    iconPath="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.341 6 8.384 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    label="Notificaciones"
                    href="#/notifications"
                    isActive={activePage === 'notifications'}
                    badgeCount={unreadNotifications}
                />
                {currentUser ? (
                    <NavButton
                        iconPath="M4 6h16M4 12h16M4 18h16"
                        label="Menú"
                        onClick={onMenuClick}
                        isActive={activePage === 'settings'}
                    />
                ) : (
                    <NavButton
                        iconPath="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        label="Entrar"
                        href="#/auth"
                        isActive={activePage === 'auth'}
                        isAuthButton={true}
                    />
                )}
            </div>
        </nav>
    );
};
