interface ImageModalProps {
  src: string | null;
  caption?: string;
  onClose: () => void;
}

export function ImageModal({ src, caption, onClose }: ImageModalProps) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-[10px] flex flex-col items-center justify-center p-5 animate-fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl font-light transition-colors"
      >
        ×
      </button>
      <img
        src={src}
        alt={caption || "Detail"}
        className="max-w-[90vw] max-h-[75vh] rounded-[20px] shadow-[0_0_50px_rgba(16,185,129,0.2)] border border-white/10 object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      {caption && (
        <div
          className="mt-4 max-w-[80vw] text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-white/90 text-sm md:text-base leading-relaxed bg-white/5 border border-white/10 rounded-2xl px-6 py-3 backdrop-blur-sm">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
