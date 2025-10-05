import React, { useState, useRef } from 'react';
import { Icon } from './Icon';
import { User } from '../types';
import { VideoRecorder } from './VideoRecorder';

interface CreatePostProps {
  onCreatePost: (content: string, media: { type: 'image' | 'video'; url: string } | null) => void;
  currentUser: User;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
};

export const CreatePost: React.FC<CreatePostProps> = ({ onCreatePost, currentUser }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<{ type: 'image' | 'video'; url: string } | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      setMedia({ type, url: base64 });
    }
  };

  const handleVideoConfirm = (videoAsBase64: string) => {
      setMedia({ type: 'video', url: videoAsBase64 });
      setShowRecorder(false);
  };
  
  const handleRemoveMedia = () => {
      setMedia(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() || media) {
      onCreatePost(content, media);
      setContent('');
      setMedia(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const canPost = !!(content.trim() || media);

  return (
    <>
      {showRecorder && (
        <VideoRecorder 
            onClose={() => setShowRecorder(false)} 
            onConfirm={handleVideoConfirm} 
        />
      )}
      <div className="bg-content-bg p-4 rounded-lg shadow-sm">
        <div className="flex items-start space-x-3">
          <img src={currentUser.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
          <form onSubmit={handleSubmit} className="w-full">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`¿Qué estás pensando, ${currentUser.name.split(' ')[0]}?`}
              className="w-full bg-background p-2 border border-divider rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
        </div>

        {media && (
            <div className="mt-4 relative">
                {media.type === 'image' ? (
                    <img src={media.url} alt="Preview" className="rounded-lg w-full max-h-80 object-contain bg-background"/>
                ) : (
                    <video src={media.url} controls className="rounded-lg w-full max-h-80 object-contain bg-black"/>
                )}
                <button onClick={handleRemoveMedia} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/75">
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
                </button>
            </div>
        )}

        <div className="border-t border-divider mt-3 pt-3 flex justify-between items-center">
          <div className="flex space-x-1 sm:space-x-4">
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*" 
                className="hidden" 
            />
            <button 
                onClick={() => fileInputRef.current?.click()} 
                className="flex items-center space-x-2 text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors disabled:opacity-50"
                disabled={!!media}
            >
              <Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" className="w-6 h-6 text-green-500" />
              <span className="font-semibold hidden sm:block">Foto/Video</span>
            </button>
            <button 
                onClick={() => setShowRecorder(true)}
                className="flex items-center space-x-2 text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors disabled:opacity-50"
                disabled={!!media}
            >
              <Icon path="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" className="w-6 h-6 text-blue-500" />
              <span className="font-semibold hidden sm:block">Grabar Video</span>
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!canPost}
            className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Publicar
          </button>
        </div>
      </div>
    </>
  );
};