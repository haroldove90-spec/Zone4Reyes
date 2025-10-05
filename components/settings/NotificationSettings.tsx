import React from 'react';
import { User, UserSettings } from '../../types';
import SettingsSection from './SettingsSection';
import SettingsRow from './SettingsRow';
import ToggleSwitch from '../ToggleSwitch';

interface NotificationSettingsProps {
  currentUser: User;
  onUpdateSettings: (updatedSettings: Partial<UserSettings>) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ currentUser, onUpdateSettings }) => {
  const settings = currentUser.settings.notifications;

  const handleSettingChange = (key: keyof UserSettings['notifications'], value: boolean) => {
    onUpdateSettings({ notifications: { ...settings, [key]: value } });
  };

  return (
    <div className="space-y-8">
      <SettingsSection title="Notificaciones Push">
        <p className="text-text-secondary text-sm px-4 pb-4 md:px-0 md:pb-0">
          Selecciona qué notificaciones quieres recibir en la aplicación.
        </p>
        <div className="border-t border-divider mt-4 divide-y divide-divider">
            <SettingsRow label="Me gusta" description="Recibir notificaciones cuando a alguien le guste tu publicación.">
                <ToggleSwitch
                    isOn={settings.likes}
                    handleToggle={() => handleSettingChange('likes', !settings.likes)}
                />
            </SettingsRow>
            <SettingsRow label="Comentarios" description="Recibir notificaciones cuando alguien comente tu publicación.">
                <ToggleSwitch
                    isOn={settings.comments}
                    handleToggle={() => handleSettingChange('comments', !settings.comments)}
                />
            </SettingsRow>
            <SettingsRow label="Menciones" description="Recibir notificaciones cuando alguien te mencione.">
                <ToggleSwitch
                    isOn={settings.mentions}
                    handleToggle={() => handleSettingChange('mentions', !settings.mentions)}
                />
            </SettingsRow>
             <SettingsRow label="Mensajes" description="Recibir notificaciones de nuevos mensajes.">
                <ToggleSwitch
                    isOn={settings.messages}
                    handleToggle={() => handleSettingChange('messages', !settings.messages)}
                />
            </SettingsRow>
             <SettingsRow label="Actualizaciones de Grupos" description="Recibir notificaciones sobre actividad en tus grupos.">
                <ToggleSwitch
                    isOn={settings.groupUpdates}
                    handleToggle={() => handleSettingChange('groupUpdates', !settings.groupUpdates)}
                />
            </SettingsRow>
        </div>
      </SettingsSection>
    </div>
  );
};

export default NotificationSettings;
