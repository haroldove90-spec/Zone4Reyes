
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { User, Message, Conversation } from '../types';
import { Icon } from './Icon';
import { useData } from '../context/DataContext';
import { useRouter } from '../hooks/useRouter';

const ConversationListItem: React.FC<{
    conversation: Conversation;
    otherUser: User;
    isActive: boolean;
    onClick: () => void;
    currentUser: User;
}> = ({ conversation, otherUser, isActive, onClick, currentUser }) => {
    const isUnread = !conversation.lastMessage.read && conversation.lastMessage.receiverId === currentUser.id;
    return (
        <button onClick={onClick} className={`w-full text-left p-3 flex items-center space-x-3 transition-colors ${isActive ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
            <div className="relative">
                <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-12 h-12 rounded-full" />
                {isUnread && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-primary ring-2 ring-content-bg" />}
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-text-primary truncate">{otherUser.name}</h4>
                    <p className="text-xs text-text-secondary flex-shrink-0">
                        {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <p className={`text-sm truncate ${isUnread ? 'text-text-primary font-bold' : 'text-text-secondary'}`}>
                    {conversation.lastMessage.content}
                </p>
            </div>
        </button>
    )
};

const ChatMessageBubble: React.FC<{ message: Message; isCurrentUser: boolean }> = ({ message, isCurrentUser }) => (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${isCurrentUser ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-slate-600 text-text-primary'}`}>
            <p>{message.content}</p>
        </div>
    </div>
);


export const ChatPage: React.FC = () => {
    const { currentUser, users, messages, handleSendMessage, navigate, handleMarkMessagesAsRead } = useData();
    const { params } = useRouter();
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const targetUserFromUrl = useMemo(() => {
        const targetUserId = params.id || null;
        return users.find(u => u.id === targetUserId) || null;
    }, [params.id, users]);

    useEffect(() => {
        if (!currentUser) {
            navigate('auth');
        }
    }, [currentUser, navigate]);

    const userMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

    const conversations = useMemo<Conversation[]>(() => {
        if (!currentUser) return [];
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

        if (targetUserFromUrl) {
            const conversationKey = [currentUser.id, targetUserFromUrl.id].sort().join('-');
            if (!convos[conversationKey]) {
                convos[conversationKey] = {
                    id: conversationKey,
                    participants: [currentUser.id, targetUserFromUrl.id] as [string, string],
                    lastMessage: {
                        id: 'placeholder',
                        senderId: '',
                        receiverId: '',
                        content: 'Inicia la conversación...',
                        timestamp: Date.now(),
                        read: true,
                    },
                };
            }
        }

        return Object.values(convos).sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
    }, [messages, currentUser, targetUserFromUrl]);

    useEffect(() => {
        if (targetUserFromUrl && currentUser) {
            const conversationKey = [currentUser.id, targetUserFromUrl.id].sort().join('-');
            setActiveConversationId(conversationKey);
        } else if (!activeConversationId && conversations.length > 0) {
            setActiveConversationId(conversations[0].id);
        }
    }, [conversations, activeConversationId, targetUserFromUrl, currentUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeConversationId]);

    useEffect(() => {
        if (activeConversationId) {
            handleMarkMessagesAsRead(activeConversationId);
        }
    }, [activeConversationId, handleMarkMessagesAsRead]);

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    
    const otherUser = useMemo(() => {
        if (!currentUser) return null;
        if (activeConversation) {
            const otherUserId = activeConversation.participants.find(p => p !== currentUser.id)!;
            return userMap.get(otherUserId);
        }
        if (activeConversationId) { 
            const participants = activeConversationId.split('-');
            const otherUserId = participants.find(p => p !== currentUser.id)!;
            return userMap.get(otherUserId);
        }
        return null;
    }, [activeConversation, activeConversationId, currentUser, userMap]);

    const activeMessages = useMemo(() => {
        if (!otherUser || !currentUser) return [];
        return messages.filter(msg => 
            (msg.senderId === currentUser.id && msg.receiverId === otherUser.id) ||
            (msg.senderId === otherUser.id && msg.receiverId === currentUser.id)
        ).sort((a, b) => a.timestamp - b.timestamp);
    }, [messages, currentUser, otherUser]);

    const handleSendMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && otherUser) {
            handleSendMessage(otherUser.id, newMessage.trim());
            setNewMessage('');
        }
    };
    
    if (!currentUser) return null;

    return (
        <div className="flex h-[calc(100vh_-_12rem)] md:h-[calc(100vh_-_8rem)] bg-content-bg rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:flex w-1/3 border-r border-divider flex-col">
                <div className="p-4 border-b border-divider flex-shrink-0">
                    <h2 className="text-xl font-bold text-text-primary">Mensajes</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(convo => {
                        const otherUser = userMap.get(convo.participants.find(p => p !== currentUser.id)!);
                        if (!otherUser) return null;
                        return (
                            <ConversationListItem 
                                key={convo.id}
                                conversation={convo}
                                otherUser={otherUser}
                                isActive={convo.id === activeConversationId}
                                onClick={() => setActiveConversationId(convo.id)}
                                currentUser={currentUser}
                            />
                        )
                    })}
                </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col">
                {otherUser ? (
                    <>
                        <div className="p-3 border-b border-divider flex items-center space-x-3 flex-shrink-0">
                            <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <button onClick={() => navigate(`profile/${otherUser.id}`)} className="font-bold text-text-primary hover:underline">{otherUser.name}</button>
                                <p className="text-xs text-text-secondary">En línea</p>
                            </div>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {activeMessages.map(msg => (
                                <ChatMessageBubble key={msg.id} message={msg} isCurrentUser={msg.senderId === currentUser.id} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-divider flex-shrink-0">
                            <form onSubmit={handleSendMessageSubmit} className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="w-full bg-background rounded-full px-4 py-2.5 border border-divider focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button type="submit" className="flex-shrink-0 bg-primary text-white rounded-full p-3 hover:bg-primary-dark disabled:bg-gray-400" disabled={!newMessage.trim()}>
                                    <Icon path="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" className="w-6 h-6"/>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-text-secondary p-4 text-center">
                        <p>Selecciona una conversación para empezar a chatear o inicia una nueva desde el perfil de un usuario.</p>
                    </div>
                )}
            </div>
        </div>
    );
};