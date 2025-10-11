import React from 'react';
import { User } from '../../types';
import { Icon } from '../Icon';

interface ProfileAboutProps {
  user: User;
  isPreview?: boolean;
  onSeeAll?: () => void;
}

const InfoItem: React.FC<{iconPath: string; text: string | undefined}> = ({iconPath, text}) => {
    if (!text) return null;
    return (
        <div className="flex items-center space-x-3 text-text-secondary">
            <Icon path={iconPath} className="w-5 h-5" />
            <span className="text-text-primary">{text}</span>
        </div>
    )
}

export const ProfileAbout: React.FC<ProfileAboutProps> = ({ user, isPreview = false, onSeeAll }) => {
  return (
    <div className="bg-content-bg p-4 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold text-text-primary mb-4">Información</h3>
      <div className="space-y-3">
        {user.info?.work && <InfoItem iconPath="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" text={user.info.work} />}
        {user.info?.education && <InfoItem iconPath="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14V4.5" text={user.info.education} />}
        {user.info?.location && <InfoItem iconPath="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" text={user.info.location} />}
        {user.info?.contact && !isPreview && <InfoItem iconPath="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" text={user.info.contact} />}
      </div>
       {isPreview && (
        <button onClick={onSeeAll} className="w-full mt-4 bg-gray-200 text-text-primary font-semibold py-2 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
            Ver toda la información
        </button>
       )}
    </div>
  );
};