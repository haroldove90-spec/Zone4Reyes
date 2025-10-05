import React, { useMemo } from 'react';
import { User, UserSettings } from '../../types';
import SettingsSection from './SettingsSection';
import SettingsRow from './SettingsRow';

interface PrivacySettingsProps {
  currentUser: User;
  users: User[];
  onUpdateSettings: (updatedSettings: Partial<UserSettings>) => void;
  onBlockUser: (userId: string) => void;
  onUnblockUser: (userId: string) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  currentUser,
  users,
  onUpdateSettings,
  onBlockUser,
  onUnblockUser,
}) => {
  const settings = currentUser.settings.privacy;

  const handleSettingChange = (key: keyof UserSettings['privacy'], value: any) => {
    onUpdateSettings({ privacy: { ...settings, [key]: value } });
  };
  
  const blockedUsers = useMemo(() => {
    const blockedIds = new Set(currentUser.blockedUserIds || []);
    return users.filter(user => blockedIds.has(user.id));
  }, [currentUser.blockedUserIds, users]);

  return (
    <div className="space-y-8">
      <SettingsSection title="Privacidad de Publicaciones">
        <SettingsRow label="¿Quién puede ver tus futuras publicaciones?" description="Este ajuste no afecta a las publicaciones que ya has compartido.">
          <select
            value={settings.postVisibility}
            onChange={(e) => handleSettingChange('postVisibility', e.target.value)}
            className="w-full md:w-60 bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="public">Público</option>
            <option value="friends">Amigos</option>
            <option value="only_me">Solo yo</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Bloqueo">
        <p className="text-text-secondary text-sm px-4 pb-4 md:px-0 md:pb-0">
          Una vez que bloquees a alguien, esa persona ya no podrá ver las cosas que publicas en tu biografía, etiquetarte, invitarte a eventos o grupos, iniciar una conversación contigo ni agregarte como amigo.
        </p>
        <div className="border-t border-divider mt-4">
             {blockedUsers.length > 0 ? (
                <ul className="divide-y divide-divider">
                    {blockedUsers.map(user => (
                         <li key={user.id} className="p-4 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                                <span className="font-semibold">{user.name}</span>
                            </div>
                            <button
                                onClick={() => onUnblockUser(user.id)}
                                className="bg-gray-200 text-text-primary font-bold py-1 px-3 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-sm"
                            >
                                Desbloquear
                            </button>
                        </li>
                    ))}
                </ul>
             ) : (
                <p className="text-text-secondary text-center p-4">No tienes a nadie en tu lista de bloqueados.</p>
             )}
        </div>
      </SettingsSection>
    </div>
  );
};

export default PrivacySettings;
