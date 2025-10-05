import React, { useState, useRef } from 'react';
import { Modal } from '../Modal';
import { Icon } from '../Icon';
import { VideoRecorder } from '../VideoRecorder';

interface CreateStoryModalProps {
  onClose: () => void;
  onCreateStory: (media: { type: 'image' | 'video'; url: string }) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
};

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ onClose, onCreateStory }) => {
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

  const handleCreate = () => {
    if (media) {
      onCreateStory(media);
    }
  };

  const footer = media ? (
    <button 
      onClick={handleCreate} 
      className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
    >
      Compartir Historia
    </button>
  ) : undefined;

  if (showRecorder) {
    return <VideoRecorder onClose={() => setShowRecorder(false)} onConfirm={handleVideoConfirm} />;
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Crear Historia" footer={footer}>
      {media ? (
        <div className="relative">
          {media.type === 'image' ? (
            <img src={media.url} alt="Vista previa de la historia" className="rounded-lg w-full max-h-96 object-contain bg-background" />
          ) : (
            <video src={media.url} controls className="rounded-lg w-full max-h-96 object-contain bg-black" />
          )}
          <button onClick={() => setMedia(null)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/75">
            <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center space-y-2 bg-background p-8 border-2 border-dashed border-divider rounded-lg hover:border-primary transition-colors"
          >
            <Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" className="w-10 h-10 text-primary" />
            <span className="font-semibold text-text-primary">Subir Foto/Video</span>
          </button>
          <button 
            onClick={() => setShowRecorder(true)}
            className="flex-1 flex flex-col items-center justify-center space-y-2 bg-background p-8 border-2 border-dashed border-divider rounded-lg hover:border-primary transition-colors"
          >
            <Icon path="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" className="w-10 h-10 text-blue-500" />
            <span className="font-semibold text-text-primary">Grabar Video</span>
          </button>
        </div>
      )}
    </Modal>
  );
};