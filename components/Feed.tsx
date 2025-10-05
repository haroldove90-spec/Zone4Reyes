import React from 'react';
import { Post, User, Group, Story } from '../types';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';
import { CreatePostPrompt } from './CreatePostPrompt';
import { Stories } from './stories/Stories';

interface FeedProps {
  posts: Post[];
  stories: Story[];
  seenStories: Set<string>;
  onCreatePost: (content: string, media: { type: 'image' | 'video'; url: string } | null) => void;
  onViewProfile: (user: User) => void;
  currentUser: User | null;
  onAddComment: (postId: string, commentContent: string) => void;
  onToggleLike: (postId: string) => void;
  onSharePost: (postId: string) => void;
  likedPosts: Set<string>;
  onNavigate: (view: 'auth' | 'profile' | 'advertise', data?: User | Group) => void;
  users: User[];
  onViewStory: (authorId: string) => void;
  onCreateStory: () => void;
}

export const Feed: React.FC<FeedProps> = ({ 
    posts, 
    stories,
    seenStories,
    onCreatePost, 
    onViewProfile, 
    currentUser, 
    onAddComment, 
    onToggleLike, 
    onSharePost, 
    likedPosts,
    onNavigate,
    users,
    onViewStory,
    onCreateStory,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Stories 
        stories={stories}
        currentUser={currentUser}
        seenStories={seenStories}
        onViewStory={onViewStory}
        onCreateStory={onCreateStory}
      />
      {currentUser ? (
        <CreatePost onCreatePost={onCreatePost} currentUser={currentUser} />
      ) : (
        <CreatePostPrompt onNavigate={onNavigate} />
      )}
      {posts.map((post) => (
        <PostCard 
            key={post.id} 
            post={post} 
            onViewProfile={onViewProfile} 
            currentUser={currentUser} 
            onAddComment={onAddComment}
            onToggleLike={onToggleLike}
            onSharePost={onSharePost}
            isLiked={currentUser ? likedPosts.has(post.id) : false}
            onNavigate={onNavigate}
            users={users}
        />
      ))}
    </div>
  );
};