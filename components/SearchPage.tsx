
import React, { useState, useMemo } from 'react';
import { User, Post, Group } from '../types';
import { Icon } from './Icon';
import { PostCard } from './PostCard';
import { useData } from '../context/DataContext';
import { useRouter } from '../hooks/useRouter';

const UserResult: React.FC<{ user: User, onViewProfile: (user: User) => void }> = ({ user, onViewProfile }) => (
    <div className="flex items-center space-x-3 p-3 bg-content-bg rounded-lg">
        <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full"/>
        <div className="flex-1">
            <button onClick={() => onViewProfile(user)} className="font-bold text-text-primary hover:underline">{user.name}</button>
            <p className="text-sm text-text-secondary">{user.bio || 'Sin biografía'}</p>
        </div>
        <button onClick={() => onViewProfile(user)} className="bg-gray-200 text-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-sm">
            Ver Perfil
        </button>
    </div>
);

const GroupResult: React.FC<{ group: Group }> = ({ group }) => (
     <div className="flex items-center space-x-3 p-3 bg-content-bg rounded-lg">
        <img src={group.coverUrl} alt={group.name} className="w-16 h-12 rounded-lg object-cover"/>
        <div className="flex-1">
            <h4 className="font-bold text-text-primary hover:underline cursor-pointer">{group.name}</h4>
            <p className="text-sm text-text-secondary">{group.description}</p>
        </div>
        <button className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors text-sm">
            Ver Grupo
        </button>
    </div>
);

export const SearchPage: React.FC = () => { 
    const { users, posts, groups, currentUser, likedPosts, navigate } = useData();
    const { params } = useRouter();

    const initialQuery = params.q || '';
    const [query, setQuery] = useState(initialQuery);
    const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts' | 'groups'>('all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // The component manages its own query state, so this is mainly for form submission on enter.
    };

    const onViewProfile = (user: User) => {
        navigate(`profile/${user.id}`);
    };

    const results = useMemo(() => {
        if (!query.trim()) {
        return { users: [], posts: [], groups: [], total: 0 };
        }
        const lowerQuery = query.toLowerCase();
        const filteredUsers = users.filter(u => u.name.toLowerCase().includes(lowerQuery));
        const filteredPosts = posts.filter(p => p.content && p.content.toLowerCase().includes(lowerQuery));
        const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(lowerQuery) || g.description.toLowerCase().includes(lowerQuery));
        return { 
            users: filteredUsers, 
            posts: filteredPosts, 
            groups: filteredGroups,
            total: filteredUsers.length + filteredPosts.length + filteredGroups.length
        };
    }, [query, users, posts, groups]);

    const renderResults = () => {
        if (!query.trim()) {
            return <div className="text-center text-text-secondary p-8 bg-content-bg rounded-lg">Empieza a escribir para buscar...</div>
        }
        if (results.total === 0) {
            return <div className="text-center text-text-secondary p-8 bg-content-bg rounded-lg">No se encontraron resultados para "{query}".</div>
        }
        return (
            <div className="space-y-4">
                {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-text-primary mb-3">Personas</h2>
                        <div className="space-y-2">
                            {results.users.map(user => <UserResult key={user.id} user={user} onViewProfile={onViewProfile} />)}
                        </div>
                    </section>
                )}
                {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-text-primary mb-3">Publicaciones</h2>
                        <div className="space-y-4">
                            {results.posts.map(post => (
                                <PostCard 
                                    key={post.id} 
                                    post={post} 
                                    isLiked={currentUser ? likedPosts.has(post.id) : false}
                                />
                            ))}
                        </div>
                    </section>
                )}
                {(activeTab === 'all' || activeTab === 'groups') && results.groups.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-text-primary mb-3">Grupos</h2>
                        <div className="space-y-2">
                            {results.groups.map(group => <GroupResult key={group.id} group={group} />)}
                        </div>
                    </section>
                )}
            </div>
        )
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
        <div className="bg-content-bg rounded-lg shadow-sm p-4 sticky top-20 z-30">
            <form onSubmit={handleSearch} className="flex items-center relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-5 h-5 text-text-secondary"/>
            </div>
            <input
                type="text"
                placeholder="Buscar en Zone4Reyes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-background rounded-full pl-12 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            </form>
        </div>

        <div className="bg-content-bg rounded-lg shadow-sm p-1 flex space-x-1">
            {(['all', 'users', 'posts', 'groups'] as const).map(tab => (
                <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-primary text-white shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                    { {all: 'Todo', users: 'Personas', posts: 'Publicaciones', groups: 'Grupos'}[tab] }
                </button>
            ))}
        </div>
        
        {renderResults()}

        </div>
    );
};