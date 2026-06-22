import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  Trash2,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { useSiteConfig } from "../components/SiteContext";
import { LazyImage } from "../components/LazyImage";

import { useSearchParams } from "react-router-dom";

export default function Shop() {
  const { config, updateConfig } = useSiteConfig();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || "";
  
  const [filter, setFilter] = useState("all");
  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | null>(null);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>(() => {
    const saved = localStorage.getItem('jkk_shop_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('jkk_shop_cart', JSON.stringify(cart));
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: cart, 1: payment, 2: success
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    // Artificial 800ms delay removed
  }, []);

  useEffect(() => {
    // Removed 800ms delay for fluid filtering
  }, [filter, sortPrice, minPrice, maxPrice, searchQuery]);

  let filteredProducts = filter === "all" ? [...(config.products || [])] : [];
  
  if (filter !== "all") {
    if (filter === "iphone") {
      filteredProducts = (config.products || []).filter((p) => (p.category === "smartphones" && p.name.toLowerCase().includes("iphone")) || p.category === "iphone");
    } else if (filter === "samsung") {
      filteredProducts = (config.products || []).filter((p) => (p.category === "smartphones" && (p.name.toLowerCase().includes("samsung") || p.name.toLowerCase().includes("galaxy"))) || p.category === "samsung");
    } else if (filter === "smartphones") {
      filteredProducts = (config.products || []).filter((p) => p.category === "smartphones" || p.category === "iphone" || p.category === "samsung" || p.category === "smartphone");
    } else {
      filteredProducts = (config.products || []).filter((p) => p.category === filter || p.category === filter.replace(/s$/, ''));
    }
  }

  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) => 
        p.name.toLowerCase().includes(query) || 
        (p.description && p.description.toLowerCase().includes(query))
    );
  }

  if (minPrice !== "") {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= Number(minPrice),
    );
  }
  if (maxPrice !== "") {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= Number(maxPrice),
    );
  }

  if (sortPrice === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortPrice === "desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const addToCart = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing)
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      return [...prev, { id, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const total = cart.reduce((acc, item) => {
    const p = config.products?.find((p) => p.id === item.id);
    return acc + (p?.price || 0) * item.quantity;
  }, 0);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (isPageLoading) {
    return (
      <div className="pt-24 min-h-screen bg-navy pb-20 animate-pulse">
        <div className="w-full h-64 md:h-80 bg-navy-800 mb-12"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-40 bg-navy-800 border border-gold-muted/20 rounded-2xl mb-12 -mt-24 relative z-10"></div>
          
          <div className="flex gap-4 mb-8">
            <div className="h-10 w-24 bg-navy-800 rounded"></div>
            <div className="h-10 w-24 bg-navy-800 rounded"></div>
            <div className="h-10 w-24 bg-navy-800 rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col bg-navy-800/50 p-4 border border-gold-muted/20 rounded-xl h-[350px]">
                  <div className="relative mb-4 h-48 bg-navy-800 rounded"></div>
                  <div className="h-3 w-1/3 bg-navy-800 rounded mb-3"></div>
                  <div className="h-4 w-3/4 bg-navy-800 rounded mb-4"></div>
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="h-6 w-16 bg-navy-800 rounded"></div>
                    <div className="h-10 w-24 bg-navy-800 rounded border border-gold-muted/30"></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-navy pb-20">
      <div className="w-full h-64 md:h-80 relative mb-12">
        <LazyImage 
          src={config.shopCoverImage || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070"} 
          alt={config.shopTitle || "Boutique Express"} 
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent"></div>
        <div className="absolute inset-0 bg-navy/40 backdrop-blur-[3px]"></div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 -mt-24 bg-glass backdrop-blur-md p-6 rounded-2xl border border-gold-muted/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      >
        <div>
          <span className="text-[12px] uppercase tracking-[4px] text-gold mb-2 block">
            Shopping
          </span>
          <h1 className="text-3xl font-display text-gold sm:text-4xl drop-shadow-md mb-2">
            {config.shopTitle || "Boutique Express"}
          </h1>
          <p className="mt-4 text-sm  text-text/90 font-medium uppercase tracking-widest">
            {config.shopDescription || "Produits authentiques importés directement de Dubai."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex-1 md:flex-none relative flex items-center justify-center gap-2 border border-gold-muted bg-glass px-6 py-3 text-xs tracking-widest uppercase font-semibold text-text hover:text-gold transition-colors"
          >
            <ShoppingCart size={16} />
            Mon Panier
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-[#0f172a]">
                {cartCount}
              </span>
            )}
          </button>
          <a
            href={`https://wa.me/${"243826636212"}?text=${encodeURIComponent('Bonjour, je souhaite avoir plus de détails concernant la boutique.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-gold/50 bg-transparent px-6 py-3 text-xs tracking-widest uppercase font-semibold text-gold hover:bg-gold/10 transition-colors"
          >
            Discuter sur WhatsApp
          </a>
        </div>
      </motion.div>

      {/* Filters & Sorting */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto sm:mx-0 w-full mb-6">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-glass border border-gold-muted/50 rounded-full py-3 pl-12 pr-4 text-sm text-text focus:outline-none focus:border-gold transition-colors placeholder:text-text/40 shadow-inner"
          />
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gold opacity-70" />
        </div>
      </div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4 border-b border-gold-muted pb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {[
            { id: "all", label: "Tous" },
            { id: "smartphones", label: "Tous Smartphones" },
            { id: "iphone", label: "iPhone" },
            { id: "samsung", label: "Samsung" },
            { id: "parfums", label: "Parfums" },
            { id: "gadgets", label: "Gadgets" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`relative whitespace-nowrap px-6 py-2.5 text-[11px] uppercase tracking-wider font-semibold transition-colors border ${
                filter === cat.id
                  ? "text-[#0f172a] border-gold"
                  : "bg-transparent text-text border-gold-muted hover:border-gold"
              }`}
            >
              {filter === cat.id && (
                <motion.div
                  layoutId="shop-tab-indicator"
                  className="absolute inset-0 bg-gold -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 mr-4 hidden sm:flex">
            <input
              type="number"
              placeholder="Min $"
              value={minPrice}
              onChange={(e) =>
                setMinPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-20 bg-transparent border-b border-text/20 text-xs font-light text-text outline-none focus:border-gold pb-1 text-center"
            />
            <span className="text-text/90 font-medium">-</span>
            <input
              type="number"
              placeholder="Max $"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-20 bg-transparent border-b border-text/20 text-xs font-light text-text outline-none focus:border-gold pb-1 text-center"
            />
          </div>
          <span className="text-[10px] uppercase text-text/90 font-medium tracking-widest mr-2 hidden sm:inline">
            Trier par prix:
          </span>
          <button
            onClick={() => setSortPrice(sortPrice === "asc" ? null : "asc")}
            className={`p-2 transition-colors border ${sortPrice === "asc" ? "border-gold text-gold bg-white/5" : "border-gold-muted text-text/90 font-medium hover:text-text"}`}
          >
            <span className="sr-only">Croissant</span>
            <ArrowUpCircle size={16} />
          </button>
          <button
            onClick={() => setSortPrice(sortPrice === "desc" ? null : "desc")}
            className={`p-2 transition-colors border ${sortPrice === "desc" ? "border-gold text-gold bg-white/5" : "border-gold-muted text-text/90 font-medium hover:text-text"}`}
          >
            <span className="sr-only">Décroissant</span>
            <ArrowDownCircle size={16} />
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {(filter !== "all" ||
        sortPrice !== null ||
        minPrice !== "" ||
        maxPrice !== "") && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase text-text/90 font-medium tracking-widest mr-2">
            Filtres actifs :
          </span>
          {filter !== "all" && (
            <span className="inline-flex items-center gap-1 border border-gold/30 bg-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold rounded-full">
              {filter}
              <button
                onClick={() => setFilter("all")}
                className="ml-1 text-gold hover:text-text transition-colors focus:outline-none focus:text-text"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {minPrice !== "" && (
            <span className="inline-flex items-center gap-1 border border-gold/30 bg-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold rounded-full">
              Min: {minPrice}$
              <button
                onClick={() => setMinPrice("")}
                className="ml-1 text-gold hover:text-text transition-colors focus:outline-none focus:text-text"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {maxPrice !== "" && (
            <span className="inline-flex items-center gap-1 border border-gold/30 bg-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold rounded-full">
              Max: {maxPrice}$
              <button
                onClick={() => setMaxPrice("")}
                className="ml-1 text-gold hover:text-text transition-colors focus:outline-none focus:text-text"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {sortPrice !== null && (
            <span className="inline-flex items-center gap-1 border border-gold/30 bg-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold rounded-full">
              Tri: {sortPrice === "asc" ? "Croissant" : "Décroissant"}
              <button
                onClick={() => setSortPrice(null)}
                className="ml-1 text-gold hover:text-text transition-colors focus:outline-none focus:text-text"
              >
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setFilter("all");
              setMinPrice("");
              setMaxPrice("");
              setSortPrice(null);
            }}
            className="text-[10px] uppercase tracking-wider text-text/90 font-medium hover:text-text transition-colors ml-2 underline focus:outline-none"
          >
            Tout effacer
          </button>
        </div>
      )}

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isLoading ? "loading" : "loaded"}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: 20 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col bg-glass p-4 border border-gold-muted/50 rounded-xl h-full animate-pulse">
              <div className="relative mb-4 aspect-square bg-navy-800 rounded"></div>
              <div className="h-3 w-1/3 bg-navy-800 rounded mb-3"></div>
              <div className="h-4 w-3/4 bg-navy-800 rounded mb-4"></div>
              <div className="flex items-center justify-between mt-auto pt-4">
                <div className="h-6 w-16 bg-navy-800 rounded"></div>
                <div className="h-10 w-24 bg-navy-800 rounded border border-gold-muted/30"></div>
              </div>
            </div>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-20 text-text/60 font-light">
            Aucun produit ne correspond à vos filtres.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <motion.div
              layout
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                show: { opacity: 1, scale: 1 },
              }}
              whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            key={product.id}
          >
            <Link
              to={`/shop/${product.id}`}
              className="block h-full group bg-glass p-4 border border-gold-muted/50 rounded-xl transition-all shadow-md hover:shadow-2xl hover:shadow-gold/10 hover:border-gold/80 focus:outline-none focus:ring-2 focus:ring-gold flex flex-col"
            >
              <div className="relative mb-4 aspect-square overflow-hidden bg-navy-800">
                                {product.isNew && (
                  <span className="absolute top-2 left-2 z-10 bg-gold text-[#0f172a] text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-md">
                    Nouveau
                  </span>
                )}
                {product.stockStatus && (
                  <span className={`absolute top-2 right-2 z-10 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-md ${product.stockStatus === 'Rupture' ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'}`}>
                    {product.stockStatus}
                  </span>
                )}

                <LazyImage
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mb-2 text-[10px] text-text/90 font-medium uppercase tracking-widest ">
                {product.category}
              </div>
              <h3 className="mb-2 text-[13px] uppercase tracking-[1px] font-semibold text-text line-clamp-1">
                {product.name}
              </h3>
              <div className="flex items-center justify-between mt-auto pt-4">
                <span className="text-xl font-light text-text">
                  {product.price}$
                </span>
                <button
  onClick={(e) => {
    e.preventDefault();
    if (product.stockStatus !== "Rupture" && product.available !== false) {
      addToCart(product.id);
    }
  }}
  disabled={product.stockStatus === "Rupture" || product.available === false}
  className={`border p-3 transition-colors focus:outline-none flex items-center gap-2 ${product.stockStatus === "Rupture" || product.available === false ? "border-red-500/30 text-red-500/50 cursor-not-allowed" : product.stockStatus === "Arrivage" ? "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-[#0f172a]" : "border-gold text-gold hover:bg-gold hover:text-[#0f172a]"}`}
  aria-label={`Ajouter ${product.name} au panier`}
>
                  {product.stockStatus === "Rupture" || product.available === false ? (
    <span className="text-[10px] uppercase font-semibold hidden sm:inline">Rupture</span>
  ) : product.stockStatus === "Arrivage" ? (
    <span className="text-[10px] uppercase font-semibold hidden sm:inline">Préco</span>
  ) : (
    <span className="text-[10px] uppercase font-semibold hidden sm:inline">+ Panier</span>
  )}
  {product.stockStatus !== "Rupture" && product.available !== false && <Plus size={16} />}
                </button>
              </div>
            </Link>
          </motion.div>
        )))}
        </motion.div>
      </AnimatePresence>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#334155]/70 backdrop-blur-md dark-glass-text">
          <div className="w-full max-w-lg max-h-[85vh] bg-navy-800 border border-gold-muted/30 rounded-xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="p-6 border-b border-gold-muted flex items-center justify-between">
              <h2 className="text-[13px] uppercase tracking-[1px] font-semibold text-gold">
                Mon Panier
              </h2>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutStep(0);
                }}
                className="text-text hover:text-gold transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {checkoutStep === 0 &&
                (cart.length === 0 ? (
                  <div className="text-center py-20 text-text/90 font-medium">
                    <ShoppingCart
                      size={48}
                      className="mx-auto mb-4 opacity-20 text-gold"
                    />
                    <p className="text-[11px] uppercase tracking-widest">
                      Votre panier est vide
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => {
                      const p = config.products?.find((p) => p.id === item.id);
                      if (!p) return null;
                      return (
                        <div
                          key={item.id}
                          className="flex gap-4 items-center bg-glass border border-gold-muted p-2"
                        >
                          <LazyImage
                            src={p.image}
                            alt={p.name}
                            className="w-20 h-20 object-cover bg-navy-800"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-text text-[11px] uppercase tracking-wider line-clamp-1 mb-1">
                              {p.name}
                            </h4>
                            <div className="text-gold text-xs mb-2 font-light">
                              {p.price}$
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 border border-gold-muted flex items-center justify-center text-text hover:text-gold transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-[11px] font-medium w-4 text-center text-text">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 border border-gold-muted flex items-center justify-center text-text hover:text-gold transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                          <div className="font-light text-text text-sm pr-4">
                            {p.price * item.quantity}$
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}

              {checkoutStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-[13px] uppercase tracking-[1px] font-semibold text-gold mb-4">
                    Paiement Mobile Money
                  </h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-full flex items-center justify-between p-4 border border-gold-muted bg-glass hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 font-semibold text-text text-[11px] uppercase tracking-wider">
                        <CreditCard size={18} className="text-gold" /> M-PESA
                      </div>
                      <span className="text-gold text-sm font-light">
                        Payer {total}$
                      </span>
                    </button>
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-full flex items-center justify-between p-4 border border-gold-muted bg-glass hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 font-semibold text-text text-[11px] uppercase tracking-wider">
                        <CreditCard size={18} className="text-gold" /> Orange
                        Money
                      </div>
                      <span className="text-gold text-sm font-light">
                        Payer {total}$
                      </span>
                    </button>
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-full flex items-center justify-between p-4 border border-gold-muted bg-glass hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 font-semibold text-text text-[11px] uppercase tracking-wider">
                        <CreditCard size={18} className="text-gold" /> Airtel
                        Money
                      </div>
                      <span className="text-gold text-sm font-light">
                        Payer {total}$
                      </span>
                    </button>
                  </div>
                  <div className="mt-8 text-[10px] uppercase tracking-widest text-text/90 font-medium text-center  leading-relaxed">
                    Taux de change appliqué à la validation. <br />
                    L'équivalent en Francs Congolais (CDF) sera débité.
                  </div>
                </div>
              )}

              {checkoutStep === 2 && (
                <div className="text-center py-10 mt-10">
                  <div className="w-20 h-20 border border-gold text-gold rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-text mb-2">
                    Paiement Réussi !
                  </h3>
                  <p className="text-text/90 font-medium text-[11px] uppercase tracking-wider mb-8 ">
                    Votre commande a été confirmée.
                  </p>
                  <button
                    onClick={() => {
                      setCart([]);
                      setIsCartOpen(false);
                      setCheckoutStep(0);
                    }}
                    className="bg-gold text-[#0f172a] text-xs tracking-widest uppercase font-semibold px-8 py-3 transition-colors hover:bg-[#d4b069]"
                  >
                    Retour à la boutique
                  </button>
                </div>
              )}
            </div>

            {checkoutStep === 0 && cart.length > 0 && (
              <div className="p-6 border-t border-gold-muted bg-navy">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] uppercase tracking-wider text-text/90 font-medium">
                    Sous-total
                  </span>
                  <span className="text-sm font-light text-text">{total}$</span>
                </div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-text/90 font-medium">
                    Total à payer
                  </span>
                  <span className="text-2xl font-light text-gold">
                    {total}$
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      const clientName = localStorage.getItem('jkk_user_name') || "Client WhatsApp";
                      const clientEmail = localStorage.getItem('jkk_user_email') || "";
                      
                      const newOrder = {
                        id: `#CMD-${String((config.orders?.length ? Math.max(...config.orders.map(o => parseInt(o.id.replace(/\D/g, "") || "0"))) : 0) + 1).padStart(3, "0")}`,
                        client: clientName,
                        item: cart.map(item => {
                          const p = config.products?.find((p) => p.id === item.id);
                          return p ? `${item.quantity}x ${p.name}` : '';
                        }).filter(Boolean).join(', '),
                        date: new Date().toLocaleDateString('fr-FR'),
                        status: "En cours",
                        statusColor: "text-amber-400 bg-amber-500/20 border-amber-500/40 font-semibold"
                      };
                      
                      updateConfig({ orders: [newOrder, ...(config.orders || [])] });

                      const itemsText = cart
                        .map((item) => {
                          const p = config.products?.find((p) => p.id === item.id);
                          if (!p) return '';
                          const imageUrl = new URL(p.image, window.location.origin).href;
                          return `${item.quantity}x ${p.name} (${p.price}$)\n  Image : ${imageUrl}`;
                        })
                        .join("\n\n");
                      const message = `Bonjour, je souhaite passer commande pour les articles suivants:\n\n${itemsText}\n\nTotal: ${total}$`;
                      const num = "243826636212";
                      window.open(
                        `https://wa.me/${num}?text=${encodeURIComponent(message)}`,
                        "_blank",
                      );
                      setCart([]); // Clear cart after order
                      setCheckoutStep(0);
                    }}
                    className="w-full bg-gold text-[#0f172a] font-semibold text-xs py-4 tracking-widest uppercase hover:bg-[#d4b069] transition-all focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy active:scale-95"
                  >
                    Commander sur WhatsApp
                  </button>
                  <button
                    onClick={() => setCart([])}
                    className="w-full flex items-center justify-center gap-2 border border-text/10 text-text/90 font-medium text-[10px] py-3 tracking-widest uppercase hover:bg-white/5 hover:text-text transition-colors focus:outline-none focus:ring-1 focus:ring-white/20"
                  >
                    <Trash2 size={14} /> Vider le panier
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-[100px] right-6 z-50 flex items-center justify-center p-4 bg-gold rounded-full shadow-lg hover:bg-[#d4b069] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy shadow-[0_4px_20px_rgba(212,176,105,0.3)]"
          aria-label="Ouvrir le panier"
        >
          <ShoppingCart size={24} className="text-[#0f172a]" />
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-navy">
            {cartCount}
          </span>
        </button>
      )}
      </div>
</div>
  );
}
