import { useEffect, useRef, useState } from 'react';
import { unsplash, unsplashSrcSet } from '../data/site';

// Responsive photo with a shimmer skeleton until it has loaded. Lazy-loads unless `eager` (above the fold).
export default function Photo({
  id,
  alt,
  sizes,
  eager = false,
  className = '',
  wrapperClassName = '',
}: {
  id: string;
  alt: string;
  sizes: string;
  eager?: boolean;
  className?: string;
  wrapperClassName?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // The image may finish loading before React hydrates, in which case onLoad never fires.
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, [id]);

  return (
    <div className={`${loaded ? '' : 'skeleton'} ${wrapperClassName}`} style={{ borderRadius: 0 }}>
      <img
        ref={ref}
        src={unsplash(id, 1200)}
        srcSet={unsplashSrcSet(id)}
        sizes={sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
