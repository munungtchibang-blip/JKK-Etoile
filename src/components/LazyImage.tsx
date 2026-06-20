import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
}

export function LazyImage({ src, alt, className, wrapperClassName, priority = false, ...props }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('relative overflow-hidden w-full h-full bg-navy-800 animate-pulse', loaded ? 'animate-none' : '', wrapperClassName)}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn('w-full h-full object-cover relative z-10 transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0', className)}
        {...props}
      />
    </div>
  );
}
