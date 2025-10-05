import React, { useMemo } from 'react';
import { Story, User } from '../../types';
import { Icon } from '../Icon';

interface StoriesProps {
  stories: Story[];
  currentUser: User | null;
  seenStories: Set<string>;
  onViewStory: (authorId: string) => void;
  onCreateStory: () => void;
}

const StoryThumbnail: React.FC<{
  user: User;
  hasUnseen: boolean;
  isCurrentUser?: boolean;
  onClick: () => void;
}> = ({ user, hasUnseen, isCurrentUser = false, onClick }) => {
  const ringClass = hasUnseen ? 'ring-primary' : 'ring-gray-300 dark:ring-gray-600';

  return (
    <button onClick={onClick} className="flex flex-col items-center space-y-1 w-20 flex-shrink-0">
      <div className={`relative w-16 h-16 rounded-full ring-2 ${isCurrentUser ? '' : ringClass} ring-offset-2 ring-offset-content-bg p-0.5`}>
        <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
        {isCurrentUser && (
          <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center border-2 border-content-bg">
            <Icon path="M12 6v6m0 0v6m0-6h6m-6 0H6" className="w-4 h-4" />
          </div>
        )}
      </div>
      <p className="text-xs text-text-secondary truncate w-full">{isCurrentUser ? 'Crear historia' : user.name}</p>
    </button>
  );
};

export const Stories: React.FC<StoriesProps> = ({ stories, currentUser, seenStories, onViewStory, onCreateStory }) => {
  const storiesByAuthor = useMemo(() => {
    const grouped: Record<string, { author: User, stories: Story[] }> = {};
    stories.forEach(story => {
      if (!grouped[story.author.id]) {
        grouped[story.author.id] = { author: story.author, stories: [] };
      }
      grouped[story.author.id].stories.push(story);
    });
    return Object.values(grouped);
  }, [stories]);

  const hasUserSeenAll = (authorStories: Story[]): boolean => {
    return authorStories.every(story => seenStories.has(story.id));
  };
  
  if (!currentUser) return null;

  return (
    <div className="bg-content-bg p-3 rounded-lg shadow-sm">
      <div className="flex space-x-3 overflow-x-auto pb-2 -mb-2">
        <StoryThumbnail 
          user={currentUser}
          hasUnseen={false}
          isCurrentUser
          onClick={onCreateStory}
        />
        {storiesByAuthor
          .filter(group => group.author.id !== currentUser.id)
          .map(({ author, stories }) => (
            <StoryThumbnail
              key={author.id}
              user={author}
              hasUnseen={!hasUserSeenAll(stories)}
              onClick={() => onViewStory(author.id)}
            />
        ))}
      </div>
    </div>
  );
};