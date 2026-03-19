import { useState, useEffect, useRef } from 'react';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface MediaBannerProps {
  items: MediaItem[];
  className?: string;
}

export function MediaBanner({ items, className = '' }: MediaBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  useEffect(() => {
    const currentMedia = items[currentIndex];
    let duration = 5000; // Default 5s for images

    if (currentMedia.type === 'video') {
      duration = 30000; // 30s max for videos
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(nextMedia, duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, items]);

  const currentMedia = items[currentIndex];

  return (
    <div className={`w-full h-[200px] md:h-[400px] rounded-[30px] overflow-hidden relative border border-black/5 dark:border-white/5 shadow-2xl transition-colors duration-500 ${className}`}>
      {currentMedia.type === 'image' ? (
        <img
          key={currentMedia.url}
          src={currentMedia.url}
          className="w-full h-full object-cover animate-fade-in transition-transform duration-[5000ms] scale-110 hover:scale-100"
          alt="Banner"
        />
      ) : (
        <video
          key={currentMedia.url}
          ref={videoRef}
          src={currentMedia.url}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover animate-fade-in"
          onEnded={nextMedia}
        />
      )}
      
      {/* Overlay info */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {items.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-500 ${
              idx === currentIndex ? 'w-8 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'w-2 bg-black/20 dark:bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
    </div>
  );
}
