import React from 'react';
import { cn } from '../lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
}

export function LazyImage({ src, alt, className, wrapperClassName, priority = false, ...props }: LazyImageProps) {
  return (
    <div className={cn('relative overflow-hidden w-full h-full', wrapperClassName)}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn('w-full h-full object-cover relative z-10', className)}
        {...props}
      />
    </div>
  );
}
