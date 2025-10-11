
import React from 'react';
import { PostCard } from './PostCard';
import { CreatePostPrompt } from './CreatePostPrompt';
import { Stories } from './stories/Stories';
import { Icon } from './Icon';
import { useData } from '../context/DataContext';
import { CreatePost } from './CreatePost';

export const Feed: React.FC = () => { 
    const { 
        posts, 
        stories,
        seenStories,
        handleCreatePost,
        currentUser, 
        likedPosts,
        handleViewStory,
        setCreateStoryModalOpen,
        isLoadingFeed,
        feedError
    } = useData();

    if (isLoadingFeed) {
        return <div className="text-center text-text-secondary p-8">Cargando publicaciones...</div>;
    }

    if (feedError) {
        return <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative text-sm" role="alert">
            {feedError}
        </div>;
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
        <Stories 
            stories={stories}
            currentUser={currentUser}
            seenStories={seenStories}
            onViewStory={handleViewStory}
            onCreateStory={() => setCreateStoryModalOpen(true)}
        />
        {currentUser ? (
            <CreatePost onCreatePost={handleCreatePost} currentUser={currentUser} />
        ) : (
            <CreatePostPrompt />
        )}
        {posts.length === 0 ? (
            <div className="bg-content-bg p-8 rounded-lg shadow-sm text-center text-text-secondary">
                <Icon path="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <h3 className="font-bold text-lg text-text-primary mb-1">El feed está un poco silencioso</h3>
                <p className="text-sm">
                Parece que no hay publicaciones nuevas. ¿Por qué no rompes el hielo y compartes algo con la comunidad?
                </p>
            </div>
        ) : (
            posts.map((post) => (
                <PostCard 
                    key={post.id} 
                    post={post} 
                    isLiked={currentUser ? likedPosts.has(post.id) : false}
                />
            ))
        )}
        </div>
    );
};