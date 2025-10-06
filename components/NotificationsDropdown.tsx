
import React from 'react';
// FIX: Renamed Notification to AppNotification to avoid conflict with DOM type
import { AppNotification, User } from '../types';
import { Icon } from './Icon';

interface NotificationsDropdownProps {
  // FIX: Renamed Notification to AppNotification
  notifications: AppNotification[];
  users: User[];
  onNavigate: (view: 'profile', user: User) => void;
}

const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " años";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " días";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos";
    return "Ahora mismo";
};

// FIX: Renamed Notification to AppNotification
const NotificationIcon: React.FC<{type: AppNotification['type']}> = ({type}) => {
    const icons = {
        like: { path: "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-1.9 3.8a2 2 0 00.23 2.16l3.333 4.444M7 20h-2a2 2 0 01-2-2v-6a2 2 0 012-2h2.5", color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/50' },
        comment: { path: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/50' },
        share: { path: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13", color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
        mention: { path: "M15 7a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6z", color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/50' },
        message: { path: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/50' }
    }
    // FIX: Renamed Notification to AppNotification
    const { path, color, bg } = icons[type as keyof typeof icons] || icons.comment;
    return (
        <div className={`p-2 rounded-full ${bg}`}>
            <Icon path={path} className={`w-5 h-5 ${color}`} />
        </div>
    )
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ notifications, users, onNavigate }) => {
  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-content-bg rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 max-h-[70vh] overflow-y-auto">
      <div className="p-4 border-b border-divider">
        <h3 className="font-bold text-xl text-text-primary">Notificaciones</h3>
      </div>
      <div className="divide-y divide-divider">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div key={notif.id} className={`p-3 flex items-start space-x-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${!notif.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
              <div className="flex-shrink-0">
                 <NotificationIcon type={notif.type} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-primary">
                  <button onClick={() => onNavigate('profile', notif.actor)} className="font-bold hover:underline">{notif.actor.name}</button> {notif.message}
                </p>
                <p className={`text-xs font-bold ${!notif.read ? 'text-primary' : 'text-text-secondary'}`}>{timeAgo(notif.timestamp)}</p>
              </div>
              {!notif.read && <div className="w-2.5 h-2.5 bg-primary rounded-full self-center"></div>}
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-text-secondary text-sm">No tienes notificaciones nuevas.</p>
        )}
      </div>
    </div>
  );
};
