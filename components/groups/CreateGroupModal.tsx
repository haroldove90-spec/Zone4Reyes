import React, { useState } from 'react';
import { Icon } from '../Icon';

interface CreateGroupModalProps {
  onClose: () => void;
  onCreate: (name: string, description: string, privacy: 'public' | 'private') => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(name.trim() && description.trim()){
        onCreate(name, description, privacy);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-content-bg rounded-lg shadow-xl w-full max-w-lg relative">
        <div className="p-4 border-b border-divider text-center relative">
          <h2 className="text-xl font-bold text-text-primary">Crear Grupo</h2>
          <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 right-3 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
            <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="group-name" className="block text-sm font-medium text-text-secondary mb-1">Nombre del grupo</label>
              <input
                id="group-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ej. Club de Ciclismo Iztacala"
                className="w-full bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="group-desc" className="block text-sm font-medium text-text-secondary mb-1">Descripción</label>
              <textarea
                id="group-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="Describe el propósito de tu grupo..."
                className="w-full bg-background p-2 border border-divider rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Privacidad</label>
              <div className="space-y-2">
                <label className="flex items-center p-3 rounded-lg border border-divider has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <Icon path="M3.055 11.683a1 1 0 01.498-1.293l7-4a1 1 0 011 0l7 4a1 1 0 01.498 1.293l-7 12a1 1 0 01-1.992 0l-7-12z" className="w-6 h-6 text-text-secondary mr-3" />
                  <div className="flex-grow">
                    <p className="font-semibold text-text-primary">Público</p>
                    <p className="text-xs text-text-secondary">Cualquiera puede ver quién pertenece al grupo y lo que se publica.</p>
                  </div>
                  <input type="radio" name="privacy" value="public" checked={privacy === 'public'} onChange={() => setPrivacy('public')} className="h-5 w-5 text-primary focus:ring-primary border-gray-300" />
                </label>
                 <label className="flex items-center p-3 rounded-lg border border-divider has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <Icon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" className="w-6 h-6 text-text-secondary mr-3" />
                  <div className="flex-grow">
                    <p className="font-semibold text-text-primary">Privado</p>
                    <p className="text-xs text-text-secondary">Solo los miembros pueden ver quién pertenece al grupo y lo que se publica.</p>
                  </div>
                  <input type="radio" name="privacy" value="private" checked={privacy === 'private'} onChange={() => setPrivacy('private')} className="h-5 w-5 text-primary focus:ring-primary border-gray-300" />
                </label>
              </div>
            </div>
          </div>
          <div className="p-4 bg-background/50 border-t border-divider text-right">
            <button
              type="submit"
              disabled={!name.trim() || !description.trim()}
              className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Crear Grupo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
