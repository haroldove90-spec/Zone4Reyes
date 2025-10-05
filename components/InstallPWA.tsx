import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

// This is a simplified check for iOS.
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

// This component will not be rendered if the app is already in standalone mode.
export const InstallPWA: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
       // Show prompt only if it hasn't been dismissed recently
      if (!localStorage.getItem('pwaInstallDismissed')) {
         setTimeout(() => setIsVisible(true), 3000);
      }
    };
    
    window.addEventListener('beforeinstallprompt', handler);

    // Show iOS instructions if applicable
    if (isIOS() && !window.matchMedia('(display-mode: standalone)').matches) {
        if (!localStorage.getItem('pwaInstallDismissed')) {
            setTimeout(() => {
                setIsIosDevice(true);
                setIsVisible(true);
            }, 3000);
        }
    }

    return () => {
        window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    setIsVisible(false);
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember dismissal for a day to avoid being annoying
    localStorage.setItem('pwaInstallDismissed', 'true');
    setTimeout(() => localStorage.removeItem('pwaInstallDismissed'), 24 * 60 * 60 * 1000);
  };

  if (!isVisible || window.matchMedia('(display-mode: standalone)').matches) {
    return null;
  }
  
  if (isIosDevice) {
      return (
          <div className="fixed bottom-0 left-0 right-0 bg-content-bg p-4 shadow-2xl z-[120] border-t border-divider animate-slide-up">
              <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                      <img src="https://appdesignmex.com/netbandera/wp-content/uploads/2025/10/Zone4Reyes-03-1.png" alt="App Icon" className="w-12 h-12 rounded-lg" />
                      <div>
                          <h3 className="font-bold text-text-primary">Instala Zone4Reyes</h3>
                          <p className="text-sm text-text-secondary">Pulsa el ícono de Compartir y luego 'Añadir a pantalla de inicio'.</p>
                      </div>
                  </div>
                  <button onClick={handleDismiss} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                      <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5 text-text-secondary" />
                  </button>
              </div>
          </div>
      )
  }

  if (installPrompt) {
      return (
         <div className="fixed inset-0 bg-black/60 z-[120] flex items-center justify-center p-4">
             <div className="bg-content-bg rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
                 <img src="https://appdesignmex.com/netbandera/wp-content/uploads/2025/10/Zone4Reyes-03-1.png" alt="App Icon" className="w-16 h-16 mx-auto mb-4 rounded-xl"/>
                 <h2 className="text-xl font-bold text-text-primary">¡Mejora tu experiencia!</h2>
                 <p className="text-text-secondary mt-2 mb-6">Instala la red social en tu dispositivo móvil para un acceso más rápido y una mejor experiencia.</p>
                 <div className="space-y-3">
                     <button onClick={handleInstall} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                         Instalar Aplicación
                     </button>
                     <button onClick={handleDismiss} className="w-full bg-transparent text-text-secondary font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                         Continuar en el Navegador
                     </button>
                 </div>
             </div>
         </div>
      );
  }

  return null;
};
