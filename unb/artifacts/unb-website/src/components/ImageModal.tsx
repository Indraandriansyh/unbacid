interface ImageModalProps {
  src: string | null;
  onClose: () => void;
}

export function ImageModal({ src, onClose }: ImageModalProps) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-[10px] flex items-center justify-center p-5 animate-fade-in"
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
        alt="Detail"
        className="max-w-[90vw] max-h-[80vh] rounded-[20px] shadow-[0_0_50px_rgba(16,185,129,0.2)] border border-white/10 object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
