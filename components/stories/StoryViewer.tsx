import React, { useState, useEffect, useRef } from 'react';
import { Story, User } from '../../types';
import { Icon } from '../Icon';

interface StoryViewerProps {
  userStoryGroups: { author: User; stories: Story[] }[];
  initialAuthorId: string;
  onClose: () => void;
  onMarkAsSeen: (storyId: string) => void;
}

const STORY_DURATION = 5000; // 5 seconds

export const StoryViewer: React.FC<StoryViewerProps> = ({ userStoryGroups, initialAuthorId, onClose, onMarkAsSeen }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(() => 
    userStoryGroups.findIndex(g => g.author.id === initialAuthorId)
  );
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentUserGroup = userStoryGroups[currentUserIndex];
  const currentStory = currentUserGroup?.stories[currentStoryIndex];

  useEffect(() => {
    if (currentStory) {
      onMarkAsSeen(currentStory.id);
    }
  }, [currentStory, onMarkAsSeen]);
  
  const goToNextStory = () => {
    if (currentStoryIndex < currentUserGroup.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      goToNextUser();
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else {
      goToPrevUser();
    }
  };

  const goToNextUser = () => {
    if (currentUserIndex < userStoryGroups.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  };

  const goToPrevUser = () => {
     if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      setCurrentStoryIndex(0);
    }
  };

  useEffect(() => {
    if (isPaused || !currentStory) return;

    if (progressRef.current) {
        progressRef.current.style.transition = 'none';
        progressRef.current.style.width = '0%';
        // Force reflow
        progressRef.current.getBoundingClientRect();
    }

    if(timerRef.current) clearTimeout(timerRef.current);
    
    if (progressRef.current) {
        progressRef.current.style.transition = `width ${STORY_DURATION}ms linear`;
        progressRef.current.style.width = '100%';
    }

    timerRef.current = window.setTimeout(goToNextStory, STORY_DURATION);

    return () => {
      if(timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStoryIndex, currentUserIndex, isPaused, currentStory]);

  const handleInteractionStart = () => setIsPaused(true);
  const handleInteractionEnd = () => setIsPaused(false);

  if (!currentUserGroup || !currentStory) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center select-none"
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
    >
      <div className="relative w-full h-full max-w-md max-h-screen aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden">
        {/* Story Content */}
        {currentStory.mediaType === 'image' ? (
          <img src={currentStory.mediaUrl} className="w-full h-full object-cover" />
        ) : (
          <video src={currentStory.mediaUrl} autoPlay className="w-full h-full object-cover" onEnded={goToNextStory} />
        )}

        {/* Overlay UI */}
        <div className="absolute inset-0 flex flex-col">
          {/* Progress Bars */}
          <div className="flex gap-1 p-2">
            {currentUserGroup.stories.map((story, index) => (
              <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-white"
                    style={{ width: index < currentStoryIndex ? '100%' : (index === currentStoryIndex ? '0%' : '0%') }}
                    ref={index === currentStoryIndex ? progressRef : null}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center space-x-3 p-2 text-white">
            <img src={currentUserGroup.author.avatarUrl} className="w-10 h-10 rounded-full" />
            <span className="font-bold">{currentUserGroup.author.name}</span>
            <button onClick={onClose} className="ml-auto p-2">
                <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="absolute inset-0 flex justify-between">
            <button onClick={goToPrevStory} className="w-1/3 h-full" aria-label="Previous Story"></button>
            <button onClick={goToNextStory} className="w-1/3 h-full" aria-label="Next Story"></button>
        </div>
      </div>

       {/* Prev/Next User Buttons (for desktop) */}
        <button onClick={goToPrevUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2 hidden md:block" aria-label="Previous User">
            <Icon path="M15 19l-7-7 7-7" className="w-7 h-7" />
        </button>
        <button onClick={goToNextUser} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2 hidden md:block" aria-label="Next User">
            <Icon path="M9 5l7 7-7 7" className="w-7 h-7" />
        </button>
    </div>
  );
};