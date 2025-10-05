import { User, Post, Message, Notification, Group, Advertisement, Story, UserSettings } from './types';

const defaultSettings: UserSettings = {
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
    name: 'Usuario Actual',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/id/40/200/200',
    profileUrl: '#',
    coverUrl: 'https://picsum.photos/id/1015/1000/300',
    bio: 'Vecino de Los Reyes de toda la vida. ¡A sus órdenes!',
    info: {
      work: 'Desarrollador en Tech Soluciones',
      education: 'Estudió en FES Iztacala',
      location: 'Vive en Los Reyes Iztacala',
      contact: 'user.actual@email.com',
    },
    friendIds: ['user-1', 'user-2', 'user-3', 'user-4'],
    photos: [
      'https://picsum.photos/id/10/600/400',
      'https://picsum.photos/id/20/600/400',
      'https://picsum.photos/id/30/600/400',
      'https://picsum.photos/id/40/600/400',
      'https://picsum.photos/id/50/600/400',
      'https://picsum.photos/id/60/600/400',
    ],
    settings: {
      ...defaultSettings,
      account: { email: 'current.user@example.com' }
    },
    blockedUserIds: [],
    isActive: true,
  },
  {
    id: 'user-1',
    name: 'Ana García',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/id/1027/200/200',
    profileUrl: '#',
    coverUrl: 'https://picsum.photos/id/1016/1000/300',
    bio: 'Amante de los animales y el buen café.',
    info: { work: 'Veterinaria en "Mascotas Felices"', location: 'Vive en Los Reyes Iztacala' },
    friendIds: ['user-current', 'user-3'],
    photos: ['https://picsum.photos/id/1027/600/400', 'https://picsum.photos/id/1028/600/400'],
    settings: {
        ...defaultSettings,
        account: { email: 'ana.garcia@example.com' }
    },
    blockedUserIds: [],
    isActive: true,
  },
  {
    id: 'user-2',
    name: 'Negocios Locales Reyes',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/id/237/200/200',
    profileUrl: '#',
    coverUrl: 'https://picsum.photos/id/1018/1000/300',
    bio: 'Promoviendo el comercio local. ¡Apoya a tu comunidad!',
    info: { work: 'Administrador de la página', location: 'Los Reyes Iztacala' },
    friendIds: ['user-current'],
    photos: ['https://picsum.photos/id/1060/600/400'],
    settings: defaultSettings,
    blockedUserIds: [],
    isActive: true,
  },
  {
    id: 'user-3',
    name: 'Carlos Mendoza',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/id/1005/200/200',
    profileUrl: '#',
    coverUrl: 'https://picsum.photos/id/1019/1000/300',
    bio: 'Fanático del ciclismo de montaña y la tecnología.',
    info: { work: 'Ingeniero en Sistemas', education: 'Estudió en IPN', location: 'Vive en Los Reyes Iztacala' },
    friendIds: ['user-current', 'user-1'],
    photos: ['https://picsum.photos/id/146/600/400', 'https://picsum.photos/id/147/600/400'],
    settings: defaultSettings,
    blockedUserIds: [],
    isActive: true,
  },
  {
    id: 'user-4',
    name: 'Haroldo Reyes',
    password: 'chevropar#1970',
    avatarUrl: 'https://picsum.photos/id/1011/200/200',
    profileUrl: '#',
    coverUrl: 'https://picsum.photos/id/1020/1000/300',
    bio: 'Apasionado por los autos clásicos y la buena música.',
    info: { work: 'Mecánico automotriz', location: 'Vive en Los Reyes Iztacala' },
    friendIds: ['user-current'],
    photos: ['https://picsum.photos/id/1011/600/400'],
    settings: defaultSettings,
    blockedUserIds: [],
    isActive: true,
  }
];

export const initialPosts = (users: User[]): Post[] => {
    const userMap = new Map(users.map(u => [u.id, u]));
    const userCurrent = userMap.get('user-current') || users[0];
    const user1 = userMap.get('user-1') || users[1];
    const user2 = userMap.get('user-2') || users[2];
    const user3 = userMap.get('user-3') || users[3];

    return [
    {
        id: '1',
        author: user1,
        timestamp: 'Hace 2 horas',
        content: '¡Hola vecinos! Alguien sabe de una buena tortillería por la zona que abra los domingos? Se me acabaron las tortillas. 😅 @Carlos Mendoza, tú que conoces bien, ¿alguna idea?',
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
    { id: 'msg1', senderId: 'user-1', receiverId: 'user-current', content: '¡Hola! Vi tu publicación sobre la bici, ¿todavía está disponible?', timestamp: Date.now() - 1000 * 60 * 10, read: false },
    { id: 'msg2', senderId: 'user-current', receiverId: 'user-1', content: 'Hola Ana, sí, ¡aún la tengo!', timestamp: Date.now() - 1000 * 60 * 9, read: true },
    { id: 'msg3', senderId: 'user-3', receiverId: 'user-current', content: 'Oye, gracias por el dato de la tortillería el otro día. ¡Me salvaste!', timestamp: Date.now() - 1000 * 60 * 60 * 24, read: true },
];

export const initialNotifications = (users: User[]): Notification[] => {
    const userMap = new Map(users.map(u => [u.id, u]));
    const user1 = userMap.get('user-1') || users[1];
    const user3 = userMap.get('user-3') || users[3];

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
  const userMap = new Map(users.map(u => [u.id, u]));
  const user1 = userMap.get('user-1') || users[1];
  const user3 = userMap.get('user-3') || users[3];

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
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const userMap = new Map(users.map(u => [u.id, u]));
    const user1 = userMap.get('user-1')!;
    const user3 = userMap.get('user-3')!;
    const user4 = userMap.get('user-4')!;

    return [
        { id: 'story-1', author: user1, mediaUrl: 'https://picsum.photos/id/1027/540/960', mediaType: 'image', timestamp: Date.now() - 2 * 60 * 60 * 1000 },
        { id: 'story-2', author: user3, mediaUrl: 'https://picsum.photos/id/146/540/960', mediaType: 'image', timestamp: Date.now() - 5 * 60 * 60 * 1000 },
        { id: 'story-3', author: user3, mediaUrl: 'https://picsum.photos/id/147/540/960', mediaType: 'image', timestamp: Date.now() - 4 * 60 * 60 * 1000 },
        { id: 'story-4', author: user4, mediaUrl: 'https://picsum.photos/id/1011/540/960', mediaType: 'image', timestamp: Date.now() - 8 * 60 * 60 * 1000 },
        // Expired story, should be filtered out
        { id: 'story-expired', author: user1, mediaUrl: 'https://picsum.photos/id/1/540/960', mediaType: 'image', timestamp: twentyFourHoursAgo - 10000 },
    ];
};