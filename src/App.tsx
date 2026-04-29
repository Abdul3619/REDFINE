import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, MessageCircle, Clock, ChevronRight, ChevronLeft, Menu, X } from 'lucide-react';

type Language = 'en' | 'ar';

const translations = {
  en: {
    brand: "Daqn Plus",
    langToggle: "عربي",
    nav: ["Home", "Services", "The Atelier", "Location"],
    heroTitle: "Redefine Elegance",
    bookBtn: "Book Appointment",
    servicesTitle: "Our Mastery",
    services: [
      {
        title: "Signature Styles",
        description: "Precision cuts tailored to your distinct facial structure and lifestyle.",
        img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop"
      },
      {
        title: "Royal Coloring",
        description: "Bespoke color treatments using the finest pigments for an iconic look.",
        img: "https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=800&auto=format&fit=crop"
      },
      {
        title: "Skin Revivals",
        description: "Rejuvenating therapies to restore vitality and freshness to your skin.",
        img: "https://images.unsplash.com/photo-1512496015851-a1dc8a473105?q=80&w=800&auto=format&fit=crop"
      }
    ],
    aboutTitle: "The Atelier",
    aboutMission: "A sanctuary where meticulous craftsmanship meets modern luxury.",
    aboutStory: "Founded on the belief that personal grooming is an art form, Daqn Plus brings an editorial approach to every individual. Our masters are trained in global techniques to ensure unparalleled quality.",
    testimonialsTitle: "Client Voices",
    reviews: [
      "Masha'Allah, very respectful young men and excellent work. Mohamed Halawa ❤️ Mahmoud Halba ❤️ — Mohamed Osha",
      "Mahmoud Sheikh Ibn Sheikh is a dear and precious brother. His haircut is amazing. Don't miss it. — Yakan Al Yami",
      "The place is good, and the staff is respectful... The price is premium for the service. — Hassan Almasri"
    ],
    locationTitle: "Visit Us",
    address: "2J5C+F37, Alkhuzama, Bisha 67711, Saudi Arabia",
    hoursTitle: "Opening Hours",
    hours: [
      { days: "Saturday - Thursday", time: "9:00 AM - 11:00 PM" },
      { days: "Friday", time: "2:00 PM - 11:00 PM" }
    ],
    bookWhatsApp: "Book via WhatsApp",
    callUs: "Call Us",
    footerText: "© 2026 Daqn Plus Salon. All Rights Reserved."
  },
  ar: {
    brand: "دقن بلاس",
    langToggle: "EN",
    nav: ["الرئيسية", "الخدمات", "عن الصالون", "الموقع"],
    heroTitle: "أعد تعريف الأناقة",
    bookBtn: "احجز موعدًا",
    servicesTitle: "إبداعاتنا",
    services: [
      {
        title: "تسريحات وقصات مميزة",
        description: "قصات دقيقة مصممة لتناسب ملامح وجهك وأسلوب حياتك.",
        img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop"
      },
      {
        title: "تلوين ملكي",
        description: "علاجات ألوان مخصصة بإستخدام أجود المستحضرات لإطلالة أيقونية.",
        img: "https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=800&auto=format&fit=crop"
      },
      {
        title: "تجديد البشرة",
        description: "علاجات مجددة لإستعادة حيوية ونضارة بشرتك.",
        img: "https://images.unsplash.com/photo-1512496015851-a1dc8a473105?q=80&w=800&auto=format&fit=crop"
      }
    ],
    aboutTitle: "عن الصالون",
    aboutMission: "ملاذ تلتقي فيه الحرفية الدقيقة بالفخامة العصرية.",
    aboutStory: "تأسس صالون دقن بلاس على إيمان بأن العناية الشخصية هي فن بحد ذاته، ليقدم أسلوبًا راقيًا لكل فرد. خبراؤنا مدربون بأعلى التقنيات لضمان جودة لا مثيل لها.",
    testimonialsTitle: "آراء عملائنا",
    reviews: [
      "ما شاء الله شباب محترمين جداً وشغل ممتاز. محمد حلاوة ❤️ محمود حلبة ❤️ — محمد أوشة",
      "محمود شيخ ابن شيخ أخ عزيز وغالي وحلاقته تفوز لا تفوتكم. — ياكان اليامي",
      "المكان نوعا ما جيد والموظفين محترمين... السعر يعتبر مميز مقابل الخدمة. — حسن المصري"
    ],
    locationTitle: "شرفنا بزيارتك",
    address: "2J5C+F37، الخزامى، بيشة 67711، المملكة العربية السعودية",
    hoursTitle: "أوقات العمل",
    hours: [
      { days: "السبت - الخميس", time: "9:00 صباحًا - 11:00 مساءً" },
      { days: "الجمعة", time: "2:00 مساءً - 11:00 مساءً" }
    ],
    bookWhatsApp: "احجز عبر واتساب",
    callUs: "اتصل بنا",
    footerText: "© 2026 صالون دقن بلاس. جميع الحقوق محفوظة."
  }
};

const PHONE_NUMBER = "+966508547381";
const WHATSAPP_LINK = `https://wa.me/${PHONE_NUMBER.replace('+', '')}`;

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [activeService, setActiveService] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  const nextService = () => setActiveService((prev) => (prev + 1) % t.services.length);
  const prevService = () => setActiveService((prev) => (prev === 0 ? t.services.length - 1 : prev - 1));

  // Determine fonts based on language
  const serifFont = isRtl ? 'font-ar-serif' : 'font-en-serif';
  const sansFont = isRtl ? 'font-ar-sans' : 'font-en-sans';
  const headingTracking = isRtl ? 'tracking-normal' : 'tracking-tight';
  const buttonTracking = isRtl ? 'tracking-normal' : 'tracking-[0.15em]';

  const navLinks = [
    { name: t.nav[0], href: '#home' },
    { name: t.nav[1], href: '#services' },
    { name: t.nav[2], href: '#about' },
    { name: t.nav[3], href: '#location' },
  ];

  return (
    <div className={`min-h-screen bg-bg-salon text-white ${sansFont}`}>
      
      {/* 1. Persistent Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-bg-salon/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <div className={`text-2xl uppercase ${serifFont} tracking-widest text-white`}>
            {t.brand}
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.href}
                className={`text-[10px] uppercase tracking-widest text-white/70 hover:text-[#C7B28B] transition-colors`}
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={toggleLang}
              className={`ml-4 px-3 py-1 text-[10px] border border-white/20 rounded hover:border-[#C7B28B] text-white hover:text-[#C7B28B] transition-colors uppercase`}
            >
              {t.langToggle}
            </button>
          </nav>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleLang}
              className={`px-3 py-1 text-[10px] border border-white/20 rounded uppercase text-white hover:border-[#C7B28B] transition-colors`}
            >
              {t.langToggle}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-bg-salon/95 backdrop-blur-md border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col px-6 py-4 gap-4">
                {navLinks.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg py-2 border-b border-white/5 ${serifFont} text-white/80`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Floating Action Button */}
      <a 
        href={WHATSAPP_LINK} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 bg-[#C7B28B] text-black px-10 py-4 rounded-none shadow-[0_4px_20px_rgba(199,178,139,0.15)] hover:brightness-110 transition-all flex items-center gap-3 font-bold uppercase text-xs tracking-widest"
      >
        <span className="hidden md:inline-block">
          {t.bookBtn}
        </span>
        <span>→</span>
      </a>

      {/* 2. Hero Section */}
      <section id="home" className="relative h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Cinematic Background Placeholder (Image + Overlay) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2000&auto=format&fit=crop" 
            alt="Salon Background" 
            className="w-full h-full object-cover opacity-40 scale-105 origin-center animate-[pulse_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-salon via-bg-salon/50 to-bg-salon/20" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`text-6xl md:text-8xl lg:text-[100px] xl:text-[140px] font-light ${serifFont} tracking-tighter leading-[1.1] md:leading-[0.9] ${isRtl ? 'text-white/90 tracking-normal' : 'text-[#C7B28B]'}`}
          >
            {t.heroTitle}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 md:mt-16 flex justify-center"
          >
            <div className={`h-[100px] w-[1px] bg-gradient-to-b from-[#C7B28B] to-transparent`} />
          </motion.div>
        </div>
      </section>

      {/* 3. Services Slideshow */}
      <section id="services" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 flex items-end justify-between"
          >
            <h2 className={`text-4xl md:text-5xl lg:text-7xl font-light ${serifFont} ${headingTracking} text-[#C7B28B]`}>
              {t.servicesTitle}
            </h2>
            <div className="hidden md:flex gap-4">
              <button onClick={prevService} className="w-12 h-12 rounded-none border border-white/20 flex items-center justify-center hover:border-[#C7B28B] text-white hover:text-[#C7B28B] transition-colors focus:outline-none">
                {isRtl ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
              </button>
              <button onClick={nextService} className="w-12 h-12 rounded-none border border-white/20 flex items-center justify-center hover:border-[#C7B28B] text-white hover:text-[#C7B28B] transition-colors focus:outline-none">
                {isRtl ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
              </button>
            </div>
          </motion.div>

          <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden rounded-none border border-white/10 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img 
                  src={t.services[activeService].img} 
                  alt={t.services[activeService].title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-salon border-t-transparent via-bg-salon/40 to-transparent opacity-90" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div className="max-w-2xl">
                    <span className={`text-[#C7B28B] text-[10px] tracking-[0.3em] uppercase mb-4 block`}>0{activeService + 1} // {t.services.length}</span>
                    <h3 className={`text-3xl md:text-5xl mb-4 font-light ${serifFont}`}>{t.services[activeService].title}</h3>
                    <p className={`text-white/70 text-lg ${sansFont} max-w-xl leading-relaxed`}>{t.services[activeService].description}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Mobile Slideshow Controls overlay */}
            <div className="absolute inset-y-0 left-0 w-1/4 z-10" onClick={prevService} />
            <div className="absolute inset-y-0 right-0 w-1/4 z-10" onClick={nextService} />
          </div>
        </div>
      </section>

      {/* 4. About 'The Atelier' */}
      <section id="about" className="py-24 md:py-32 bg-[#141414] border-y border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h4 className={`text-[#C7B28B] uppercase text-[10px] tracking-[0.3em] mb-8 block`}>
                {t.aboutTitle}
              </h4>
              <h2 className={`text-3xl md:text-5xl lg:text-6xl font-light ${serifFont} ${headingTracking} mb-8 leading-tight`}>
                {t.aboutMission}
              </h2>
              <div className="w-12 h-[1px] bg-[#C7B28B] mb-8" />
              <p className={`text-white/60 text-base md:text-lg leading-relaxed ${sansFont}`}>
                {t.aboutStory}
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative aspect-[3/4] rounded-none overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop" 
                alt="Inside the Atelier" 
                className="w-full h-full object-cover filter brightness-75 hover:brightness-100 transition-all duration-700"
              />
              <div className="absolute inset-0 border border-white/10 m-6 rounded-none pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Client Testimonials (Marquee) */}
      <section className="py-24 md:py-32 overflow-hidden relative">
        <div className="container mx-auto px-6 max-w-7xl mb-16 text-center">
          <h2 className={`text-3xl md:text-5xl font-light ${serifFont} text-[#C7B28B]`}>
            {t.testimonialsTitle}
          </h2>
        </div>
        
        <div className="relative flex whitespace-nowrap group">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
            {[...t.reviews, ...t.reviews, ...t.reviews].map((review, idx) => (
              <div 
                key={idx} 
                className={`mx-8 px-12 py-8 bg-black/40 border border-white/10 rounded-none w-[300px] md:w-[500px] hover:border-[#C7B28B]/30 transition-colors shadow-lg glass`}
              >
                <p className={`text-lg md:text-xl font-light italic ${serifFont} text-white/90 whitespace-normal text-center`}>
                  "{review.split(" - ")[0] || review.split(" — ")[0]}"
                </p>
                <p className={`mt-6 text-sm uppercase ${buttonTracking} text-[#C7B28B] text-center`}>
                  {review.split(" - ")[1] || review.split(" — ")[1] || ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Location & Info */}
      <section id="location" className="py-24 md:py-32 bg-[#141414] relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
            
            {/* Info Column */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 flex flex-col justify-center"
            >
              <h2 className={`text-4xl md:text-6xl font-light ${serifFont} mb-12 text-[#C7B28B]`}>
                {t.locationTitle}
              </h2>

              <div className="space-y-8">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <MapPin className="text-[#C7B28B] shrink-0 mt-1" size={24} />
                  <div>
                    <h5 className={`text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2`}>Address</h5>
                    <p className={`text-xs text-white/90 ${sansFont} bg-white/5 border border-white/5 p-4 rounded-none`}>{t.address}</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <Clock className="text-[#C7B28B] shrink-0 mt-1" size={24} />
                  <div className="w-full">
                    <h5 className={`text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2`}>{t.hoursTitle}</h5>
                    <table className={`w-full text-xs text-white/90 ${sansFont} bg-white/5 border border-white/5`}>
                      <tbody>
                        {t.hours.map((hour, idx) => (
                          <tr key={idx} className="border-b border-white/5 last:border-0">
                            <td className="py-3 px-4 font-medium uppercase opacity-70 tracking-widest">{hour.days}</td>
                            <td className={`py-3 px-4 ${isRtl ? 'text-left' : 'text-right'} text-white/90 whitespace-nowrap`}>{hour.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-4">
                  <Phone className="text-[#C7B28B] shrink-0 mt-1" size={24} />
                  <div className="w-full">
                    <h5 className={`text-[10px] uppercase tracking-[0.3em] text-white/50 mb-4`}>Contact</h5>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a href={`tel:${PHONE_NUMBER}`} className={`flex-1 border border-white/20 hover:border-[#C7B28B] rounded-none py-4 px-6 flex justify-center items-center gap-2 transition-colors`}>
                        <Phone size={14} />
                        <span className={`text-xs uppercase tracking-widest`}>{t.callUs}</span>
                      </a>
                      <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className={`flex-1 bg-white hover:bg-[#C7B28B] text-black rounded-none py-4 px-6 flex justify-center items-center gap-2 transition-colors`}>
                        <MessageCircle size={14} />
                        <span className={`text-xs uppercase font-bold tracking-widest`}>{t.bookWhatsApp}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map Column */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-7 h-[500px] lg:h-[700px] rounded-none overflow-hidden relative border border-white/10 grayscale contrast-125 group bg-zinc-800"
            >
              {/* Google Map iFrame with Dark Mode Styling passed via styles or just styled generic map */}
              <iframe
                src="https://maps.google.com/maps?q=2J5C+F37,+Alkhuzama,+Bisha+67711,+Saudi+Arabia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter contrast-125 saturate-50 brightness-75 group-hover:brightness-100 transition-all duration-700"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center bg-[#0a0a0a]">
        <p className={`text-[10px] text-white/40 uppercase tracking-widest`}>
          {t.footerText}
        </p>
      </footer>

      {/* Marquee Keyframes handled by Tailwind arbitrarily or custom layer in index.css */}
    </div>
  );
}
