import React, { useState, useMemo } from 'react';
import { Post, User, Group } from '../types';
import { Icon } from './Icon';

interface PostCardProps {
  post: Post;
  onViewProfile: (user: User) => void;
  currentUser: User | null;
  onAddComment: (postId: string, commentContent: string) => void;
  onToggleLike: (postId: string) => void;
  onSharePost: (postId: string) => void;
  isLiked: boolean;
  onNavigate: (view: 'auth' | 'profile' | 'advertise', data?: User | Group) => void;
  users: User[];
}

const PostActionButton: React.FC<{ iconPath: string; label: string; onClick: () => void, isLiked?: boolean }> = ({ iconPath, label, onClick, isLiked = false }) => (
    <button onClick={onClick} className={`flex-1 flex justify-center items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isLiked ? 'text-primary' : 'text-text-secondary'}`}>
        <Icon path={iconPath} className="w-6 h-6" />
        <span className="font-semibold text-sm sm:text-base">{label}</span>
    </button>
);

const CommentSection: React.FC<{ 
    post: Post, 
    currentUser: User, 
    onAddComment: (postId: string, commentContent: string) => void,
    onViewProfile: (user: User) => void;
}> = ({ post, currentUser, onAddComment, onViewProfile }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(post.id, newComment.trim());
            setNewComment('');
        }
    };

    return (
        <div className="px-4 py-2 border-t border-divider">
            <div className="space-y-3 mt-2">
                {post.comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-2">
                        <img src={comment.author.avatarUrl} alt={comment.author.name} className="w-8 h-8 rounded-full cursor-pointer" onClick={() => onViewProfile(comment.author)}/>
                        <div className="bg-background rounded-xl p-2 text-sm">
                            <button onClick={() => onViewProfile(comment.author)} className="font-bold text-text-primary hover:underline">{comment.author.name}</button>
                            <p className="text-text-primary">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-start space-x-2 mt-3">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                <form onSubmit={handleSubmitComment} className="w-full flex">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        className="w-full bg-background rounded-full px-4 py-1.5 border border-divider focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button type="submit" className="ml-2 px-3 py-1 bg-primary text-white rounded-full hover:bg-primary-dark disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors" disabled={!newComment.trim()}>
                        <Icon path="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" className="w-5 h-5"/>
                    </button>
                </form>
            </div>
        </div>
    );
};


export const PostCard: React.FC<PostCardProps> = ({ post, onViewProfile, currentUser, onAddComment, onToggleLike, onSharePost, isLiked, onNavigate, users }) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const handleInteraction = (action: (postId: string) => void) => {
    if (!currentUser) {
        onNavigate('auth');
    } else {
        action(post.id);
    }
  };

  const handleShare = async () => {
    if (!currentUser) { onNavigate('auth'); return; }

    const postUrl = `${window.location.origin}/#post/${post.id}`;
    const shareData = {
      title: `Publicación de ${post.author.name} en Zone4Reyes`,
      text: post.content,
      url: postUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onSharePost(post.id);
      } catch (err) {
        console.log("Share action was cancelled or failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${post.content}\n\n(De ${post.author.name} en Zone4Reyes)\n${postUrl}`);
        setShareStatus('copied');
        onSharePost(post.id);
        setTimeout(() => setShareStatus('idle'), 2000);
      } catch (err) {
        alert('La función de compartir no está disponible en este navegador.');
      }
    }
  };
  
  const userMap = useMemo(() => new Map(users.map(u => [u.name.toLowerCase(), u])), [users]);

  const renderContentWithMentions = (text: string) => {
      const parts = text.split(/(@\w+(?:\s\w+)?)/g);
      return parts.map((part, index) => {
          if (part.startsWith('@')) {
              const userName = part.substring(1).toLowerCase();
              const user = userMap.get(userName);
              if (user) {
                  return <button key={index} onClick={() => onViewProfile(user)} className="font-semibold text-primary hover:underline">{part}</button>;
              }
          }
          return part;
      });
  };

  return (
    <div className="bg-content-bg rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <button onClick={() => onViewProfile(post.author)}>
            <img src={post.author.avatarUrl} alt={post.author.name} className="w-10 h-10 rounded-full" />
          </button>
          <div>
            <button onClick={() => onViewProfile(post.author)} className="font-bold text-text-primary hover:underline">{post.author.name}</button>
            <p className="text-sm text-text-secondary">{post.timestamp}</p>
          </div>
        </div>
        {post.content && <p className="mt-4 text-text-primary text-base whitespace-pre-wrap">{renderContentWithMentions(post.content)}</p>}
      </div>
      {post.media && (
        <div className="bg-gray-100 dark:bg-black/20">
          {post.media.type === 'image' ? (
            <img src={post.media.url} alt="Post content" className="w-full h-auto max-h-[600px] object-contain" />
          ) : (
            <video src={post.media.url} controls className="w-full h-auto max-h-[600px] object-contain bg-black">
                Tu navegador no soporta la etiqueta de video.
            </video>
          )}
        </div>
      )}
      <div className="px-4 pt-2 pb-1">
        <div className="flex justify-between text-text-secondary text-sm">
          <span>{post.likes > 0 ? `${post.likes} Me gusta` : ''}</span>
          <div className="flex space-x-4">
            <span>{post.comments.length > 0 ? `${post.comments.length} comentarios` : ''}</span>
            <span>{post.shares > 0 ? `${post.shares} veces compartido` : ''}</span>
          </div>
        </div>
        <div className="border-t border-divider my-2">
            <div className="flex justify-around items-center">
                <PostActionButton 
                    iconPath="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-1.9 3.8a2 2 0 00.23 2.16l3.333 4.444M7 20h-2a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" 
                    label="Me gusta" 
                    onClick={() => handleInteraction(onToggleLike)}
                    isLiked={isLiked}
                />
                <PostActionButton 
                    iconPath="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                    label="Comentar"
                    onClick={() => {
                        if (!currentUser) {
                            onNavigate('auth');
                        } else {
                            setIsCommentSectionOpen(!isCommentSectionOpen);
                        }
                    }}
                />
                 <PostActionButton 
                    iconPath="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" 
                    label={shareStatus === 'copied' ? '¡Copiado!' : 'Compartir'}
                    onClick={handleShare}
                />
            </div>
        </div>
      </div>
      {currentUser && isCommentSectionOpen && (
        <CommentSection post={post} currentUser={currentUser} onAddComment={onAddComment} onViewProfile={onViewProfile} />
      )}
    </div>
  );
};