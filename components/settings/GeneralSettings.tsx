import React from 'react';
import { User, UserSettings } from '../../types';
import SettingsSection from './SettingsSection';
import SettingsRow from './SettingsRow';
import ToggleSwitch from '../ToggleSwitch';

interface GeneralSettingsProps {
  currentUser: User;
  onUpdateSettings: (updatedSettings: Partial<UserSettings>) => void;
  toggleTheme: () => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ currentUser, onUpdateSettings, toggleTheme }) => {
  const settings = currentUser.settings.general;
  const isDarkMode = document.documentElement.classList.contains('dark');

  const handleSettingChange = (key: keyof UserSettings['general'], value: any) => {
    onUpdateSettings({ general: { ...settings, [key]: value } });
  };

  return (
    <div className="space-y-8">
      <SettingsSection title="Configuración General">
        <SettingsRow label="Idioma" description="Selecciona el idioma de la aplicación.">
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className="w-full md:w-60 bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="es">Español</option>
            <option value="en">English (No implementado)</option>
          </select>
        </SettingsRow>
        <SettingsRow label="Modo Oscuro" description="Reduce el brillo de la pantalla para una lectura más cómoda.">
          <ToggleSwitch isOn={isDarkMode} handleToggle={toggleTheme} />
        </SettingsRow>
        <SettingsRow label="Ayuda y Soporte" description="Encuentra respuestas o contacta con nosotros.">
          <button className="text-primary font-semibold hover:underline">
            Visitar Centro de Ayuda
          </button>
        </SettingsRow>
      </SettingsSection>
    </div>
  );
};

export default GeneralSettings;
