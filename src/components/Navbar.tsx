import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Search as SearchIcon, ChevronDown, ShieldCheck, Globe, ShoppingCart } from 'lucide-react';
import { NAV_ITEMS } from '../lib/constants';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import SettingsModal from './SettingsModal';
import { useSiteConfig } from './SiteContext';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from './CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { config } = useSiteConfig();
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    // Force reset on route change immediately
    setScrolled(false);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    // Check initial position and on route change after Layout scroll resets
    const timer = setTimeout(handleScroll, 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [location.pathname]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      setIsOpen(false);
    }
  };

  const dynamicNavItems = NAV_ITEMS.map(item => {
    if (item.label === 'Services') {
      return {
        ...item,
        subMenu: [
          ...(config.services || []).map((s: any) => ({
            label: s.title || s.name || s.type || 'Service',
            href: s.link || (s.id ? `/services/${s.id}` : '#'),
          }))
        ]
      };
    }
    return item;
  });

  const isHeroTransparent = location.pathname === '/' && !scrolled && !isOpen;
  const logoColorClass = isHeroTransparent ? "text-white" : "text-gold";

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-[100] transition-all duration-500 pointer-events-none"
      >
        <div className="pointer-events-auto w-full transition-all duration-500">
          <div className={cn(
            "flex items-center justify-between transition-all duration-500 rounded-none",
            scrolled ? "py-2 px-6 md:px-8 min-h-[3.5rem] shadow-lg" : "py-3 px-6 md:px-8 min-h-[4.5rem] shadow-sm",
            isHeroTransparent ? "bg-navy/10 backdrop-blur-sm border-transparent shadow-[0_4px_30px_rgba(0,0,0,0.1)]" : "bg-navy/95 backdrop-blur-xl border-b border-gold/20 shadow-lg"
          )}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group z-50 shrink-0 max-w-[50vw]" onClick={() => setIsOpen(false)}>
              {config.logoUrl ? (
                <div className="flex items-center justify-start transition-transform duration-500 group-hover:scale-105">
                  <img 
                    src={config.logoUrl} 
                    alt="Logo" 
                    className={cn("w-auto h-auto object-contain transition-all duration-500", scrolled ? "max-h-8 md:max-h-10 lg:max-h-12" : "max-h-12 md:max-h-14 lg:max-h-16")} 
                  />
                </div>
              ) : (
                <span className={cn("text-xl md:text-2xl font-display uppercase tracking-[0.25em] font-semibold transition-colors duration-300", logoColorClass)}>
                  JKK ETOILE
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10 h-full">
              {dynamicNavItems.map((item) => (
                <div 
                  key={item.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setHoveredNav(item.label)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  {item.subMenu ? (
                    <button className={cn("flex items-center gap-1.5 text-[15px] md:text-[16px] uppercase tracking-[1.5px] font-semibold group transition-colors duration-300", 
                      item.subMenu.some(sub => location.pathname === sub.href) 
                        ? (isHeroTransparent ? "text-white drop-shadow-md" : "text-gold") 
                        : (isHeroTransparent ? "text-white/95 hover:text-white drop-shadow-md" : "text-text/90 hover:text-gold")
                    )}>
                      {item.label}
                      <ChevronDown size={14} className={cn("transition-transform duration-300 transform", hoveredNav === item.label ? "rotate-180" : "")} />
                      <span className={cn(
                        "absolute bottom-[calc(50%-14px)] left-0 w-full h-[1.5px] transform origin-left transition-transform duration-300 group-hover:scale-x-100",
                        item.subMenu.some(sub => location.pathname === sub.href) ? "scale-x-100" : "scale-x-0",
                        isHeroTransparent ? "bg-white shadow-[0_2px_4px_rgba(0,0,0,0.5)]" : "bg-gold"
                      )} />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn("relative text-[15px] md:text-[16px] uppercase tracking-[1.5px] font-semibold group transition-colors duration-300", 
                        location.pathname === item.href 
                          ? (isHeroTransparent ? "text-white drop-shadow-md" : "text-gold") 
                          : (isHeroTransparent ? "text-white/95 hover:text-white drop-shadow-md" : "text-text/90 hover:text-gold")
                      )}
                    >
                      {item.label}
                      <span className={cn(
                        "absolute -bottom-1 left-0 w-full h-[2px] transform origin-left transition-transform duration-300",
                        location.pathname === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        isHeroTransparent ? "bg-white shadow-[0_2px_4px_rgba(0,0,0,0.5)]" : "bg-gold"
                      )} />
                    </Link>
                  )}

                  {/* Desktop Dropdown */}
                  <AnimatePresence>
                    {item.subMenu && hoveredNav === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, rotateX: -15 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, y: 15, rotateX: -15 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ perspective: 1000, transformOrigin: "top" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[320px] bg-navy-800 border border-gold-muted/30 shadow-[0_30px_60px_rgba(0,0,0,0.4)] rounded-xl overflow-hidden p-3 pt-6 text-text"
                      >
                         <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
                        {item.subMenu.map((sub, idx) => (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.3 }}
                            key={sub.label}
                          >
                            <Link
                              to={sub.href}
                              className={cn("group flex items-center px-5 py-3 text-[12px] md:text-[13px] uppercase tracking-[1.5px] font-semibold rounded-lg transition-all duration-300",
                                location.pathname === sub.href ? "text-gold bg-text/5" : "text-text/90 hover:text-gold hover:bg-text/5"
                              )}
                            >
                              <span className={cn("transform transition-transform duration-300", 
                                location.pathname === sub.href ? "translate-x-2" : "translate-x-0 group-hover:translate-x-2"
                              )}>
                                {sub.label}
                              </span>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 220, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden pr-2"
                    >
                      <form onSubmit={handleSearch}>
                        <input
                          autoFocus
                          type="text"
                          placeholder="Recherche..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={cn(
                            "w-full bg-transparent border-b py-1.5 px-2 text-[13px] focus:outline-none transition-colors",
                            isHeroTransparent ? "border-white/50 text-white focus:border-white placeholder:text-white/60" : "border-text/30 text-text focus:border-gold placeholder:text-text/50"
                          )}
                        />
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button 
                  onClick={() => {
                    if (isSearchOpen && searchQuery.trim()) {
                      handleSearch();
                    } else {
                      setIsSearchOpen(!isSearchOpen);
                    }
                  }}
                  className={cn("p-2 transition-transform duration-300 hover:scale-110", isHeroTransparent ? "text-white drop-shadow-md" : "text-text/90 hover:text-gold")}
                  aria-label="Search"
                >
                  {isSearchOpen && !searchQuery.trim() ? <X size={20} /> : <SearchIcon size={20} />}
                </button>
              </div>

              <Link
                to="/dashboard"
                className={cn("p-2 transition-transform duration-300 hover:scale-110", isHeroTransparent ? "text-white hover:text-white/80 drop-shadow-md" : "text-text/90 hover:text-gold")}
                title="Espace Client"
              >
                <User size={20} />
              </Link>

              <Link
                to="/admin"
                className={cn("p-2 transition-transform duration-300 hover:scale-110", isHeroTransparent ? "text-white hover:text-white/80 drop-shadow-md" : "text-text/90 hover:text-gold")}
                title="Administration"
              >
                <ShieldCheck size={20} />
              </Link>

              <div className={cn("h-6 w-px", isHeroTransparent ? "bg-white/40 shadow-sm" : "bg-text/20")}></div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsCartOpen(true);
                }}
                className={cn(
                  "p-2 transition-all duration-300 hover:scale-110 relative rounded-full group",
                  isHeroTransparent ? "text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] drop-shadow-md" : "text-text/90 hover:text-gold hover:bg-gold/5 hover:drop-shadow-[0_0_8px_rgba(212,176,105,0.6)]"
                )}
                title="Panier"
              >
                <ShoppingCart size={20} className="transition-all duration-300" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-navy shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {cartCount}
                  </span>
                )}
              </button>
              <LanguageSwitcher />
              <ThemeToggle />
              <SettingsModal />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden items-center gap-2 sm:gap-4 z-50">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsCartOpen(true);
                }}
                className={cn(
                  "p-1.5 transition-all duration-300 hover:scale-110 relative rounded-full group",
                  isHeroTransparent ? "text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-text/90 hover:text-gold hover:bg-gold/5 hover:drop-shadow-[0_0_8px_rgba(212,176,105,0.6)]"
                )}
                title="Panier"
              >
                <ShoppingCart size={20} className="transition-all duration-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-navy shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {cartCount}
                  </span>
                )}
              </button>
              <LanguageSwitcher />
              <ThemeToggle />
              <button  
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "p-2 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold",
                  isOpen 
                    ? "border-transparent bg-text/10 text-text rotate-90" 
                    : isHeroTransparent 
                      ? "border-white/30 bg-transparent text-white" 
                      : "border-text/20 bg-transparent text-text"
                )}
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Full Screen Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-navy flex flex-col pt-32 px-6 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-8 flex-grow max-w-sm mx-auto w-full">
              {dynamicNavItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
                >
                  {item.subMenu ? (
                    <div className="flex flex-col gap-4">
                      <span className="text-sm font-semibold uppercase tracking-[3px] text-gold/60">{item.label}</span>
                      <div className="flex flex-col gap-5 pl-2">
                        {item.subMenu.map(sub => (
                          <Link 
                            key={sub.label}
                            to={sub.href} 
                            onClick={() => setIsOpen(false)} 
                            className="text-2xl font-display text-text font-light tracking-wide hover:text-gold transition-colors flex items-center gap-2 group"
                          >
                            <span className="w-0 h-px bg-gold transition-all duration-300 group-hover:w-4"></span>
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link 
                      to={item.href} 
                      onClick={() => setIsOpen(false)} 
                      className="text-3xl font-display text-text font-light hover:text-gold transition-colors inline-block"
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-12 pb-12 w-full max-w-sm mx-auto"
            >
              <form onSubmit={handleSearch} className="relative mb-10">
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-text/20 py-4 text-xl text-text placeholder:text-text/40 focus:outline-none focus:border-gold transition-colors"
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-gold">
                  <SearchIcon size={24} />
                </button>
              </form>

              <div className="grid grid-cols-2 gap-4 border-t border-text/10 pt-8">
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center gap-2 uppercase tracking-[2px] text-[10px] text-text/60 hover:text-gold transition-colors"
                >
                  <User size={14} /> Espace Client
                </Link>
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)} 
                  className="uppercase tracking-[2px] text-[10px] text-text/60 hover:text-gold transition-colors block text-right auto-cols-auto"
                >
                  Administration
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

