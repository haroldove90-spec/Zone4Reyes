import React, { useState } from 'react';
import { User, UserSettings } from '../../types';
import { Icon } from '../Icon';
import AccountSettings from './AccountSettings';
import PrivacySettings from './PrivacySettings';
import NotificationSettings from './NotificationSettings';
import GeneralSettings from './GeneralSettings';

interface SettingsPageProps {
  currentUser: User;
  users: User[];
  onUpdateSettings: (updatedSettings: Partial<UserSettings>) => void;
  onChangePassword: (newPassword: string) => void;
  onDeactivateAccount: () => void;
  onDeleteAccount: () => void;
  onBlockUser: (userId: string) => void;
  onUnblockUser: (userId: string) => void;
  onNavigate: (view: string, data?: any) => void;
  toggleTheme: () => void;
}

type SettingsTab = 'account' | 'privacy' | 'notifications' | 'general';

const SETTINGS_TABS: { id: SettingsTab; label: string; icon: string }[] = [
  { id: 'account', label: 'Cuenta', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'privacy', label: 'Privacidad', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { id: 'notifications', label: 'Notificaciones', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.341 6 8.384 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { id: 'general', label: 'General', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

export const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSettings {...props} />;
      case 'privacy':
        return <PrivacySettings {...props} />;
      case 'notifications':
        return <NotificationSettings {...props} />;
      case 'general':
        return <GeneralSettings {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Configuración</h1>
        <div className="md:grid md:grid-cols-12 md:gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block md:col-span-3">
                <nav className="space-y-1">
                    {SETTINGS_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                activeTab === tab.id
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            <Icon path={tab.icon} className="w-5 h-5" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Mobile Tabs */}
            <div className="md:hidden mb-4 border-b border-divider">
                 <div className="flex space-x-2 overflow-x-auto -mb-px">
                     {SETTINGS_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                                activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-secondary hover:text-text-primary'
                            }`}
                        >
                           {tab.label}
                        </button>
                    ))}
                 </div>
            </div>

            <div className="md:col-span-9">
                {renderContent()}
            </div>
        </div>
    </div>
  );
};
