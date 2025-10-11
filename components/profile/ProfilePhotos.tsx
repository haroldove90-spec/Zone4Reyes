import React from 'react';
import { User } from '../../types';

interface ProfilePhotosProps {
  user: User;
  isPreview?: boolean;
  onSeeAll?: () => void;
}

export const ProfilePhotos: React.FC<ProfilePhotosProps> = ({ user, isPreview = false, onSeeAll }) => {
  const photos = user.photos || [];
  const photosToShow = isPreview ? photos.slice(0, 9) : photos;

  return (
    <div className="bg-content-bg p-4 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold text-text-primary mb-4">Fotos</h3>
      <div className="grid grid-cols-3 gap-2">
        {photosToShow.map((photoUrl, index) => (
          <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img src={photoUrl} alt={`User photo ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
       {isPreview && photos.length > 9 && (
        <button onClick={onSeeAll} className="w-full mt-4 bg-gray-200 text-text-primary font-semibold py-2 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
            Ver todas las fotos
        </button>
       )}
    </div>
  );
};