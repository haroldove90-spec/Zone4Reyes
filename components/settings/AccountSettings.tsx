import React, { useState } from 'react';
import { User, UserSettings } from '../../types';
import SettingsSection from './SettingsSection';
import SettingsRow from './SettingsRow';
import ConfirmationModal from '../ConfirmationModal';

interface AccountSettingsProps {
  currentUser: User;
  onUpdateSettings: (updatedSettings: Partial<UserSettings>) => void;
  onChangePassword: (newPassword: string) => void;
  onDeactivateAccount: () => void;
  onDeleteAccount: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  currentUser,
  onUpdateSettings,
  onChangePassword,
  onDeactivateAccount,
  onDeleteAccount,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.settings.account.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [modalState, setModalState] = useState<'deactivate' | 'delete' | null>(null);

  const handleInfoSave = () => {
    onUpdateSettings({ account: { email } });
    // In a real app, name would be a separate update
    // For this prototype, we'll just show an alert
    alert('Información guardada (En el prototipo, solo el email se guarda en la configuración). El nombre se debe cambiar desde el perfil.');
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword !== confirmPassword) {
      setPasswordError('Las nuevas contraseñas no coinciden.');
      return;
    }
    if (currentUser.password !== currentPassword) {
      setPasswordError('La contraseña actual es incorrecta.');
      return;
    }
    onChangePassword(newPassword);
    setPasswordSuccess('¡Contraseña cambiada con éxito!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8">
       <ConfirmationModal
        isOpen={modalState === 'deactivate'}
        onClose={() => setModalState(null)}
        onConfirm={() => { onDeactivateAccount(); setModalState(null); }}
        title="¿Desactivar tu cuenta?"
        message="Tu perfil será desactivado y tu nombre y fotos serán eliminados de la mayoría del contenido que has compartido. Podrás reactivar tu cuenta en cualquier momento."
        confirmText="Desactivar"
        confirmColor="yellow"
      />
      <ConfirmationModal
        isOpen={modalState === 'delete'}
        onClose={() => setModalState(null)}
        onConfirm={() => { onDeleteAccount(); setModalState(null); }}
        title="¿Eliminar tu cuenta permanentemente?"
        message="Estás a punto de eliminar tu cuenta de forma permanente. Si lo haces, no podrás reactivarla ni recuperar el contenido o la información que has compartido. ¿Estás seguro?"
        confirmText="Eliminar Cuenta"
        confirmColor="red"
      />

      <SettingsSection title="Información Personal">
        <SettingsRow label="Nombre" description="Este es el nombre que se mostrará en tu perfil.">
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full md:w-80 bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </SettingsRow>
        <SettingsRow label="Correo Electrónico" description="Usado para notificaciones y recuperación de cuenta.">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full md:w-80 bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </SettingsRow>
        <div className="text-right mt-4">
          <button onClick={handleInfoSave} className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-dark transition-colors">Guardar</button>
        </div>
      </SettingsSection>

      <SettingsSection title="Cambiar Contraseña">
        <form onSubmit={handlePasswordChange} className="space-y-4">
             <SettingsRow label="Contraseña Actual">
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full md:w-80 bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </SettingsRow>
            <SettingsRow label="Nueva Contraseña">
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full md:w-80 bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </SettingsRow>
             <SettingsRow label="Confirmar Nueva Contraseña">
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full md:w-80 bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </SettingsRow>
             {passwordError && <p className="text-red-500 text-sm text-center md:text-right">{passwordError}</p>}
             {passwordSuccess && <p className="text-green-500 text-sm text-center md:text-right">{passwordSuccess}</p>}
             <div className="text-right pt-2">
                <button type="submit" className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-dark transition-colors">Cambiar Contraseña</button>
            </div>
        </form>
      </SettingsSection>
      
       <SettingsSection title="Gestión de la Cuenta">
            <SettingsRow label="Desactivar cuenta" description="Desactiva tu cuenta temporalmente.">
                <button onClick={() => setModalState('deactivate')} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors text-sm">Desactivar</button>
            </SettingsRow>
             <SettingsRow label="Eliminar cuenta" description="Elimina tu cuenta y tus datos de forma permanente.">
                <button onClick={() => setModalState('delete')} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm">Eliminar</button>
            </SettingsRow>
       </SettingsSection>
    </div>
  );
};

export default AccountSettings;
