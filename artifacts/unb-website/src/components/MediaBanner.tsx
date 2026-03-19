import { useState, useEffect, useRef } from 'react';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface MediaBannerProps {
  items: MediaItem[];
  className?: string;
}

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      return u.searchParams.get('v');
    }
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1).split('?')[0];
    }
  } catch {}
  return null;
}

function YouTubeBackground({ videoId, onEnd }: { videoId: string; onEnd: () => void }) {
  const src =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&mute=1&loop=1&playlist=${videoId}` +
    `&controls=0&modestbranding=1&rel=0&showinfo=0` +
    `&disablekb=1&iv_load_policy=3&playsinline=1&enablejsapi=0`;

  useEffect(() => {
    const t = setTimeout(onEnd, 30000);
    return () => clearTimeout(t);
  }, [videoId]);

  return (
    <>
      <iframe
        key={videoId}
        src={src}
        allow="autoplay; encrypted-media"
        className="absolute inset-0 w-full h-full animate-fade-in"
        style={{
          border: 'none',
          width: '177.78vh',
          minWidth: '100%',
          height: '56.25vw',
          minHeight: '100%',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'absolute',
          pointerEvents: 'none',
        }}
        title="Banner video"
      />
      <div className="absolute inset-0 z-10 pointer-events-none" />
    </>
  );
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
    if (currentMedia.type === 'image') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(nextMedia, 5000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, items]);

  const currentMedia = items[currentIndex];
  const youtubeId = currentMedia.type === 'video' ? getYouTubeId(currentMedia.url) : null;

  return (
    <div className={`w-full h-[200px] md:h-[400px] rounded-[30px] overflow-hidden relative border border-black/5 dark:border-white/5 shadow-2xl transition-colors duration-500 ${className}`}>
      {currentMedia.type === 'image' ? (
        <img
          key={currentMedia.url}
          src={currentMedia.url}
          className="w-full h-full object-cover animate-fade-in transition-transform duration-[5000ms] scale-110 hover:scale-100"
          alt="Banner"
        />
      ) : youtubeId ? (
        <YouTubeBackground videoId={youtubeId} onEnd={nextMedia} />
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

      <div className="absolute bottom-6 right-6 flex gap-2 z-20">
        {items.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-500 ${
              idx === currentIndex ? 'w-8 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'w-2 bg-black/20 dark:bg-white/20'
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20"></div>
    </div>
  );
}
