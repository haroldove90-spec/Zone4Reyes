
import React from 'react';
// FIX: Renamed Notification to AppNotification to avoid conflict with DOM type
import { AppNotification, User, Group } from '../types';
import { Icon } from './Icon';

interface NotificationsPageProps {
  // FIX: Renamed Notification to AppNotification
  notifications: AppNotification[];
  onNavigate: (view: 'profile', user: User) => void;
}

const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
    return "Ahora mismo";
};

// FIX: Renamed Notification to AppNotification
const NotificationIcon: React.FC<{type: AppNotification['type']}> = ({type}) => {
    const icons = {
        like: { path: "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-1.9 3.8a2 2 0 00.23 2.16l3.333 4.444M7 20h-2a2 2 0 01-2-2v-6a2 2 0 012-2h2.5", color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/50' },
        comment: { path: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/50' },
        share: { path: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13", color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
        mention: { path: "M15 7a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6z", color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/50' },
        message: { path: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/50' },
        group_join_request: { path: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/50' },
        friend_request: { path: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z", color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-900/50'}
    }
    const icon = icons[type] || icons.comment;
    return (
        <div className={`p-2 rounded-full ${icon.bg}`}>
            <Icon path={icon.path} className={`w-6 h-6 ${icon.color}`} />
        </div>
    )
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onNavigate }) => {
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);
  
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="bg-content-bg rounded-lg shadow-sm p-4">
        <h1 className="text-2xl font-bold text-text-primary">Notificaciones</h1>
      </div>

      {unreadNotifications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2 px-4">Nuevas</h2>
          <div className="bg-content-bg rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y divide-divider">
              {unreadNotifications.map(notif => (
                <div key={notif.id} className="p-4 flex items-start space-x-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="flex-shrink-0">
                     <NotificationIcon type={notif.type} />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary">
                      <button onClick={() => onNavigate('profile', notif.actor)} className="font-bold hover:underline">{notif.actor.name}</button> {notif.message}
                    </p>
                    <p className="text-sm font-bold text-primary">{timeAgo(notif.timestamp)}</p>
                  </div>
                  <div className="w-3 h-3 bg-primary rounded-full self-center flex-shrink-0"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {readNotifications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2 px-4">Anteriores</h2>
          <div className="bg-content-bg rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y divide-divider">
              {readNotifications.map(notif => (
                <div key={notif.id} className="p-4 flex items-start space-x-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="flex-shrink-0">
                     <NotificationIcon type={notif.type} />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary">
                      <button onClick={() => onNavigate('profile', notif.actor)} className="font-bold hover:underline">{notif.actor.name}</button> {notif.message}
                    </p>
                    <p className="text-sm text-text-secondary">{timeAgo(notif.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {notifications.length === 0 && (
        <div className="bg-content-bg rounded-lg shadow-sm p-8 text-center text-text-secondary">
          <p>No tienes notificaciones.</p>
        </div>
      )}
    </div>
  );
};
