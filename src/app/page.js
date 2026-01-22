import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-[#0f0105] flex flex-col items-center justify-center overflow-hidden font-sans">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-900/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-rose-950/40 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        
        <div className="mb-6 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md animate-fade-in">
          Established in Love
        </div>

        <div className="relative group">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl">
            Love<span className="text-pink-600">Lock</span>
          </h1>
          <div className="absolute -top-8 -right-8 md:-top-12 md:-right-12 text-5xl md:text-6xl animate-bounce drop-shadow-[0_0_15px_rgba(219,39,119,0.8)]">
            💖
          </div>
        </div>

        <p className="mt-6 text-pink-100/60 text-lg md:text-2xl font-light max-w-xl leading-relaxed">
          The most secure place on the internet <br className="hidden md:block" />
          for your <span className="text-pink-400 font-medium italic">digital keepsakes.</span>
        </p>

        <div className="mt-12 group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          
          <Link
            href="/create"
            className="relative flex items-center gap-3 px-12 py-6 bg-black rounded-2xl border border-pink-500/50 text-white font-bold text-xl leading-none  transition-all duration-300 hover:bg-pink-600 hover:border-transparent overflow-hidden"
          >
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <span>Create a Love Lock</span>
            <span className="text-2xl group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>

        <div className="mt-16 flex gap-8 text-pink-200/40 text-sm font-medium border-t border-pink-900/50 pt-8">
          <div className="flex flex-col">
            <span className="text-pink-500 text-lg font-bold">10k+</span>
            <span>Locks Created</span>
          </div>
          <div className="w-[1px] bg-pink-900/50 h-10" />
          <div className="flex flex-col">
            <span className="text-pink-500 text-lg font-bold">100%</span>
            <span>Private</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}