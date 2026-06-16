import fs from 'fs';
const file = './src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `  const renderDropzone = (value: string, onChange: (val: string) => void) => {
    return (
      <div 
        className="relative border-2 border-dashed border-gold-muted/20 hover:border-gold/50 rounded-lg p-6 bg-navy-800/30 transition-all text-center flex flex-col items-center justify-center gap-2 group min-h-[120px] cursor-pointer"
        onClick={() => {
          if (value) return; 
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  let width = img.width;
                  let height = img.height;
                  const MAX_DIMENSION = 800;
                  if (width > height && width > MAX_DIMENSION) {
                    height *= MAX_DIMENSION / width;
                    width = MAX_DIMENSION;
                  } else if (height > MAX_DIMENSION) {
                    width *= MAX_DIMENSION / height;
                    height = MAX_DIMENSION;
                  }
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  ctx?.drawImage(img, 0, 0, width, height);
                  const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
                  onChange(compressedDataUrl);
                };
                img.src = event.target?.result as string;
              };
              reader.readAsDataURL(file);
            }
          };
          input.click();
        }}
      >
        {value ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img src={value} alt="Preview" className="max-h-32 object-contain rounded" />
            <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(""); }}
                className="bg-red-500/80 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                title="Supprimer l'image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <ImageIcon size={24} className="text-text/40 group-hover:text-gold transition-colors" />
            <p className="text-xs text-text/60">
              Appuyez pour sélectionner une image (mobile/pc)
            </p>
          </>
        )}
      </div>
    );
  };`;

content = content.replace(/const renderDropzone = \([\s\S]*?<\/[^>]*div>\s*\);\s*\};/, replacement);

fs.writeFileSync(file, content);
console.log('patched renderDropzone')
