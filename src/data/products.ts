import { Smartphone, Watch, Droplets } from 'lucide-react';
import iphoneImg from '../assets/images/iphone_pro_1779972036562.png';
import oudImg from '../assets/images/oud_perfume_1779972015795.png';
import baccaratImg from '../assets/images/baccarat_perfume_1779971989001.png';

export const PRODUCTS = [
  { 
    id: 1, 
    name: 'iPhone 15 Pro Max', 
    category: 'smartphones', 
    price: 1200, 
    icon: Smartphone, 
    image: iphoneImg,
    gallery: [
      iphoneImg,
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1770&auto=format&fit=crop'
    ],
    description: 'Le dernier smartphone d\'Apple avec un design en titane, puce A17 Pro ultra-rapide et un système photo avancé. Parfait pour la photographie, les jeux et la productivité.',
    reviews: [
      { author: 'Marc K.', text: 'Produit authentique. Très performant !', rating: 5 },
      { author: 'David L.', text: 'Livraison rapide depuis Dubai.', rating: 4 }
    ]
  },
  { 
    id: 2, 
    name: 'Samsung Galaxy S24 Ultra', 
    category: 'smartphones', 
    price: 1100, 
    icon: Smartphone, 
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1771&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1771&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549114757-bb0ea9c77e77?q=80&w=1770&auto=format&fit=crop'
    ],
    description: 'Le smartphone premium de Samsung avec des fonctionnalités d\'intelligence artificielle intégrées et un stylet S-Pen. L\'écran est tout simplement exceptionnel.',
    reviews: [
      { author: 'Sophie T.', text: 'Le meilleur écran du marché.', rating: 5 }
    ]
  },
  { 
    id: 3, 
    name: 'Parfum Oud intense (Dubai)', 
    category: 'parfums', 
    price: 150, 
    icon: Droplets, 
    image: oudImg,
    gallery: [
      oudImg,
      'https://images.unsplash.com/photo-1592945403405-59c58c0c8052?q=80&w=1770&auto=format&fit=crop'
    ],
    description: 'Une fragrance orientale intense et luxueuse. L\'Oud est au centre de cette composition olfactive captivante, rappelant toute la richesse de l\'Orient.',
    reviews: [
      { author: 'Lila M.', text: 'Odeur enivrante, tient toute la journée.', rating: 5 },
      { author: 'Nadia K.', text: 'Super parfum', rating: 4 }
    ]
  },
  { 
    id: 4, 
    name: 'Apple Watch Ultra 2', 
    category: 'gadgets', 
    price: 800, 
    icon: Watch, 
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1771&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1771&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1627&auto=format&fit=crop'
    ],
    description: 'La montre connectée la plus robuste d\'Apple. Idéale pour les aventuriers avec son grand écran très lumineux et sa longue durée de vie de batterie.',
    reviews: [
      { author: 'Jean P.', text: 'Parfait pour le sport !', rating: 5 }
    ]
  },
  { 
    id: 5, 
    name: 'AirPods Pro 2', 
    category: 'gadgets', 
    price: 250, 
    icon: Smartphone, 
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1770&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1770&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=1664&auto=format&fit=crop'
    ],
    description: 'Réduction de bruit active exceptionnelle et audio spatial immersif. Un son riche pour tous vos appareils.',
    reviews: [
      { author: 'Emma', text: 'La réduction de bruit est top.', rating: 5 }
    ]
  },
  { 
    id: 6, 
    name: 'Baccarat Rouge 540', 
    category: 'parfums', 
    price: 350, 
    icon: Droplets, 
    image: baccaratImg,
    gallery: [
      baccaratImg,
      oudImg // fallback image
    ],
    description: 'Un parfum lumineux et sophistiqué. Les notes florales et boisées se mêlent pour créer un sillage unique et mémorable.',
    reviews: [
      { author: 'Claire D.', text: 'Mon parfum préféré. Une classe absolue.', rating: 5 },
      { author: 'Mireille J.', text: 'Très cher, mais exceptionnel.', rating: 4 }
    ]
  },
];
