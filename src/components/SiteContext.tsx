import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CARS } from '../data/cars';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, updateDoc, deleteField } from 'firebase/firestore';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  link: string;
  content?: string;
  imageUrl?: string;
}

export interface ProductItem {
  id: number;
  name: string;
  category: string;
  price: number;
  icon?: string;
  image: string;
  gallery?: string[];
  description?: string;
  reviews?: { author: string; text: string; rating: number }[];
  isNew?: boolean;
  stockStatus?: 'En stock' | 'Rupture';
}

export interface AnnouncementItem {
  id: string;
  type: 'arrivage' | 'offre' | 'annonce';
  title: string;
  description: string;
  date: string;
  image?: string;
  active: boolean;
}

export interface OrderItem {
  id: string;
  client: string;
  email?: string;
  phone?: string;
  details?: string;
  item: string;
  date: string;
  status: string;
  statusColor: string;
  adminReply?: string;
}

export interface TransferItem {
  id: string;
  client: string;
  phone: string;
  receiverPhone: string;
  amount: string;
  direction: string;
  method: string;
  status: string;
  statusColor: string;
  date: string;
  adminReply?: string;
}

export interface CarItem {
  id: string | number;
  brand: string;
  model: string;
  year: number;
  price: number;
  priceStr: string;
  condition: string;
  image: string;
  gallery?: string[];
  specs: { fuel: string; trans: string; mileage: string };
  features: string[];
  available?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export interface VisaTypeItem {
  id: string;
  name: string;
  price: string;
  duration: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  service?: string;
}

export interface SiteConfig {
  logoUrl: string | null;
  heroImages?: string[];
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone1: string;
  contactPhone2: string;
  contactWhatsapp: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  socialYoutube: string;
  address: string;
  workingHours: string;
  services: ServiceItem[];
  announcements: AnnouncementItem[];
  orders: OrderItem[];
  mobileMoneyOptions: string[];
  agencyAccounts: Record<string, string>;
  transfers: TransferItem[];
  products: ProductItem[];
  cars: CarItem[];
  messages: ContactMessage[];
  reviews: ReviewItem[];
  visaTypes: VisaTypeItem[];
  shopCoverImage?: string;
  shopTitle?: string;
  shopDescription?: string;
  adminProfileImage?: string;
  admins?: string[];
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
}

const defaultServices: ServiceItem[] = [
  {
    id: '1',
    title: 'Billets d\'avion',
    description: 'Vols réguliers et charters Kinshasa - Dubai aux meilleurs tarifs.',
    iconName: 'Plane',
    link: '/flights',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Boutique Express',
    description: 'Une sélection premium de smartphones, parfums et gadgets importés de Dubai, avec livraison rapide à Kinshasa.',
    iconName: 'ShoppingBag',
    link: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Import Auto',
    description: 'Sélection, achat et livraison logistique de véhicules haut-de-gamme de Dubai à Kinshasa.',
    iconName: 'Car',
    link: '/cars',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Visas touristique',
    description: 'Obtention rapide et garantie de vos visas touristiques.',
    iconName: 'FileText',
    link: '/visas',
    imageUrl: 'https://images.unsplash.com/photo-1555009386-821b01777d07?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    title: 'Changement de visas',
    description: 'Services de changement ou extension de visas simplifiés.',
    iconName: 'RefreshCcw',
    link: '/visas',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    title: 'Réservation d\'hôtel',
    description: 'Trouvez et réservez les meilleurs hôtels adaptés à votre séjour.',
    iconName: 'Building2',
    link: '/hotel-booking',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c6658f55?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '7',
    title: 'Assurance voyage',
    description: 'Voyagez l\'esprit tranquille avec nos solutions d\'assurance.',
    iconName: 'ShieldCheck',
    link: '/travel-insurance',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '8',
    title: 'Transfert d\'argent',
    description: 'Solutions rapides et sécurisées pour vos transferts de fonds.',
    iconName: 'CreditCard',
    link: '/money-transfer',
    imageUrl: 'https://images.unsplash.com/photo-1616422329307-eacde37cc974?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '9',
    title: 'Service cargo',
    description: 'Envoi et réception de marchandises et de colis par fret aérien ou maritime.',
    iconName: 'Package',
    link: '/cargo',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c50a1e?q=80&w=800&auto=format&fit=crop'
  } ,
  {
    id: '10',
    title: 'Service Mobile',
    description: 'Consultez les numéros Mobile Money.',
    iconName: 'CreditCard',
    link: '/mobile-money-service',
    imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=800&auto=format&fit=crop'
  }
];
const defaultVisaTypes: VisaTypeItem[] = [
  { id: 'tourist-14', name: 'Visa Touriste - 14 Jours', price: '120$', duration: '3-5 jours ouvrables' },
  { id: 'tourist-30', name: 'Visa Touriste - 30 Jours', price: '150$', duration: '3-5 jours ouvrables' },
  { id: 'tourist-60', name: 'Visa Touriste - 60 Jours', price: '250$', duration: '3-5 jours ouvrables' },
];

const defaultConfig: SiteConfig = {
  logoUrl: null,
  heroImages: [],
  heroImageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop',
  heroTitle: 'Votre pont entre\nKinshasa\net Dubai',
  heroSubtitle: 'Voyage, visas, shopping de luxe et importation de véhicules. Nous facilitons toutes vos démarches avec professionnalisme et transparence.',
  contactEmail: 'contact@kindubai.com',
  contactPhone1: '+243 81 000 00 00',
  contactPhone2: '+243 90 000 00 00',
  contactWhatsapp: '+243 82 663 6212',
  socialFacebook: 'https://facebook.com',
  socialInstagram: 'https://instagram.com',
  socialTwitter: 'https://twitter.com',
  socialYoutube: 'https://youtube.com',
  address: '123 Boulevard du 30 Juin, Immeuble Horizon\nCommune de la Gombe, Kinshasa',
  workingHours: 'Lundi - Vendredi : 08h00 - 17h00\nSamedi : 09h00 - 13h00',
  services: defaultServices,
  announcements: [],
  orders: [],
  mobileMoneyOptions: ['M-Pesa', 'Orange Money', 'Airtel Money', 'Afrimoney'],
  agencyAccounts: {
    'M-Pesa': '+243 81 000 0000',
    'Orange Money': '+243 89 000 0000',
    'Airtel Money': '+243 99 000 0000',
    'Afrimoney': '+243 90 000 0000',
  },
  transfers: [],
  products: PRODUCTS as any[], // use original if loaded
  cars: CARS as CarItem[],
  messages: [],
  admins: ['mushitujacques3@gmail.com'],
  reviews: [],
  visaTypes: defaultVisaTypes,
  shopCoverImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070',
  shopTitle: 'Boutique Express',
  shopDescription: 'Produits authentiques importés directement de Dubai.',
  maintenanceMode: false,
  maintenanceMessage: 'Le site est actuellement en maintenance. Nous serons de retour dans quelques instants !',
};

interface SiteContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('siteConfig');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        let mergedServices = (parsed.services || defaultConfig.services).map((svc: ServiceItem) => {
          if (!svc.imageUrl) {
            const defaultSvc = defaultConfig.services.find(s => s.id === svc.id);
            if (defaultSvc && defaultSvc.imageUrl) {
              return { ...svc, imageUrl: defaultSvc.imageUrl };
            }
          }
          return svc;
        });

        const cargo = defaultConfig.services.find(s => s.id === '9');
        if (cargo && !mergedServices.some((s: ServiceItem) => s.id === '9' || s.title.includes('Cargo') || s.title.includes('Service cargo'))) {
          mergedServices = [...mergedServices, cargo].sort((a,b) => Number(a.id) - Number(b.id));
        }

        if (!mergedServices.some((s: ServiceItem) => s.id === '2' || s.title.includes('Boutique'))) {
          const boutique = defaultConfig.services.find(s => s.id === '2');
          if (boutique) {
            mergedServices = [...mergedServices, boutique].sort((a,b) => Number(a.id) - Number(b.id));
          }
        }

        mergedServices = mergedServices.map(s => {
          if (s.id === '9' || s.title.toLowerCase() === 'cargo') {
             return { ...s, title: "Service cargo" };
          }
          return s;
        });
        
        if (!mergedServices.some((s: ServiceItem) => s.id === '10' || s.title.includes('Service Mobile'))) {
          const mobileMoneySvc = defaultConfig.services.find(s => s.id === '10');
          if (mobileMoneySvc) {
            mergedServices = [...mergedServices, mobileMoneySvc].sort((a,b) => Number(a.id) - Number(b.id));
          }
        }

        return { 
          ...defaultConfig, 
          ...parsed,
          services: mergedServices.length > 0 ? mergedServices : defaultConfig.services,
          announcements: parsed.announcements || defaultConfig.announcements,
          orders: parsed.orders || defaultConfig.orders,
          products: parsed.products && parsed.products.length > 0 ? parsed.products : defaultConfig.products,
          cars: parsed.cars && parsed.cars.length > 0 ? parsed.cars : defaultConfig.cars,
          messages: parsed.messages || defaultConfig.messages,
          admins: parsed.admins || defaultConfig.admins,
          visaTypes: parsed.visaTypes && parsed.visaTypes.length > 0 ? parsed.visaTypes : defaultConfig.visaTypes
        };
      } catch (e) {
        return defaultConfig;
      }
    }
    return defaultConfig;
  });

  useEffect(() => {
    let currentConfig: SiteConfig = { ...config };

    const updateState = () => {
      setConfig({ ...currentConfig });
      localStorage.setItem('siteConfig', JSON.stringify(currentConfig));
    };

    const docRef = doc(db, 'settings', 'global');
    const unsubscribeGlobal = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        let firestoreConfig = docSnap.data() as SiteConfig;
        
        if (firestoreConfig.contactWhatsapp === '+243 82 663 621' || firestoreConfig.contactWhatsapp === '24382663621' || !firestoreConfig.contactWhatsapp) {
           firestoreConfig.contactWhatsapp = '+243 82 663 6212';
        }
        
        const mergedAdmins = firestoreConfig.admins?.length ? firestoreConfig.admins : ['mushitujacques3@gmail.com'];
        firestoreConfig.admins = mergedAdmins;
        
        currentConfig = { ...currentConfig, ...firestoreConfig };
        updateState();
      } else {
        const saved = localStorage.getItem('siteConfig');
        if (saved) {
           updateConfig(config).catch(console.error);
        }
      }
    }, (error) => {
      console.error("Firestore global snapshot error:", error);
    });

    const collectionsToListen = [
      'heroImages', 'cars', 'products', 'services', 'orders', 
      'messages', 'transfers', 'reviews', 'announcements'
    ];
    
    const unsubscribes = collectionsToListen.map(col => {
      const ref = doc(db, 'settings', col);
      return onSnapshot(ref, (docSnap) => {
        if (docSnap.exists()) {
           const data = col === 'heroImages' ? docSnap.data().images : docSnap.data().data;
           (currentConfig as any)[col] = data || [];
           updateState();
        }
      }, (error) => console.error(`${col} snapshot error:`, error));
    });

    return () => {
      unsubscribeGlobal();
      unsubscribes.forEach(unsub => unsub());
    };
  }, []);

  const updateConfig = async (newConfig: Partial<SiteConfig>) => {
    const updated = { ...config, ...newConfig };
    
    setConfig(updated);
    
    try {
      const arrayFields = [
        'heroImages', 'cars', 'products', 'services', 'orders', 
        'messages', 'transfers', 'reviews', 'announcements'
      ];
      
      const globalPayload = { ...updated };
      
      // Remove separated fields from the global payload
      arrayFields.forEach(field => {
        (globalPayload as any)[field] = deleteField();
      });

      // Check approximate size for global payload
      const approxSize = new Blob([JSON.stringify(globalPayload)]).size;
      if (approxSize > 1048500) {
        import('react-hot-toast').then(({ default: toast }) => {
          toast.error("La taille limite de la base de données globale est atteinte.");
        });
        return;
      }

      const docRef = doc(db, 'settings', 'global');
      await setDoc(docRef, globalPayload, { merge: true });

      for (const field of arrayFields) {
        if ((updated as any)[field] !== undefined) {
          const payload = field === 'heroImages' ? { images: (updated as any)[field] } : { data: (updated as any)[field] };
          await setDoc(doc(db, 'settings', field), payload, { merge: true });
        }
      }
    } catch (e) {
      console.error("Error updating config in firestore", e);
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error("Erreur lors de la sauvegarde. Base de données peut-être trop volumineuse.");
      });
    }
  };

  return (
    <SiteContext.Provider value={{ config, updateConfig }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteConfig must be used within a SiteProvider');
  }
  return context;
}
