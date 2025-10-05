import React, { useEffect } from 'react';
import { Icon } from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-content-bg rounded-lg shadow-xl w-full max-w-lg relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-divider text-center relative flex-shrink-0">
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <button 
            onClick={onClose} 
            className="absolute top-1/2 -translate-y-1/2 right-3 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            aria-label="Cerrar modal"
          >
            <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
            {children}
        </div>
        {footer && (
            <div className="p-4 bg-background/50 border-t border-divider text-right flex-shrink-0">
                {footer}
            </div>
        )}
      </div>
    </div>
  );
};