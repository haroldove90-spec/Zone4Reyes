import React from 'react';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  return (
    <div className="bg-content-bg rounded-lg shadow-sm">
      <div className="p-4 border-b border-divider">
        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
      </div>
      <div className="p-4 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;
