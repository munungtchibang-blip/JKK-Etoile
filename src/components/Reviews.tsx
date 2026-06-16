import React, { useState } from 'react';
import { useSiteConfig, ReviewItem } from './SiteContext';
import { Star, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface ReviewsProps {
  serviceId?: string;
  serviceTitle?: string;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export function Reviews({ serviceId, serviceTitle, className, layout = 'horizontal' }: ReviewsProps) {
  const { config, updateConfig } = useSiteConfig();
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newReview: ReviewItem = {
      id: Date.now().toString(),
      name,
      rating,
      comment,
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'pending',
      service: serviceTitle || 'Général'
    };

    updateConfig({ reviews: [...(config.reviews || []), newReview] });
    setSubmitted(true);
    setName('');
    setComment('');
    setRating(5);
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  const approvedReviews = (config.reviews || []).filter(r => r.status === 'approved' && (!serviceTitle || r.service === serviceTitle || r.service === 'Général'));

  return (
    <div className={className || "w-full max-w-4xl mx-auto mt-16 px-4"}>
      <div className={`flex gap-8 ${layout === 'vertical' ? 'flex-col' : 'flex-col md:flex-row'}`}>
        
        {/* Formulaire d'avis */}
        <div className={layout === 'vertical' ? 'w-full' : 'md:w-1/3'}>
          <div className="bg-glass border border-gold-muted/20 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h3 className="text-xl font-display text-gold mb-6 border-b border-gold-muted/20 pb-4">Laisser un avis</h3>
            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-500/20 text-green-400 p-4 rounded text-sm text-center border border-green-500/30">
                Merci pour votre avis ! Il est en attente de modération.
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-text/70 mb-1 block">Votre nom</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-navy border border-text/10 p-2 text-sm text-text focus:outline-none focus:border-gold rounded transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-text/70 mb-1 block">Note</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-colors ${star <= rating ? 'text-gold' : 'text-text/20 hover:text-text/50'}`}
                      >
                        <Star size={20} fill={star <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-text/70 mb-1 block">Commentaire</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-navy border border-text/10 p-2 text-sm text-text focus:outline-none focus:border-gold rounded transition-colors"
                  ></textarea>
                </div>
                <button type="submit" className="w-full px-4 py-2 bg-gold text-navy font-medium text-sm rounded hover:bg-yellow-500 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                  <Send size={14} /> Envoyer
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Liste des avis */}
        <div className={layout === 'vertical' ? 'w-full' : 'md:w-2/3'}>
          <h3 className="text-xl font-display text-text mb-6">Avis de nos clients</h3>
          {approvedReviews.length === 0 ? (
            <p className="text-text/50 text-sm italic">Soyez le premier à laisser un avis pour ce service !</p>
          ) : (
            <div className="space-y-4">
              {approvedReviews.map((review, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-navy/50 border border-text/5 p-4 rounded-xl flex flex-col sm:flex-row gap-4">
                  <div className="w-10 h-10 bg-gold/10 text-gold rounded-full flex items-center justify-center font-display font-bold shrink-0">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-text">{review.name}</span>
                      <span className="text-[10px] text-text/40">{review.date}</span>
                    </div>
                    <div className="flex text-gold mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? '' : 'text-text/20'} />
                      ))}
                    </div>
                    <p className="text-sm text-text/80">{review.comment}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
