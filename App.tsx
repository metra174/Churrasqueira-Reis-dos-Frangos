
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ShoppingCart, Instagram, Phone, Clock, MapPin, ChevronRight, ChevronLeft, Menu as MenuIcon, X, Plus, Flame, ExternalLink, Maximize2 } from 'lucide-react';
import { MENU_ITEMS, IMAGES, CONTACTS, GALLERY_IMAGES } from './constants';
import { Category } from './types';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const categories: Category[] = ['Grelhados', 'Especiais', 'Peixes', 'Hambúrgueres', 'Acompanhamentos'];

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const nextSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Setup Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-red-50 flex flex-col relative overflow-x-hidden selection:bg-orange-600 selection:text-white">
      {/* Lightbox for Gallery */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors bg-red-950/50 p-2 rounded-full">
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            alt="Prato ampliado" 
            className="max-w-full max-h-[90vh] rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.3)] border-2 border-red-900/50 object-contain animate-in zoom-in duration-500"
          />
        </div>
      )}

      {/* Dynamic Background Fire Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-900/20 blur-[180px] animate-pulse rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-900/10 blur-[180px] animate-pulse rounded-full" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <img src={IMAGES.logo} alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-orange-600 object-cover shadow-[0_0_20px_rgba(234,88,12,0.4)]" />
                <div className="absolute inset-0 rounded-full bg-orange-600/20 blur-md animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-xl font-black text-white leading-tight tracking-tighter uppercase italic text-shadow-glow-red">Reis dos Frangos</span>
                <span className="text-[10px] sm:text-xs text-orange-500 font-bold flex items-center gap-1 uppercase tracking-widest">
                  <Flame size={12} fill="currentColor" className="animate-bounce" /> O Reino da Brasa
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-10">
              <a href="#menu" className="text-red-200 hover:text-orange-500 font-bold transition-all uppercase text-sm tracking-[0.2em]">Cardápio</a>
              <a href="#galeria" className="text-red-200 hover:text-orange-500 font-bold transition-all uppercase text-sm tracking-[0.2em]">Galeria</a>
              <a href="#contato" className="text-red-200 hover:text-orange-500 font-bold transition-all uppercase text-sm tracking-[0.2em]">Contato</a>
              <button className="relative p-2 text-white hover:text-orange-500 transition-all transform hover:scale-110">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-black">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-4">
               <button className="relative p-2 text-white">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-black">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white">
                {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-b border-red-900 animate-in slide-in-from-top duration-300">
            <div className="px-8 py-10 flex flex-col space-y-8">
              <a href="#menu" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black flex items-center gap-4 uppercase text-orange-500 italic"><Flame size={24} /> Cardápio</a>
              <a href="#galeria" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black flex items-center gap-4 uppercase text-orange-500 italic"><Flame size={24} /> Galeria</a>
              <a href="#contato" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black flex items-center gap-4 uppercase text-orange-500 italic"><Flame size={24} /> Contato</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] sm:h-[800px] flex items-center justify-center overflow-hidden z-10 bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.hero} 
            alt="Frango na Brasa" 
            className="w-full h-full object-cover brightness-[0.4] opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-red-600 text-white text-sm font-black uppercase tracking-[0.3em] rounded-full mb-8 shadow-[0_0_40px_rgba(220,38,38,0.4)]">
              <Flame size={20} fill="white" className="animate-pulse" /> Luanda • Maianga
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black mb-8 leading-[0.85] tracking-tighter italic uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
              O REI DO <br/><span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-400 via-red-500 to-red-700">SABOR</span>
            </h1>
            <p className="text-xl sm:text-2xl text-red-200/70 mb-12 font-medium leading-relaxed uppercase tracking-widest italic">
              A brasa que nunca apaga. <br/>O melhor frango de Angola está aqui.
            </p>
            <a 
              href={CONTACTS.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex px-12 py-6 bg-red-600 hover:bg-red-500 text-white font-black text-xl rounded-full items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(220,38,38,0.5)] border-b-4 border-red-800"
            >
              PEDIR AGORA <ChevronRight size={24} strokeWidth={3} />
            </a>
          </div>
          
          <div className="flex-1 w-full max-w-lg animate-in fade-in zoom-in duration-1000">
            <div className="relative group">
              <div className="absolute -inset-4 bg-orange-600/30 rounded-[3rem] blur-2xl animate-pulse"></div>
              <img 
                src={IMAGES.secondaryHero} 
                alt="Nosso Especial" 
                className="relative rounded-[3rem] shadow-2xl border-4 border-red-900/50 group-hover:scale-105 transition-transform duration-500 object-cover w-full h-[400px]"
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-black italic uppercase tracking-widest text-lg">Qualidade Imperial</p>
                <p className="text-orange-500 text-sm font-bold">Feito na hora, direto da brasa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-32 reveal">
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="h-[2px] w-16 bg-red-600 shadow-[0_0_10px_red]"></div>
              <span className="text-orange-500 font-black text-xl uppercase tracking-[0.4em] italic">O Nosso Cardápio</span>
              <div className="h-[2px] w-16 bg-red-600 shadow-[0_0_10px_red]"></div>
            </div>
            <h2 className="text-6xl sm:text-8xl font-black text-white tracking-tighter uppercase italic">Mestre da <span className="text-red-600">Grelha</span></h2>
          </div>

          <div className="space-y-48">
            {categories.map((category) => (
              <div key={category} className="space-y-16">
                <div className="relative inline-block group reveal">
                  <h3 className="text-4xl sm:text-6xl font-black text-white uppercase italic tracking-tighter pl-8 border-l-[12px] border-red-600 py-2">
                    {category}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {MENU_ITEMS.filter(item => item.category === category).map((item, idx) => (
                    <div 
                      key={item.id} 
                      className="group bg-red-950/10 backdrop-blur-md rounded-[3rem] p-10 border border-red-900/30 hover:border-orange-600/50 shadow-2xl transition-all duration-500 flex flex-col justify-between reveal"
                      style={{ transitionDelay: `${(idx % 3) * 100}ms` }}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <h4 className="font-black text-white text-3xl leading-tight group-hover:text-orange-500 transition-colors uppercase italic tracking-tighter">{item.name}</h4>
                          {item.popular && (
                            <div className="bg-red-600 p-2 rounded-xl text-white shadow-[0_0_15px_red] animate-pulse">
                              <Flame size={18} fill="currentColor" />
                            </div>
                          )}
                        </div>
                        <p className="text-base text-red-200/40 font-bold leading-relaxed italic pr-4">
                          {item.description || 'O sabor clássico da nossa brasa, preparado com maestria.'}
                        </p>
                      </div>

                      <div className="flex justify-between items-end mt-12">
                        <div className="flex flex-col">
                          <span className="text-xs text-orange-600 font-black uppercase tracking-widest mb-1">Preço Real</span>
                          <span className="text-4xl font-black text-white tracking-tighter">
                            {item.price.toLocaleString()} <span className="text-sm align-top text-red-600">Kz</span>
                          </span>
                        </div>
                        <button 
                          onClick={handleAddToCart}
                          className="bg-red-600 text-white h-16 w-16 rounded-[1.5rem] hover:bg-orange-600 transition-all shadow-[0_15px_30px_rgba(220,38,38,0.5)] active:scale-90 flex items-center justify-center border-b-4 border-red-900"
                        >
                          <Plus size={36} strokeWidth={4} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria de Fotos Section */}
      <section id="galeria" className="py-32 bg-gradient-to-b from-black to-red-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24 reveal">
             <div className="flex items-center justify-center gap-6 mb-4">
              <div className="h-[2px] w-16 bg-orange-600 shadow-[0_0_10px_orange]"></div>
              <span className="text-red-500 font-black text-xl uppercase tracking-[0.4em] italic">Experiência Visual</span>
              <div className="h-[2px] w-16 bg-orange-600 shadow-[0_0_10px_orange]"></div>
            </div>
            <h2 className="text-6xl sm:text-8xl font-black text-white tracking-tighter uppercase italic">Nossos <span className="text-orange-500">Pratos</span></h2>
          </div>

          {/* Custom Carousel */}
          <div className="relative group max-w-5xl mx-auto h-[400px] sm:h-[600px] reveal">
            <div className="absolute inset-0 flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
              {GALLERY_IMAGES.map((img, idx) => (
                <div 
                  key={idx} 
                  className="min-w-full h-full p-4 flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-[3rem] border-4 border-red-900 shadow-2xl group/item">
                    <img 
                      src={img} 
                      alt={`Galeria ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <Maximize2 size={48} className="text-white drop-shadow-2xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-red-600 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-90 md:-left-12 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={32} strokeWidth={3} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-red-600 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-90 md:-right-12 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={32} strokeWidth={3} />
            </button>

            {/* Dots */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
              {GALLERY_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-3 rounded-full transition-all duration-300 ${carouselIndex === idx ? 'w-10 bg-orange-500' : 'w-3 bg-red-900 hover:bg-red-700'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Info / Contact Section */}
      <section id="contato" className="py-40 bg-black border-t border-red-900/20 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative inline-block mb-16 reveal">
            <img src={IMAGES.logo} alt="Small Logo" className="h-40 w-40 mx-auto rounded-full border-4 border-red-600 shadow-[0_0_60px_rgba(239,68,68,0.4)] relative z-10" />
            <div className="absolute -inset-6 bg-red-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          </div>
          <h2 className="text-6xl sm:text-8xl font-black text-white mb-8 uppercase italic tracking-tighter reveal">Sinta o <span className="text-red-600">Calor</span></h2>
          <p className="text-red-200/50 mb-20 text-xl font-black max-w-sm mx-auto uppercase tracking-[0.3em] italic leading-relaxed reveal">Não deixe a brasa apagar. Garanta o seu frango!</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-24">
            <a 
              href={CONTACTS.whatsapp} 
              target="_blank" 
              rel="noreferrer"
              className="group p-10 bg-green-600 hover:bg-green-500 text-white font-black text-2xl rounded-[3rem] flex items-center justify-between shadow-2xl transition-all transform hover:-translate-y-3 active:scale-95 border-b-8 border-green-800 reveal"
            >
              <span>WHATSAPP</span>
              <Phone size={44} className="group-hover:rotate-12 transition-transform" />
            </a>
            <a 
              href={CONTACTS.instagram} 
              target="_blank" 
              rel="noreferrer"
              className="group p-10 bg-gradient-to-br from-purple-700 via-red-600 to-orange-500 text-white font-black text-2xl rounded-[3rem] flex items-center justify-between shadow-2xl transition-all transform hover:-translate-y-3 active:scale-95 border-b-8 border-red-800 reveal"
              style={{ transitionDelay: '150ms' }}
            >
              <span>INSTAGRAM</span>
              <Instagram size={44} className="group-hover:rotate-12 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
            <div className="bg-red-950/20 p-12 rounded-[4rem] border border-red-900/30 shadow-2xl group reveal">
              <div className="text-orange-500 mb-10 flex items-center gap-5">
                <Clock size={48} strokeWidth={3} className="group-hover:rotate-[360deg] transition-transform duration-1000" />
                <h3 className="font-black text-4xl text-white uppercase italic tracking-tighter">Horário</h3>
              </div>
              <p className="text-red-600 font-black text-sm uppercase mb-3 tracking-[0.4em]">Terça — Domingo</p>
              <p className="text-6xl font-black text-white tracking-tighter">10h — 22h</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-900/50 to-black p-12 rounded-[4rem] text-white shadow-2xl relative group border border-red-900/30 reveal" style={{ transitionDelay: '200ms' }}>
              <div className="text-orange-500 mb-10">
                <MapPin size={48} strokeWidth={3} />
              </div>
              <h3 className="font-black text-4xl mb-6 uppercase italic tracking-tighter">Maianga, Luanda</h3>
              <p className="text-red-100/60 font-black leading-relaxed mb-12 text-xl uppercase italic">
                {CONTACTS.location}
              </p>
              <button className="w-full bg-white text-black px-10 py-6 rounded-2xl font-black text-xl hover:bg-orange-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-4 group/btn">
                VER NO MAPA <ExternalLink size={24} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-24 text-white border-t border-red-900/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-20 mb-16 opacity-10">
            <Flame size={60} />
            <Flame size={60} />
            <Flame size={60} />
          </div>
          <p className="text-xs text-red-900 font-black tracking-[0.8em] uppercase mb-6 italic">
            — Mestre no Churrasco —
          </p>
          <p className="text-[10px] text-gray-800 font-bold uppercase tracking-widest">
            © 2024 Churrasqueira Reis dos Frangos • Luanda, Angola • Criado com Fogo
          </p>
        </div>
      </footer>

      {/* Sticky Checkout Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] sm:w-auto z-50">
          <button className="w-full bg-red-600 text-white px-14 py-7 rounded-[2.5rem] flex items-center gap-10 shadow-[0_25px_60px_rgba(220,38,38,0.7)] font-black group transition-all transform hover:scale-105 active:scale-95 border-t border-red-400/40">
            <div className="flex items-center gap-5">
              <div className="bg-white text-red-600 px-5 py-1.5 rounded-2xl text-2xl animate-bounce">
                {cartCount}
              </div>
              <span className="text-2xl tracking-tighter uppercase italic">FECHAR PEDIDO</span>
            </div>
            <div className="h-10 w-[2px] bg-red-400/30"></div>
            <ChevronRight size={36} className="group-hover:translate-x-2 transition-transform" strokeWidth={4} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
