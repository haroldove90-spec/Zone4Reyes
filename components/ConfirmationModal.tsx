import React from 'react';
import { Modal } from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor?: 'red' | 'yellow' | 'primary';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor = 'primary',
}) => {
  const colorClasses = {
    red: 'bg-red-500 hover:bg-red-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    primary: 'bg-primary hover:bg-primary-dark',
  };

  const footer = (
    <>
      <button onClick={onClose} className="text-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mr-2">
        Cancelar
      </button>
      <button onClick={onConfirm} className={`text-white font-bold py-2 px-6 rounded-lg transition-colors ${colorClasses[confirmColor]}`}>
        {confirmText}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      <p className="text-text-secondary">{message}</p>
    </Modal>
  );
};

export default ConfirmationModal;
