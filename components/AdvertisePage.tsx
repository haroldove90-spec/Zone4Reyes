import React, { useState, useRef } from 'react';
import { User, Advertisement } from '../types';
import { Icon } from './Icon';
import { VideoRecorder } from './VideoRecorder';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
};

const AdCard: React.FC<{ ad: Advertisement }> = ({ ad }) => (
  <div className="bg-content-bg rounded-lg shadow-sm overflow-hidden">
    {ad.mediaUrl && ad.type !== 'content' && (
      <div className="h-48 bg-gray-200 dark:bg-gray-800">
        {ad.type === 'flyer' ? (
          <img src={ad.mediaUrl} alt={ad.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <video src={ad.mediaUrl} controls preload="metadata" className="w-full h-full object-contain bg-black" />
        )}
      </div>
    )}
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold uppercase text-primary">{ad.category}</span>
          <h3 className="font-bold text-lg text-text-primary mt-1">{ad.title}</h3>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
            <img src={ad.author.avatarUrl} alt={ad.author.name} className="w-10 h-10 rounded-full inline-block" loading="lazy" />
            <p className="text-xs text-text-secondary mt-1">{ad.author.name}</p>
        </div>
      </div>
      <p className="text-text-secondary mt-2 text-sm">{ad.description}</p>
    </div>
  </div>
);

interface AdvertisePageProps {
  currentUser: User;
  advertisements: Advertisement[];
  onCreateAdvertisement: (ad: Omit<Advertisement, 'id' | 'author' | 'timestamp'>) => void;
}

export const AdvertisePage: React.FC<AdvertisePageProps> = ({ currentUser, advertisements, onCreateAdvertisement }) => {
  const [adType, setAdType] = useState<'flyer' | 'content' | 'video'>('flyer');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Servicios' | 'Productos' | 'Eventos' | 'Ofertas'>('Servicios');
  const [media, setMedia] = useState<{ type: 'image' | 'video'; url: string } | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setMedia({ type: 'image', url: base64 });
    }
  };

  const handleVideoConfirm = (videoAsBase64: string) => {
    setMedia({ type: 'video', url: videoAsBase64 });
    setShowRecorder(false);
  };
  
  const handleRemoveMedia = () => {
    setMedia(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onCreateAdvertisement({
        type: adType,
        title,
        description,
        category,
        mediaUrl: media?.url,
      });
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('Servicios');
      setMedia(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Fix: Simplified condition for submission. An ad requires title and description.
  // If it's not a 'content' ad, it also requires media. The previous logic had a
  // redundant check that caused a type error.
  const canSubmit = title.trim() && description.trim() && (adType === 'content' || media);

  return (
    <>
    {showRecorder && <VideoRecorder onClose={() => setShowRecorder(false)} onConfirm={handleVideoConfirm} />}
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="bg-content-bg rounded-lg shadow-sm">
        <div className="p-4 border-b border-divider">
            <h1 className="text-2xl font-bold text-text-primary">Crea tu Anuncio</h1>
            <p className="text-text-secondary">Promociona tu negocio, servicio o evento en la comunidad.</p>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-4 space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Título del Anuncio</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ej. Plomero a Domicilio" className="w-full bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Categoría</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full bg-background p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Servicios</option>
                        <option>Productos</option>
                        <option>Eventos</option>
                        <option>Ofertas</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Tipo de Anuncio</label>
                    <div className="flex space-x-2 rounded-lg bg-background p-1 border border-divider">
                        {(['flyer', 'content', 'video'] as const).map(type => (
                            <button type="button" key={type} onClick={() => {setAdType(type); setMedia(null);}} className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors ${adType === type ? 'bg-primary text-white shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {adType === 'flyer' && (
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Imagen del Flyer</label>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={!!media} className="w-full flex justify-center items-center space-x-2 bg-background p-4 border-2 border-dashed border-divider rounded-lg hover:border-primary disabled:opacity-50">
                            <Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" className="w-6 h-6 text-text-secondary" />
                            <span className="font-semibold text-text-secondary">Subir Imagen</span>
                        </button>
                    </div>
                )}
                 {adType === 'video' && (
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Video del Anuncio</label>
                         <button type="button" onClick={() => setShowRecorder(true)} disabled={!!media} className="w-full flex justify-center items-center space-x-2 bg-background p-4 border-2 border-dashed border-divider rounded-lg hover:border-primary disabled:opacity-50">
                            <Icon path="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" className="w-6 h-6 text-text-secondary" />
                            <span className="font-semibold text-text-secondary">Grabar o Subir Video</span>
                        </button>
                    </div>
                )}

                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Descripción</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} placeholder="Detalla aquí tu anuncio..." className="w-full bg-background p-2 border border-divider rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                
                {(media) && (
                     <div className="space-y-2">
                        <h4 className="text-sm font-medium text-text-secondary">Vista Previa del Contenido:</h4>
                        <div className="relative border border-divider rounded-lg overflow-hidden">
                           {media.type === 'image' ? (
                                <img src={media.url} alt="Preview" className="w-full h-auto max-h-60 object-contain bg-background"/>
                            ) : (
                                <video src={media.url} controls className="w-full h-auto max-h-60 object-contain bg-black"/>
                            )}
                            <button onClick={handleRemoveMedia} type="button" className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/75">
                                <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
                            </button>
                        </div>
                     </div>
                )}
            </div>
            <div className="p-4 bg-background/50 border-t border-divider text-right">
                <button type="submit" disabled={!canSubmit} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
                    Publicar Anuncio
                </button>
            </div>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Anuncios Recientes</h2>
        {advertisements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advertisements.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </div>
        ) : (
             <div className="bg-content-bg rounded-lg shadow-sm p-8 text-center text-text-secondary">
                <p>Aún no hay anuncios. ¡Sé el primero en publicar!</p>
            </div>
        )}
      </div>
    </div>
    </>
  );
};