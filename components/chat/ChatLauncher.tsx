import React, { useState, useMemo, useEffect, useRef } from 'react';
import { User, Message, Conversation, Group } from '../../types';
import { Icon } from '../Icon';

const ConversationListItem: React.FC<{
    conversation: Conversation;
    otherUser: User;
    onClick: () => void;
    currentUser: User;
}> = ({ conversation, otherUser, onClick, currentUser }) => {
    const isUnread = !conversation.lastMessage.read && conversation.lastMessage.receiverId === currentUser.id;
    return (
        <button onClick={onClick} className="w-full text-left p-2 flex items-center space-x-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-slate-700">
             <div className="relative">
                <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-10 h-10 rounded-full" />
                {isUnread && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-content-bg" />}
            </div>
            <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-sm text-text-primary truncate">{otherUser.name}</h4>
                <p className={`text-xs truncate ${isUnread ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>
                    {conversation.lastMessage.content}
                </p>
            </div>
        </button>
    );
};


interface ChatLauncherProps {
  currentUser: User;
  users: User[];
  messages: Message[];
  onNavigate: (view: 'chat', data?: User | Group) => void;
}

export const ChatLauncher: React.FC<ChatLauncherProps> = ({ currentUser, users, messages, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const launcherRef = useRef<HTMLDivElement>(null);

  const userMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

  const conversations = useMemo<Conversation[]>(() => {
    const convos: Record<string, Conversation> = {};
    messages.forEach(msg => {
        const otherUserId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
        const conversationKey = [currentUser.id, otherUserId].sort().join('-');
        
        if (!convos[conversationKey] || msg.timestamp > convos[conversationKey].lastMessage.timestamp) {
            convos[conversationKey] = {
                id: conversationKey,
                participants: [currentUser.id, otherUserId] as [string, string],
                lastMessage: msg,
            };
        }
    });
    return Object.values(convos).sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
  }, [messages, currentUser.id]);

  const unreadCount = useMemo(() => {
    return conversations.filter(c => !c.lastMessage.read && c.lastMessage.receiverId === currentUser.id).length;
  }, [conversations, currentUser.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (launcherRef.current && !launcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={launcherRef} className="fixed bottom-24 md:bottom-6 right-4 z-50">
      {isOpen && (
        <div className="w-72 bg-content-bg rounded-lg shadow-2xl border border-divider mb-2 overflow-hidden flex flex-col max-h-[60vh]">
          <div className="p-3 border-b border-divider">
            <h3 className="font-bold text-lg text-text-primary">Mensajes</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.length > 0 ? conversations.map(convo => {
              const otherUser = userMap.get(convo.participants.find(p => p !== currentUser.id)!);
              if (!otherUser) return null;
              return (
                <ConversationListItem 
                    key={convo.id}
                    conversation={convo}
                    otherUser={otherUser}
                    onClick={() => { onNavigate('chat'); setIsOpen(false); }}
                    currentUser={currentUser}
                />
              )
            }) : <p className="text-center text-sm text-text-secondary py-4">No hay conversaciones.</p>}
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="bg-primary text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg hover:bg-primary-dark transition-transform hover:scale-110 relative"
        aria-label="Abrir chat"
      >
        <Icon path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" className="w-8 h-8" />
        {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 block h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-content-bg">
                {unreadCount}
            </span>
        )}
      </button>
    </div>
  );
};