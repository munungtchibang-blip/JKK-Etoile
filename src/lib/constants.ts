export interface NavItem {
  label: string;
  href: string;
  subMenu?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', href: '/' },
  { 
    label: 'Services', 
    href: '#',
    subMenu: [
      { label: 'Billetterie & Vols', href: '/flights' },
      { label: 'Demande de Visas', href: '/visas' },
      { label: 'Auto Import', href: '/cars' },
      { label: 'Expédition & Fret', href: '/tracking' },
    ]
  },
  { label: 'Boutique', href: '/shop' },
  { label: 'Contact', href: '/contact' },
];
