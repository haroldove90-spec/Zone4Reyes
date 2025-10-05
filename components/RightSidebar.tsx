import React from 'react';
import { Icon } from './Icon';

interface EventItemProps {
  title: string;
  description: string;
  time: string;
}

const EventItem: React.FC<EventItemProps> = ({ title, description, time }) => (
  <div className="flex items-start space-x-3">
    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
        <Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" className="w-6 h-6 text-primary"/>
    </div>
    <div>
      <h4 className="font-semibold text-text-primary">{title}</h4>
      <p className="text-sm text-text-secondary">{description}</p>
      <p className="text-xs text-text-secondary mt-1">{time}</p>
    </div>
  </div>
);

export const RightSidebar: React.FC = () => {
  return (
    <aside className="sticky top-18 space-y-6">
      <div className="bg-content-bg p-4 rounded-lg shadow-sm">
        <h3 className="font-bold text-lg text-text-primary mb-3">Próximos Eventos</h3>
        <div className="space-y-4">
          <EventItem 
            title="Kermés de la Parroquia" 
            description="Comida, juegos y convivencia."
            time="Sábado, 11:00 AM"
          />
          <EventItem 
            title="Clase de Zumba Gratuita" 
            description="En el parque central. ¡No faltes!"
            time="Domingo, 9:00 AM"
          />
        </div>
      </div>
      <div className="bg-content-bg p-4 rounded-lg shadow-sm">
        <h3 className="font-bold text-lg text-text-primary mb-3">Negocios Locales</h3>
        <div className="space-y-4">
            <a href="#" className="flex items-center space-x-3 group">
                <img src="https://picsum.photos/id/1060/200/200" className="w-16 h-16 rounded-lg object-cover"/>
                <div>
                    <h4 className="font-semibold text-text-primary group-hover:text-primary transition-colors">El Sazón de la Abuela</h4>
                    <p className="text-sm text-text-secondary">Comida casera con amor.</p>
                </div>
            </a>
            <a href="#" className="flex items-center space-x-3 group">
                <img src="https://picsum.photos/id/1025/200/200" className="w-16 h-16 rounded-lg object-cover"/>
                <div>
                    <h4 className="font-semibold text-text-primary group-hover:text-primary transition-colors">Estética 'Bella Reyes'</h4>
                    <p className="text-sm text-text-secondary">Tu mejor look, cerca de ti.</p>
                </div>
            </a>
        </div>
      </div>
    </aside>
  );
};