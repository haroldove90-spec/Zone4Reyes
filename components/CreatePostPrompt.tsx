import React from 'react';
import { Icon } from './Icon';
import { User, Group } from '../types';

interface CreatePostPromptProps {
    onNavigate: (view: 'auth' | 'profile' | 'advertise', data?: User | Group) => void;
}

export const CreatePostPrompt: React.FC<CreatePostPromptProps> = ({ onNavigate }) => {
  return (
    <div className="bg-content-bg p-4 rounded-lg shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="w-6 h-6 text-gray-500" />
          </div>
          <button onClick={() => onNavigate('auth')} className="w-full bg-background p-2 text-left text-text-secondary border border-divider rounded-lg hover:border-primary transition-colors">
            ¿Qué estás pensando? Inicia sesión para publicar.
          </button>
        </div>
        <div className="border-t border-divider mt-3 pt-3 flex justify-between items-center">
            <div className="flex space-x-1 sm:space-x-4">
                 <div className="flex items-center space-x-2 text-text-secondary p-2 rounded-lg opacity-50">
                    <Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" className="w-6 h-6 text-green-500" />
                    <span className="font-semibold hidden sm:block">Foto/Video</span>
                </div>
                <div className="flex items-center space-x-2 text-text-secondary p-2 rounded-lg opacity-50">
                    <Icon path="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" className="w-6 h-6 text-blue-500" />
                    <span className="font-semibold hidden sm:block">Grabar Video</span>
                </div>
            </div>
             <button
                disabled
                className="bg-gray-300 dark:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg cursor-not-allowed"
            >
                Publicar
            </button>
        </div>
    </div>
  );
};