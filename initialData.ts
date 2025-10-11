import { User, Message, AppNotification } from './types';

export const initialMessages: Message[] = [
    // Messages will be dynamic in a real app, this is placeholder.
];

export const initialNotifications = (users: User[]): AppNotification[] => {
    if (users.length === 0) return [];
    const actor = users[0];

    return [
        { id: 'notif1', type: 'like', actor, postId: '4', read: false, timestamp: Date.now() - 1000 * 60 * 5, message: 'le gustó tu publicación.' },
        { id: 'notif2', type: 'comment', actor, postId: '1', read: true, timestamp: Date.now() - 1000 * 60 * 60, message: 'comentó en una publicación.' },
    ];
};
