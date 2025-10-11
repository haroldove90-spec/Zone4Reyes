
import React from 'react';
import { LeftSidebar } from './LeftSidebar';
import { Icon } from './Icon';
import { useData } from '../context/DataContext';

interface MobileMenuProps {
    onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ onClose }) => {
    const { currentUser } = useData();
    return (
        <div className="fixed inset-0 bg-black/60 z-[100] animate-slide-up" onClick={onClose}>
            <div className="bg-content-bg h-full w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-divider flex justify-between items-center">
                    <h2 className="font-bold text-xl text-text-primary">Menú</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5 text-text-secondary" />
                    </button>
                </div>
                <div className="p-2" onClick={onClose}>
                    <LeftSidebar currentUser={currentUser} />
                </div>
            </div>
        </div>
    );
};
