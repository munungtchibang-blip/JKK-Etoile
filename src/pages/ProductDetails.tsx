import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, StarHalf, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteConfig } from '../components/SiteContext';
import { LazyImage } from '../components/LazyImage';

export default function ProductDetails() {
  const { id } = useParams();
  const { config, updateConfig } = useSiteConfig();
  const product = config.products?.find((p) => p.id === Number(id));
  const [activeImage, setActiveImage] = useState(0);
  
  const [reviewForm, setReviewForm] = useState({ name: '', text: '', rating: 5 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEndGallery = () => {
    if (!touchStart || !touchEnd || !product) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    const validGallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

    if (isLeftSwipe && activeImage < validGallery.length - 1) {
      setActiveImage(prev => prev + 1);
    }
    if (isRightSwipe && activeImage > 0) {
      setActiveImage(prev => prev - 1);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-[280px] pb-16 text-center text-text">
        <h2 className="text-2xl font-light mb-4">Produit introuvable</h2>
        <Link to="/shop" className="text-gold font-semibold uppercase tracking-wider text-xs">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'text-gold fill-gold' : 'text-text/20'}
        />
      );
    }
    return stars;
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text) return;
    
    setIsSubmittingReview(true);
    setTimeout(() => {
      setIsSubmittingReview(false);
      setReviewSubmitted(true);
      // In a real app we'd save this to the DB. For now optimistically insert to local visual display
      product.reviews.unshift({
        author: reviewForm.name,
        text: reviewForm.text,
        rating: reviewForm.rating
      });
      setTimeout(() => {
        setReviewSubmitted(false);
        setReviewForm({ name: '', text: '', rating: 5 });
      }, 3000);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[280px] pb-16 sm:px-6 lg:px-8">
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0f172a]/95 backdrop-blur-md flex items-center justify-center p-4 outline-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative w-full max-w-6xl flex items-center justify-center h-full">
               <LazyImage 
                 src={(product.gallery && product.gallery.length > 0 ? product.gallery : [product.image])[activeImage] || product.image} 
                 alt={product.name} 
                 className="max-h-[90vh] max-w-full object-contain cursor-zoom-out rounded border border-white/5"
               />
               
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                 {(product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]).map((img, idx) => (
                   <button 
                     key={idx}
                     onClick={(e) => { e.stopPropagation(); setActiveImage(idx); }}
                     className={`w-3 h-3 rounded-full transition-all ${activeImage === idx ? 'bg-gold scale-125' : 'bg-white/30 hover:bg-white/60'}`}
                   />
                 ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link to="/shop" className="inline-flex items-center gap-2 text-gold hover:text-text transition-colors mb-8 text-[11px] uppercase tracking-wider focus:outline-none focus:underline">
        <ArrowLeft size={16} /> Retour à la boutique
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Gallery */}
        <div className="flex flex-col gap-4"
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEndGallery}
        >
          <motion.div 
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="aspect-square w-full relative overflow-hidden bg-navy-800 border border-gold-muted/30"
          >
            {product.isNew && (
              <span className="absolute top-4 left-4 z-10 bg-gold text-[#0f172a] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded shadow-md">
                Nouveau
              </span>
            )}
            <div className="w-full h-full cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
              <LazyImage 
                src={(product.gallery && product.gallery.length > 0 ? product.gallery : [product.image])[activeImage] || product.image} 
                alt={product.name} 
                className="h-full w-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
              />
            </div>
          </motion.div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {(product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]).map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`shrink-0 w-20 h-20 border transition-colors ${activeImage === idx ? 'border-gold p-1' : 'border-gold-muted/30 opacity-70 hover:opacity-100'}`}
              >
                <LazyImage src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

          <div className="flex flex-col flex-1">
            <span className="text-[10px] uppercase tracking-widest text-gold mb-2 font-medium">{product.category}</span>
            <h1 className="text-3xl sm:text-4xl font-display font-light text-text mb-2 leading-tight text-balance">{product.name}</h1>
            <div className="flex items-end gap-3 mb-6">
              <div className="text-3xl text-text font-medium">${product.price}</div>
              {product.stockStatus ? (
                 <div className={`text-sm font-medium mb-1 ${product.stockStatus === 'Rupture' ? 'text-red-500' : 'text-green-500'}`}>{product.stockStatus}</div>
              ) : (
                 <div className="text-sm text-green-500 font-medium mb-1">En stock</div>
              )}
            </div>

            <div className="prose max-w-none text-text/80 mb-8 border-b border-gold-muted/30 pb-8 prose-p:font-light prose-p:text-sm prose-p:leading-relaxed prose-p:text-pretty">
              <p>{product.description}</p>
            </div>



            <div className="flex flex-col sm:flex-row gap-4 mb-8">
               <button 
                 onClick={() => {
                    const newOrder = {
                      id: `#CMD-${String((config.orders?.length ? Math.max(...config.orders.map(o => parseInt(o.id.replace(/\D/g, "") || "0"))) : 0) + 1).padStart(3, "0")}`,
                      client: "Client WhatsApp",
                      item: `Produit: ${product.name}`,
                      date: new Date().toLocaleDateString('fr-FR'),
                      status: "En cours",
                      statusColor: "text-amber-400 bg-amber-500/20 border-amber-500/40 font-semibold"
                    };
                    updateConfig({ orders: [newOrder, ...(config.orders || [])] });

                    const imageUrl = new URL(product.image, window.location.origin).href;
                    const message = `Bonjour, je souhaite passer commande pour le produit: ${product.name} (${product.price}$).\n\nImage : ${imageUrl}`;
                    const num = String(config.contactWhatsapp || '').replace(/[^0-9]/g, '');
                    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
                 }}
                 className="flex-1 bg-gold text-[#0f172a] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#c4a059] transition-all focus:outline-none flex items-center justify-center gap-2 rounded-lg shadow-lg hover:shadow-gold/20 active:scale-95"
               >
                  <ShoppingCart size={16} /> Commander sur WhatsApp
               </button>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gold-muted/30 pt-8 mt-auto">
              <div className="flex items-center gap-3 text-text/90 font-medium text-sm ">
                <Truck size={18} className="text-gold" />
                <span>Importation express</span>
              </div>
              <div className="flex items-center gap-3 text-text/90 font-medium text-sm ">
                <ShieldCheck size={18} className="text-gold" />
                <span>Garantie authenticité</span>
              </div>
            </div>
          </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 pt-16 border-t border-gold-muted/30">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
           <div className="flex-1">
              <h2 className="text-2xl font-light text-text mb-2">Avis clients</h2>
              <div className="flex items-center gap-2 mb-6">
                 <div className="flex">{renderStars(5)}</div>
                 <span className="text-xs text-text/90 font-medium">{product.reviews.length} avis</span>
              </div>
              
              {reviewSubmitted ? (
                 <div className="bg-green-500/10 border border-green-500/30 text-green-500 dark:text-green-400 p-4 rounded-lg text-sm mb-8">
                   Merci pour votre avis ! Il a été publié avec succès.
                 </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="bg-glass border border-gold-muted/30 p-6 rounded-xl space-y-4 max-w-xl">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-text/90 font-medium mb-4">Laisser un avis</h3>
                  
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-text/70 block mb-2">Votre note</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star size={20} className={star <= reviewForm.rating ? 'text-gold fill-gold' : 'text-text/20'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Votre nom"
                      required
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="w-full bg-navy border border-text/10 p-3 text-sm text-text focus:outline-none focus:border-gold rounded-lg transition-colors"
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Votre commentaire..."
                      required
                      rows={3}
                      value={reviewForm.text}
                      onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                      className="w-full bg-navy border border-text/10 p-3 text-sm text-text focus:outline-none focus:border-gold rounded-lg transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview || !reviewForm.name || !reviewForm.text}
                    className="bg-gold px-6 py-3 text-[10px] uppercase tracking-widest font-semibold text-[#0f172a] rounded-lg hover:bg-[#d4b069] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Envoi...' : 'Publier mon avis'}
                  </button>
                </form>
              )}
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.reviews.map((review, idx) => (
            <div key={idx} className="bg-glass border border-gold-muted p-6 rounded-xl">
              <div className="flex mb-3">
                 {renderStars(review.rating)}
              </div>
              <p className="text-sm font-light text-text/80 mb-4">{review.text}</p>
              <div className="text-[10px] uppercase tracking-widest text-gold font-semibold">{review.author}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
