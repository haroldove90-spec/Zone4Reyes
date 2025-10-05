import React, { useState } from 'react';
import { User } from '../../types';
import { Modal } from '../Modal';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedData: Partial<User>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.info?.location || '');
  const [work, setWork] = useState(user.info?.work || '');
  const [education, setEducation] = useState(user.info?.education || '');

  const handleSave = () => {
    const updatedData: Partial<User> = {
      name,
      bio,
      info: {
        ...user.info,
        location,
        work,
        education,
      },
    };
    onSave(updatedData);
    onClose();
  };

  const footer = (
     <>
        <button onClick={onClose} className="text-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mr-2">
            Cancelar
        </button>
        <button onClick={handleSave} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors">
            Guardar Cambios
        </button>
    </>
  );

  return (
    <Modal isOpen={true} onClose={onClose} title="Editar Perfil" footer={footer}>
      <div className="space-y-4">
        <div>
          <label htmlFor="edit-name" className="block text-sm font-medium text-text-secondary mb-1">Nombre</label>
          <input
            id="edit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="edit-bio" className="block text-sm font-medium text-text-secondary mb-1">Biografía</label>
          <textarea
            id="edit-bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-background p-2 border border-divider rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="edit-location" className="block text-sm font-medium text-text-secondary mb-1">Ubicación</label>
          <input
            id="edit-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej. Vive en Los Reyes Iztacala"
            className="w-full bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
         <div>
          <label htmlFor="edit-work" className="block text-sm font-medium text-text-secondary mb-1">Trabajo</label>
          <input
            id="edit-work"
            type="text"
            value={work}
            onChange={(e) => setWork(e.target.value)}
            placeholder="Ej. Desarrollador en Tech Soluciones"
            className="w-full bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="edit-education" className="block text-sm font-medium text-text-secondary mb-1">Educación</label>
          <input
            id="edit-education"
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="Ej. Estudió en FES Iztacala"
            className="w-full bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </Modal>
  );
};