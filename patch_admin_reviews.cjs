const fs = require('fs');
let content = fs.readFileSync('./src/pages/Admin.tsx', 'utf8');

content = content.replace(
  '{ id: "messages", label: "Messages", icon: SettingsIcon },',
  '{ id: "messages", label: "Messages", icon: MessageCircle },\n    { id: "reviews", label: "Avis Clients", icon: Star },'
);

const reviewsTabContent = `
        {activeTab === "reviews" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-display mb-6">Avis Clients</h2>
            <div className="space-y-4">
              {(!config.reviews || config.reviews.length === 0) ? (
                <p className="text-text/50">Aucun avis pour le moment.</p>
              ) : (
                config.reviews.map((review) => (
                  <div key={review.id} className="bg-glass border border-gold-muted/20 p-6 rounded-lg relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-text">{review.name}</h4>
                          <span className="text-[10px] bg-navy px-2 py-0.5 rounded text-gold uppercase tracking-widest">{review.service}</span>
                          <span className="text-xs text-text/50">{review.date}</span>
                        </div>
                        <div className="flex text-gold mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? '' : 'text-text/20'} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.status === 'pending' && (
                          <button
                            onClick={() => {
                              showToast("Avis approuvé");
                              const updated = config.reviews?.map(r => r.id === review.id ? { ...r, status: 'approved' } : r);
                              updateConfig({ reviews: updated });
                            }}
                            className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded transition-colors"
                            title="Approuver"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if(window.confirm("Voulez-vous vraiment supprimer cet avis ?")) {
                              showToast("Avis supprimé");
                              const updated = config.reviews?.filter(r => r.id !== review.id);
                              updateConfig({ reviews: updated });
                            }
                          }}
                          className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-text/80">{review.comment}</p>
                    {review.status === 'pending' && (
                      <span className="absolute top-4 right-20 text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded font-bold uppercase tracking-wider">En attente</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
`;

content = content.replace(
  '{activeTab === "settings" && (',
  reviewsTabContent + '\n        {activeTab === "settings" && ('
);

const iconMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/);
if (iconMatch && (!iconMatch[1].includes('Star') || !iconMatch[1].includes('MessageCircle'))) {
  let icons = iconMatch[1].split(',').map(s => s.trim());
  ['Star', 'MessageCircle'].forEach(ic => {
    if(!icons.includes(ic)) icons.push(ic);
  });
  content = content.replace(iconMatch[0], `import { ${icons.join(', ')} } from 'lucide-react'`);
}

fs.writeFileSync('./src/pages/Admin.tsx', content);
