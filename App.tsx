
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ShoppingCart, Instagram, Phone, Clock, MapPin, ChevronRight, ChevronLeft, Menu as MenuIcon, X, Plus, Minus, Flame, ExternalLink, Maximize2, Check, Trash2 } from 'lucide-react';
import { MENU_ITEMS, IMAGES, CONTACTS, GALLERY_IMAGES } from './constants';
import { Category, MenuItem } from './types';

interface CartItem {
  product: MenuItem;
  quantity: number;
}

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // Form states
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [followedInstagram, setFollowedInstagram] = useState(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);

  const categories: Category[] = ['Grelhados', 'Especiais', 'Peixes', 'Hambúrgueres', 'Acompanhamentos'];

  // Cart Logic
  const addToCart = (product: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Feedback visual opcional ou abrir carrinho
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  // Calculations
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0), [cart]);
  const discount = useMemo(() => followedInstagram ? subtotal * 0.10 : 0, [subtotal, followedInstagram]);
  const total = subtotal - discount;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // WhatsApp Message Generator
  const handleFinalizeOrder = () => {
    if (!phone || !location) {
      alert('Por favor, preencha o telefone e a localização para entrega.');
      return;
    }

    const orderItems = cart.map(item => `• ${item.quantity}x ${item.product.name} (${(item.product.price * item.quantity).toLocaleString()} Kz)`).join('\n');
    
    const message = `🍗 *NOVO PEDIDO – REIS DOS FRANGOS*

📍 *LOCALIZAÇÃO:*
${location}

📞 *TELEFONE:*
${phone}

🧾 *DETALHES DO PEDIDO:*
${orderItems}

───────────────
💰 *Subtotal:* ${subtotal.toLocaleString()} Kz
🎁 *Desconto Instagram (10%):* -${discount.toLocaleString()} Kz
✅ *TOTAL A PAGAR:* ${total.toLocaleString()} Kz
───────────────

_Obrigado pelo seu pedido! Aguardo confirmação._`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/244932815377?text=${encodedMessage}`, '_blank');
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

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-red-50 flex flex-col relative overflow-x-hidden selection:bg-orange-600 selection:text-white">
      
      {/* Lightbox for Gallery */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white bg-red-950/50 p-2 rounded-full"><X size={32} /></button>
          <img src={selectedImage} alt="Zoom" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl border-2 border-red-900/50 object-contain" />
        </div>
      )}

      {/* Checkout Sidebar / Modal */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isCartOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsCartOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-full sm:w-[450px] bg-[#0a0a0a] border-l border-red-900/30 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          
          <div className="p-6 border-b border-red-900/30 flex justify-between items-center bg-gradient-to-r from-red-950/20 to-black">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <ShoppingCart className="text-orange-500" /> Meu Pedido
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-red-900/20 rounded-full transition-colors"><X size={28} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <ShoppingCart size={64} />
                <p className="font-bold uppercase tracking-widest italic">O seu carrinho está vazio</p>
                <button onClick={() => setIsCartOpen(false)} className="text-orange-500 font-black border-b border-orange-500">Voltar ao Cardápio</button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="bg-red-950/10 border border-red-900/30 rounded-2xl p-4 flex gap-4 animate-in slide-in-from-right duration-300">
                      <div className="flex-1">
                        <h4 className="font-black uppercase italic text-sm mb-1">{item.product.name}</h4>
                        <p className="text-orange-500 font-bold text-xs">{(item.product.price * item.quantity).toLocaleString()} Kz</p>
                      </div>
                      <div className="flex items-center gap-3 bg-black/40 rounded-xl px-2">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="text-red-500"><Minus size={18} /></button>
                        <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="text-green-500"><Plus size={18} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-red-800 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                    </div>
                  ))}
                </div>

                {/* Delivery Form */}
                <div className="space-y-4 pt-4 border-t border-red-900/20">
                  <h3 className="font-black uppercase italic tracking-widest text-xs text-orange-500">Informações de Entrega</h3>
                  <div className="space-y-3">
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-red-900" size={18} />
                      <input 
                        type="tel" 
                        placeholder="Seu Telefone (9xx xxx xxx)" 
                        className="w-full bg-black border border-red-900/30 rounded-xl py-3 pl-12 pr-4 focus:border-orange-600 outline-none font-bold text-sm"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-red-900" size={18} />
                      <textarea 
                        placeholder="Localização (Bairro, Rua, Referência)" 
                        className="w-full bg-black border border-red-900/30 rounded-xl py-3 pl-12 pr-4 focus:border-orange-600 outline-none font-bold text-sm h-24 resize-none"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Instagram Discount Toggle */}
                <div className={`p-5 rounded-2xl border-2 transition-all duration-300 ${followedInstagram ? 'bg-orange-600/10 border-orange-600' : 'bg-red-950/10 border-red-900/30'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Instagram className={followedInstagram ? 'text-orange-500' : 'text-red-900'} />
                      <div>
                        <p className="font-black text-xs uppercase italic">Siga-nos no Instagram</p>
                        <p className="text-[10px] text-red-200/40 font-bold">Ganhe 10% de desconto no pedido!</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFollowedInstagram(!followedInstagram)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${followedInstagram ? 'bg-orange-600' : 'bg-gray-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${followedInstagram ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 bg-black border-t border-red-900/30 space-y-4">
              <div className="space-y-2 text-sm font-bold uppercase italic">
                <div className="flex justify-between">
                  <span className="text-red-200/40">Subtotal</span>
                  <span>{subtotal.toLocaleString()} Kz</span>
                </div>
                {followedInstagram && (
                  <div className="flex justify-between text-orange-500">
                    <span>Desconto Instagram</span>
                    <span>-{discount.toLocaleString()} Kz</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black text-white pt-2 border-t border-red-900/10">
                  <span>Total</span>
                  <span className="text-orange-500">{total.toLocaleString()} Kz</span>
                </div>
              </div>
              <button 
                onClick={handleFinalizeOrder}
                className="w-full bg-green-600 hover:bg-green-500 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-[0_10px_30px_rgba(22,163,74,0.3)]"
              >
                FINALIZAR NO WHATSAPP <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <img src={IMAGES.logo} alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-orange-600 object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-xl font-black text-white leading-tight italic uppercase">Reis dos Frangos</span>
                <span className="text-[10px] sm:text-xs text-orange-500 font-bold flex items-center gap-1 uppercase tracking-widest"><Flame size={12} fill="currentColor" /> O Reino da Brasa</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-10">
              <a href="#menu" className="text-red-200 hover:text-orange-500 font-bold transition-all uppercase text-xs tracking-widest">Cardápio</a>
              <a href="#galeria" className="text-red-200 hover:text-orange-500 font-bold transition-all uppercase text-xs tracking-widest">Galeria</a>
              <a href="#contato" className="text-red-200 hover:text-orange-500 font-bold transition-all uppercase text-xs tracking-widest">Contato</a>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-white hover:text-orange-500 transition-all">
                <ShoppingCart size={24} />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-black animate-pulse">{cartCount}</span>}
              </button>
            </div>

            <div className="flex md:hidden items-center gap-4">
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-white">
                <ShoppingCart size={22} />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-black">{cartCount}</span>}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white">
                {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden z-10 bg-black py-16">
        <div className="absolute inset-0 z-0">
          <img src={IMAGES.hero} alt="Frango na Brasa" className="w-full h-full object-cover brightness-[0.2]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
              <Flame size={16} fill="white" className="animate-pulse" /> Luanda • Maianga
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black mb-8 leading-[0.85] tracking-tighter italic uppercase">
              O REI DO <br/><span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-400 via-red-500 to-red-700">SABOR</span>
            </h1>
            <p className="text-lg sm:text-2xl text-red-200/70 mb-12 font-medium uppercase tracking-widest italic">A brasa que nunca apaga. <br className="hidden sm:block"/>O melhor frango de Angola está aqui.</p>
            <a href="#menu" className="inline-flex px-12 py-6 bg-red-600 hover:bg-red-500 text-white font-black text-xl rounded-full items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(220,38,38,0.5)] border-b-4 border-red-800"> VER CARDÁPIO <ChevronRight /> </a>
          </div>
          
          <div className="flex-1 w-full max-w-sm sm:max-w-lg">
            <div className="relative group">
              <div className="absolute -inset-4 bg-orange-600/30 rounded-[3rem] blur-2xl animate-pulse" />
              <img src={IMAGES.secondaryHero} alt="Prato" className="relative rounded-[3rem] shadow-2xl border-4 border-red-900/50 object-cover h-[400px] w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 sm:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-24 reveal">
            <h2 className="text-4xl sm:text-8xl font-black text-white tracking-tighter uppercase italic">Mestre da <span className="text-red-600">Grelha</span></h2>
          </div>

          <div className="space-y-32">
            {categories.map((category) => (
              <div key={category} className="space-y-16">
                <h3 className="text-3xl sm:text-6xl font-black text-white uppercase italic tracking-tighter pl-8 border-l-[12px] border-red-600 py-2">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {MENU_ITEMS.filter(item => item.category === category).map((item, idx) => (
                    <div key={item.id} className="bg-red-950/10 backdrop-blur-md rounded-[3rem] p-10 border border-red-900/30 hover:border-orange-600/50 shadow-2xl transition-all duration-500 flex flex-col justify-between reveal" style={{ transitionDelay: `${(idx % 3) * 100}ms` }}>
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <h4 className="font-black text-white text-2xl leading-tight uppercase italic">{item.name}</h4>
                          {item.popular && <div className="bg-red-600 p-2 rounded-xl text-white shadow-[0_0_15px_red] animate-pulse"><Flame size={16} fill="currentColor" /></div>}
                        </div>
                        <p className="text-sm text-red-200/40 font-bold italic leading-relaxed">{item.description || 'Preparado na brasa com tempero real.'}</p>
                      </div>
                      <div className="flex justify-between items-end mt-12">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-1">Preço Real</span>
                          <span className="text-3xl font-black text-white">{item.price.toLocaleString()} <span className="text-xs text-red-600 align-top">Kz</span></span>
                        </div>
                        <button onClick={() => addToCart(item)} className="bg-red-600 text-white h-16 w-16 rounded-[1.5rem] hover:bg-orange-600 transition-all shadow-xl active:scale-90 flex items-center justify-center border-b-4 border-red-900"> <Plus size={36} strokeWidth={4} /> </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="py-24 sm:py-32 bg-gradient-to-b from-black to-red-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl sm:text-8xl font-black text-white tracking-tighter uppercase italic">Nossos <span className="text-orange-500">Pratos</span></h2>
          </div>
          <div className="relative group max-w-5xl mx-auto h-[400px] sm:h-[600px] reveal">
            <div className="absolute inset-0 flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
              {GALLERY_IMAGES.map((img, idx) => (
                <div key={idx} className="min-w-full h-full p-4 cursor-pointer" onClick={() => setSelectedImage(img)}>
                  <div className="relative w-full h-full overflow-hidden rounded-[3rem] border-4 border-red-900 shadow-2xl group/item">
                    <img src={img} alt="Galeria" className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 flex items-center justify-center"> <Maximize2 size={48} className="text-white" /> </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition-all"><ChevronLeft size={32} /></button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition-all"><ChevronRight size={32} /></button>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="contato" className="py-32 bg-black border-t border-red-900/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative inline-block mb-16 reveal">
            <img src={IMAGES.logo} alt="Logo" className="h-40 w-40 mx-auto rounded-full border-4 border-red-600 shadow-2xl" />
          </div>
          <h2 className="text-5xl sm:text-8xl font-black text-white mb-8 uppercase italic tracking-tighter reveal">Sinta o <span className="text-red-600">Calor</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-24 reveal">
            <a href={CONTACTS.whatsapp} target="_blank" rel="noreferrer" className="group p-10 bg-green-600 hover:bg-green-500 text-white font-black text-2xl rounded-[3rem] flex items-center justify-between shadow-2xl border-b-8 border-green-800 transition-transform hover:-translate-y-2"> <span>PEDIR JÁ</span> <Phone size={44} /> </a>
            <a href={CONTACTS.instagram} target="_blank" rel="noreferrer" className="group p-10 bg-gradient-to-br from-purple-700 via-red-600 to-orange-500 text-white font-black text-2xl rounded-[3rem] flex items-center justify-between shadow-2xl border-b-8 border-red-800 transition-transform hover:-translate-y-2"> <span>INSTAGRAM</span> <Instagram size={44} /> </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left reveal">
             <div className="bg-red-950/20 p-12 rounded-[4rem] border border-red-900/30">
                <Clock className="text-orange-500 mb-6" size={48} />
                <h3 className="font-black text-3xl mb-2 uppercase italic">Horário</h3>
                <p className="text-red-600 font-black text-sm uppercase mb-3 tracking-widest">Terça — Domingo</p>
                <p className="text-5xl font-black">10h — 22h</p>
             </div>
             <div className="bg-gradient-to-br from-red-900/50 to-black p-12 rounded-[4rem] border border-red-900/30">
                <MapPin className="text-orange-500 mb-6" size={48} />
                <h3 className="font-black text-3xl mb-4 uppercase italic">Maianga, Luanda</h3>
                <p className="text-red-100/60 font-black mb-8 italic uppercase">{CONTACTS.location}</p>
                <button className="w-full bg-white text-black py-6 rounded-2xl font-black text-xl hover:bg-orange-600 hover:text-white transition-all"> VER NO MAPA </button>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-24 text-center border-t border-red-900/10">
        <p className="text-xs text-red-900 font-black tracking-[0.8em] uppercase mb-6 italic">— Mestre no Churrasco —</p>
        <p className="text-[10px] text-gray-800 font-bold uppercase tracking-widest">© 2024 Churrasqueira Reis dos Frangos • Luanda, Angola</p>
      </footer>

      {/* Cart Counter Bubble (Floating on bottom right) */}
      {!isCartOpen && cartCount > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-[90] bg-orange-600 text-white h-20 w-20 rounded-full shadow-[0_20px_50px_rgba(234,88,12,0.5)] flex items-center justify-center animate-bounce border-2 border-white/20"
        >
          <ShoppingCart size={32} />
          <span className="absolute -top-2 -right-2 bg-white text-orange-600 font-black h-8 w-8 rounded-full flex items-center justify-center text-lg">{cartCount}</span>
        </button>
      )}
    </div>
  );
};

export default App;
