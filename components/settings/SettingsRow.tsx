import React from 'react';

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ label, description, children }) => {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-4 md:items-start py-4">
      <div className="md:col-span-1">
        <h3 className="font-semibold text-text-primary">{label}</h3>
        {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
      </div>
      <div className="md:col-span-2 mt-2 md:mt-0 flex md:justify-end">
        {children}
      </div>
    </div>
  );
};

export default SettingsRow;
