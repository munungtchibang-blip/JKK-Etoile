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
import { useCart } from "../components/CartContext";

import { useSearchParams } from "react-router-dom";

export default function Shop() {
  const { config, updateConfig } = useSiteConfig();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || "";
  const { cart, addToCart, cartCount, setIsCartOpen } = useCart();
  
  const [filter, setFilter] = useState("all");
  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | null>(null);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  useEffect(() => {
    if (searchParams.has('q')) {
      setSearchQuery(searchParams.get('q') || "");
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      quantity: 1,
      type: 'shop',
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

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
            show: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
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
                
                <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setQuickViewProduct(product);
                    }}
                    className="pointer-events-auto flex items-center gap-2 bg-navy/90 backdrop-blur-sm border border-gold/50 text-gold px-4 py-2 text-[10px] uppercase tracking-widest font-semibold hover:bg-gold hover:text-navy transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                  >
                    Aperçu rapide
                  </button>
                </div>
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
      addToCart({
        id: product.id,
        quantity: 1,
        type: 'shop',
        name: product.name,
        price: product.price,
        image: product.image
      });
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

      {/* Cart Modal has been migrated to global CartDrawer in Layout */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-[100px] right-6 z-[90] flex items-center justify-center p-4 bg-gold rounded-full shadow-[0_4px_20px_rgba(212,176,105,0.3)] hover:bg-[#d4b069] transition-transform hover:scale-105"
        >
          <ShoppingCart size={24} className="text-[#0f172a]" />
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-navy">
            {cartCount}
          </span>
        </button>
      )}

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
              onClick={() => setQuickViewProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }}
              className="relative w-full max-w-4xl bg-navy-800 border border-gold-muted/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-navy/50 backdrop-blur-sm text-text/60 hover:text-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="md:w-1/2 aspect-square md:aspect-auto bg-navy-900 relative">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="md:w-1/2 p-6 md:p-10 flex flex-col">
                <div className="mb-2 text-[10px] text-text/60 font-medium uppercase tracking-widest">
                  {quickViewProduct.category}
                </div>
                <h2 className="text-2xl font-semibold text-text mb-4">
                  {quickViewProduct.name}
                </h2>
                <div className="text-3xl font-light text-gold mb-6">
                  {quickViewProduct.price}$
                </div>
                
                <div className="text-sm text-text/80 mb-8 whitespace-pre-wrap leading-relaxed flex-grow">
                  {quickViewProduct.description || "Aucune description détaillée disponible pour ce produit."}
                </div>
                
                <div className="flex items-center gap-4 mt-auto">
                  <button
                    onClick={() => {
                      if (quickViewProduct.stockStatus !== "Rupture" && quickViewProduct.available !== false) {
                        addToCart({
                          id: quickViewProduct.id,
                          quantity: 1,
                          type: 'shop',
                          name: quickViewProduct.name,
                          price: quickViewProduct.price,
                          image: quickViewProduct.image
                        });
                        setQuickViewProduct(null);
                        setIsCartOpen(true);
                      }
                    }}
                    disabled={quickViewProduct.stockStatus === "Rupture" || quickViewProduct.available === false}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-xs tracking-widest uppercase font-semibold transition-colors ${
                      quickViewProduct.stockStatus === "Rupture" || quickViewProduct.available === false
                        ? "bg-navy-800 text-text/30 cursor-not-allowed border border-text/10"
                        : "bg-gold text-[#0f172a] hover:bg-[#d4b069]"
                    }`}
                  >
                    {quickViewProduct.stockStatus === "Rupture" || quickViewProduct.available === false ? (
                      "En Rupture"
                    ) : quickViewProduct.stockStatus === "Arrivage" ? (
                      "Précommander"
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        Ajouter au panier
                      </>
                    )}
                  </button>
                  <Link
                    to={`/shop/${quickViewProduct.id}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="flex items-center justify-center p-4 border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                    title="Voir les détails complets"
                  >
                    <Plus size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
</div>
  );
}
