export function Footer() {
  return (
    <footer className="px-6 md:px-10 py-10 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-[#141414] transition-colors duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-black dark:border-white rounded-lg flex items-center justify-center font-black italic text-[10px] text-black dark:text-white transition-colors duration-500">UNB</div>
          <div>
            <p className="font-black italic uppercase text-black dark:text-white text-sm leading-none transition-colors duration-500">Nusa Bangsa</p>
            <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">University · Bogor</p>
          </div>
        </div>
        <div className="text-center text-[9px] text-gray-500 dark:text-gray-500 font-bold uppercase tracking-widest transition-colors duration-500">
          <p>Jl. KH. Sholeh Iskandar KM.4, Tanah Sareal, Bogor 16164</p>
          <p className="mt-1 transition-colors duration-500">Tel: (0251) 8337966 · info@unb.ac.id</p>
        </div>
        <p className="text-[9px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest transition-colors duration-500">
          © {new Date().getFullYear()} Universitas Nusa Bangsa
        </p>
      </div>
    </footer>
  );
}
