
import React, { useRef } from 'react';
import { User } from '../../types';
import { Icon } from '../Icon';
import { useData } from '../../context/DataContext';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
  onEditProfile: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isCurrentUser, onEditProfile }) => {
  const { currentUser, handleUpdateProfile } = useData();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const isFriend = currentUser?.friendIds?.includes(user.id) ?? false;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'cover'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      if (type === 'avatar') {
        handleUpdateProfile({ avatarUrl: base64 });
      } else {
        handleUpdateProfile({ coverUrl: base64 });
      }
    }
  };


  return (
    <div className="bg-content-bg rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-48 sm:h-64 md:h-80 bg-gray-200 dark:bg-gray-800 group">
        <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        {isCurrentUser && (
          <>
            <input type="file" accept="image/*" className="hidden" ref={coverInputRef} onChange={(e) => handleFileChange(e, 'cover')} />
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/60 text-white font-semibold py-2 px-3 rounded-lg hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
            >
              <Icon path="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" className="w-5 h-5"/>
              <span className="text-sm">Cambiar portada</span>
            </button>
          </>
        )}

        <div className="absolute -bottom-12 sm:-bottom-16 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0">
          <div className="relative group">
            <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-content-bg object-cover" />
            {isCurrentUser && (
                <>
                    <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={(e) => handleFileChange(e, 'avatar')} />
                    <button 
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                         <Icon path="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" className="w-8 h-8"/>
                    </button>
                </>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-16 sm:pt-6 pb-4 px-4 sm:px-8 text-center sm:text-left">
        <div className="sm:flex sm:items-end sm:space-x-5">
           <div className="sm:flex-1">
             <h2 className="text-3xl font-bold text-text-primary">{user.name}</h2>
             <p className="text-text-secondary">{user.friendIds?.length ?? 0} amigos</p>
             {user.bio && <p className="mt-2 text-text-secondary">{user.bio}</p>}
           </div>
           <div className="mt-4 sm:mt-0 flex flex-wrap justify-center sm:justify-end items-center gap-2">
            {isCurrentUser ? (
                <>
                    <button 
                      className="flex items-center space-x-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled
                    >
                        <Icon path="M12 6v6m0 0v6m0-6h6m-6 0H6" className="w-5 h-5"/>
                        <span>Añadir historia</span>
                    </button>
                    <button 
                      onClick={onEditProfile}
                      className="flex items-center space-x-2 bg-gray-200 text-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                    >
                        <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" className="w-5 h-5"/>
                        <span>Editar perfil</span>
                    </button>
                </>
            ) : (
                <>
                    {isFriend ? (
                       <button onClick={() => console.log("remove friend")} className="flex items-center space-x-2 bg-gray-200 text-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
                            <Icon path="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="w-5 h-5"/>
                            <span>Amigos</span>
                        </button>
                    ) : (
                        <button onClick={() => console.log("add friend")} className="flex items-center space-x-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                            <Icon path="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" className="w-5 h-5"/>
                            <span>Añadir amigo</span>
                        </button>
                    )}
                    <a
                      href={`#/chat/${user.id}`}
                      className="flex items-center space-x-2 bg-gray-200 text-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                    >
                         <Icon path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" className="w-5 h-5"/>
                        <span>Mensaje</span>
                    </a>
                </>
            )}
           </div>
        </div>
      </div>
    </div>
  );
};
