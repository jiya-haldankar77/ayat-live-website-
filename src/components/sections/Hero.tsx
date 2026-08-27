import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden -mt-20">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Luxury villa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      <div className="relative z-10 text-center px-5 max-w-5xl mx-auto">
        <p className="text-stone-300 text-xs sm:text-sm font-medium tracking-[0.35em] uppercase mb-6">
          LUXURY REAL ESTATE • GOA
        </p>

        <h1 className="font-display font-medium leading-tight">
          <span className="block text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
            Where Vision Meets
          </span>
          <span className="block text-gold text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-medium">
            Exceptional Living
          </span>
        </h1>

        <p className="mt-8 text-stone-200 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          Aayat Projects is a full-service design and development studio delivering architecture, interior design, project management, construction supervision, and turnkey villa solutions across Goa.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => navigate('/properties')} className="flex items-center gap-3 px-8 py-4 bg-gold text-stone-900 text-sm font-semibold tracking-widest uppercase hover:bg-gold-500 transition-colors min-w-[240px] justify-center">
            VIEW PROPERTIES →
          </button>
          <button onClick={() => navigate('/contact')} className="px-8 py-4 bg-white text-stone-900 text-sm font-semibold tracking-widest uppercase hover:bg-stone-100 transition-colors min-w-[240px]">
            BOOK CONSULTATION
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-6 h-10 rounded-full border-2 border-white/60 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
