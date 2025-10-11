// FIX: Renamed Notification to AppNotification to avoid conflict with DOM type
import { User, Post, Message, AppNotification, Group, Advertisement, Story, UserSettings } from './types';

export const defaultSettings: UserSettings = {
  account: {
    email: '',
  },
  privacy: {
    postVisibility: 'public',
    profileVisibility: 'public',
    messagePrivacy: 'public',
    searchPrivacy: 'public',
  },
  notifications: {
    likes: true,
    comments: true,
    mentions: true,
    messages: true,
    groupUpdates: true,
  },
  general: {
    language: 'es',
  },
};

export const initialUsers: User[] = [
  {
    id: 'user-current',
    name: 'Carlos Mendoza',
    avatarUrl: 'https://i.pravatar.cc/150?u=carlos',
    profileUrl: '#',
    password: 'password123',
    coverUrl: 'https://picsum.photos/seed/carlos-cover/1000/300',
    bio: 'Desarrollador y entusiasta de la tecnología. Conectando con la comunidad de Los Reyes.',
    info: {
      work: 'Desarrollador en App Design',
      education: 'Estudió en FES Iztacala',
      location: 'Vive en Los Reyes Iztacala',
      contact: 'carlos.mendoza@example.com',
    },
    friendIds: ['user-1', 'user-2', 'user-3'],
    photos: [
      'https://picsum.photos/seed/carlos-1/500/500',
      'https://picsum.photos/seed/carlos-2/500/500',
      'https://picsum.photos/seed/carlos-3/500/500',
      'https://picsum.photos/seed/carlos-4/500/500',
      'https://picsum.photos/seed/carlos-5/500/500',
      'https://picsum.photos/seed/carlos-6/500/500',
    ],
    settings: { ...defaultSettings, account: { email: 'carlos@example.com' } },
    blockedUserIds: [],
    isActive: true,
    isVerified: true,
  },
  {
    id: 'user-1',
    name: 'Ana García',
    avatarUrl: 'https://i.pravatar.cc/150?u=ana',
    profileUrl: '#',
    password: 'password123',
    coverUrl: 'https://picsum.photos/seed/ana-cover/1000/300',
    bio: 'Amante de la comida y los buenos momentos. Buscando las mejores garnachas de la zona.',
    info: {
      work: 'Chef en "El Sazón de la Abuela"',
      location: 'Vive en Los Reyes Iztacala',
    },
    friendIds: ['user-current', 'user-2'],
    photos: [
      'https://picsum.photos/seed/ana-1/500/500',
      'https://picsum.photos/seed/ana-2/500/500',
    ],
    settings: { ...defaultSettings, account: { email: 'ana@example.com' } },
    blockedUserIds: [],
    isActive: true,
    isVerified: true,
  },
  {
    id: 'user-2',
    name: 'Luis Hernández',
    avatarUrl: 'https://i.pravatar.cc/150?u=luis',
    profileUrl: '#',
    password: 'password123',
    coverUrl: 'https://picsum.photos/seed/luis-cover/1000/300',
    bio: 'Emprendedor local. Dueño de "El Sazón de la Abuela". ¡Apoya el comercio local!',
    info: {
      work: 'Dueño de "El Sazón de la Abuela"',
      location: 'Vive en Los Reyes Iztacala',
    },
    friendIds: ['user-current', 'user-1', 'user-3'],
    photos: [
        'https://picsum.photos/seed/luis-1/500/500'
    ],
    settings: { ...defaultSettings, account: { email: 'luis@example.com' } },
    blockedUserIds: [],
    isActive: true,
    isVerified: true,
  },
  {
    id: 'user-3',
    name: 'Sofia Martinez',
    avatarUrl: 'https://i.pravatar.cc/150?u=sofia',
    profileUrl: '#',
    password: 'password123',
    coverUrl: 'https://picsum.photos/seed/sofia-cover/1000/300',
    bio: 'Estudiante y ciclista de fin de semana.',
    info: {
      education: 'Estudió en FES Iztacala',
      location: 'Vive en Los Reyes Iztacala',
    },
    friendIds: ['user-current', 'user-2'],
    photos: [
      'https://picsum.photos/seed/sofia-1/500/500',
      'https://picsum.photos/seed/sofia-2/500/500',
      'https://picsum.photos/seed/sofia-3/500/500',
    ],
    settings: { ...defaultSettings, account: { email: 'sofia@example.com' } },
    blockedUserIds: [],
    isActive: true,
    isVerified: true,
  }
];


export const initialPosts = (users: User[]): Post[] => {
    if (users.length < 4) return [];
    
    const userMap = new Map(users.map(u => [u.id, u]));
    const user1 = users[1];
    const user2 = users[2];
    const user3 = users[3];
    const userCurrent = users[0];

    return [
    {
        id: '1',
        author: user1,
        timestamp: 'Hace 2 horas',
        content: '¡Hola vecinos! Alguien sabe de una buena tortillería por la zona que abra los domingos? Se me acabaron las tortillas. 😅 @' + user3.name + ', tú que conoces bien, ¿alguna idea?',
        media: null,
        likes: 12,
        comments: [
            { id: 'c1-1', author: user3, content: '¡Claro! En la esquina de la Av. de los Barrios, ¡siempre está abierta!', timestamp: 'Hace 1 hora' },
            { id: 'c1-2', author: user2, content: 'Confirmo, la de la Av. de los Barrios es la mejor.', timestamp: 'Hace 45 min' },
        ],
        shares: 1,
    },
    {
        id: '2',
        author: user2,
        timestamp: 'Hace 5 horas',
        content: '¡Gran inauguración de "El Sazón de la Abuela"! Ven a probar nuestros platillos caseros en Av. Principal #123. ¡Descuento del 15% a los primeros 50 clientes!',
        media: { type: 'image', url: 'https://picsum.photos/id/1060/600/400' },
        likes: 45,
        comments: [
            { id: 'c2-1', author: userCurrent, content: '¡Ahí estaré! ¡Mucha suerte!', timestamp: 'Hace 3 horas' }
        ],
        shares: 9,
    },
    {
        id: '3',
        author: user3,
        timestamp: 'Ayer a las 8:15 PM',
        content: 'Se vende bicicleta de montaña rodada 26 en excelente estado. Interesados mandar mensaje directo. Precio: $2,500 MXN.',
        media: { type: 'image', url: 'https://picsum.photos/id/146/600/400' },
        likes: 22,
        comments: [],
        shares: 2,
    },
     {
        id: '4',
        author: userCurrent,
        timestamp: 'Ayer a las 9:00 PM',
        content: '¡Qué buena noche para salir a caminar por el parque!',
        media: { type: 'image', url: 'https://picsum.photos/id/10/600/400' },
        likes: 30,
        comments: [],
        shares: 5,
    },
    ];
};

export const initialMessages: Message[] = [
    // Messages will be dynamic in a real app, this is placeholder.
];

// FIX: Renamed Notification to AppNotification to avoid conflict with DOM type
export const initialNotifications = (users: User[]): AppNotification[] => {
    if (users.length < 4) return [];
    const user1 = users[1];
    const user3 = users[3];

    return [
        { id: 'notif1', type: 'like', actor: user1, postId: '4', read: false, timestamp: Date.now() - 1000 * 60 * 5, message: 'le gustó tu publicación.' },
        { id: 'notif2', type: 'comment', actor: user3, postId: '1', read: true, timestamp: Date.now() - 1000 * 60 * 60, message: 'comentó en una publicación.' },
    ];
};

export const initialGroups: Group[] = [
    {
        id: 'group-1',
        name: 'Amantes del buen comer en Los Reyes',
        description: 'Un espacio para compartir recetas, reseñas de restaurantes locales y organizar comidas.',
        coverUrl: 'https://picsum.photos/seed/food/1000/300',
        privacy: 'public',
        members: [
            { userId: 'user-1', role: 'admin' },
            { userId: 'user-current', role: 'member' },
        ],
    },
    {
        id: 'group-2',
        name: 'Club de Ciclismo Iztacala',
        description: 'Organizamos rodadas semanales por la zona. ¡Todos los niveles son bienvenidos!',
        coverUrl: 'https://picsum.photos/seed/bike/1000/300',
        privacy: 'public',
        members: [
            { userId: 'user-3', role: 'admin' },
            { userId: 'user-current', role: 'member' },
        ],
    },
    {
        id: 'group-3',
        name: 'Vigilancia Vecinal Colosio',
        description: 'Grupo privado para vecinos de la colonia Colosio. Discusión de temas de seguridad y organización comunitaria.',
        coverUrl: 'https://picsum.photos/seed/security/1000/300',
        privacy: 'private',
        members: [
            { userId: 'user-current', role: 'admin' },
        ],
    }
];

export const initialAdvertisements = (users: User[]): Advertisement[] => {
  if (users.length < 4) return [];
  const user1 = users[1];
  const user3 = users[3];

  return [
    {
      id: 'ad-1',
      author: user1,
      type: 'flyer',
      title: 'Estética Canina "Mascotas Felices"',
      description: 'Ofrecemos cortes, baños y spa para tu mejor amigo. ¡Pregunta por nuestros paquetes de descuento!',
      mediaUrl: 'https://picsum.photos/id/1025/600/400',
      category: 'Servicios',
      timestamp: Date.now() - 1000 * 60 * 60 * 8,
    },
    {
      id: 'ad-2',
      author: user3,
      type: 'content',
      title: 'Clases de regularización de Matemáticas',
      description: '¿Tu hijo necesita ayuda con las matemáticas? Ofrezco clases particulares para primaria y secundaria. Soy Ingeniero con amplia experiencia. ¡Resultados garantizados!',
      category: 'Servicios',
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
  ];
};

export const initialStories = (users: User[]): Story[] => {
    if (users.length < 4) return [];
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const user1 = users[1];
    const user3 = users[3];
    const user2 = users[2];

    return [
        { id: 'story-1', author: user1, mediaUrl: 'https://picsum.photos/id/1027/540/960', mediaType: 'image', timestamp: Date.now() - 2 * 60 * 60 * 1000 },
        { id: 'story-2', author: user3, mediaUrl: 'https://picsum.photos/id/146/540/960', mediaType: 'image', timestamp: Date.now() - 5 * 60 * 60 * 1000 },
        { id: 'story-3', author: user3, mediaUrl: 'https://picsum.photos/id/147/540/960', mediaType: 'image', timestamp: Date.now() - 4 * 60 * 60 * 1000 },
        { id: 'story-4', author: user2, mediaUrl: 'https://picsum.photos/id/1011/540/960', mediaType: 'image', timestamp: Date.now() - 8 * 60 * 60 * 1000 },
        // Expired story, should be filtered out
        { id: 'story-expired', author: user1, mediaUrl: 'https://picsum.photos/id/1/540/960', mediaType: 'image', timestamp: twentyFourHoursAgo - 10000 },
    ];
};