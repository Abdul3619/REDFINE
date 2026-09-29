import { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { MapPin, MessageCircle, Clock, ChevronRight, ChevronLeft, Menu, X, Check } from 'lucide-react';
import { translations, SERVICE_MENU, MEMBERSHIPS, FEATURED_PHOTOS, HERO_PHOTO, ATELIER_PHOTO, type Language, type ServiceId } from './data/content';
import { whatsappLink } from './data/site';
import { useLocalStorage } from './lib/useLocalStorage';
import Photo from './components/Photo';
import BookingForm from './components/BookingForm';
import IllustrativeBadge from './components/IllustrativeBadge';

// Which service each membership plan books by default
const PLAN_SERVICE: Record<(typeof MEMBERSHIPS)[number]['id'], ServiceId> = {
  essential: 'signature-cut',
  signature: 'cut-and-beard',
  royal: 'cut-and-beard',
};

export default function App() {
  // Language is remembered between visits (loaded after hydration, so the prerendered English HTML matches).
  const [lang, setLang] = useLocalStorage<Language>('redfine:lang', 'en');
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [activeService, setActiveService] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [requested, setRequested] = useState<{ service: ServiceId; n: number } | null>(null);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  const nextService = () => setActiveService((prev) => (prev + 1) % t.featured.length);
  const prevService = () => setActiveService((prev) => (prev === 0 ? t.featured.length - 1 : prev - 1));

  const bookService = (service: ServiceId) => {
    setRequested((r) => ({ service, n: (r?.n ?? 0) + 1 }));
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  };

  const serifFont = isRtl ? 'font-ar-serif' : 'font-en-serif';
  const sansFont = isRtl ? 'font-ar-sans' : 'font-en-sans';
  const headingTracking = isRtl ? 'tracking-normal' : 'tracking-tight';
  const buttonTracking = isRtl ? 'tracking-normal' : 'tracking-[0.15em]';

  const navLinks = [
    { name: t.nav.services, href: '#services' },
    { name: t.nav.pricing, href: '#pricing' },
    { name: t.nav.memberships, href: '#memberships' },
    { name: t.nav.visit, href: '#location' },
  ];

  const featured = t.featured[activeService];

  return (
    <MotionConfig reducedMotion="user">
      <div className={`min-h-screen bg-bg-salon text-white ${sansFont}`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-[#C7B28B] focus:text-black focus:px-4 focus:py-2">
          {isRtl ? 'انتقل إلى المحتوى' : 'Skip to content'}
        </a>

        {/* 1. Persistent Header */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-bg-salon/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}`}>
          <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
            <a href="#home" className={`text-2xl uppercase ${serifFont} tracking-widest text-white`}>
              {t.brand}
            </a>

            <nav aria-label={isRtl ? 'القائمة الرئيسية' : 'Main'} className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-[11px] uppercase tracking-widest text-white/80 hover:text-[#C7B28B] transition-colors">
                  {link.name}
                </a>
              ))}
              <a href="#book" className="press text-[11px] uppercase tracking-widest border border-[#C7B28B] text-[#C7B28B] px-4 py-2 hover:bg-[#C7B28B] hover:text-black transition-colors">
                {t.bookBtn}
              </a>
              <button onClick={toggleLang} aria-label={t.langToggleLabel} className="press px-3 py-1 text-[11px] border border-white/30 rounded hover:border-[#C7B28B] text-white hover:text-[#C7B28B] transition-colors uppercase">
                {t.langToggle}
              </button>
            </nav>

            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleLang} aria-label={t.langToggleLabel} className="press px-3 py-1 text-[11px] border border-white/30 rounded uppercase text-white hover:border-[#C7B28B] transition-colors">
                {t.langToggle}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? t.closeMenu : t.openMenu}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                className="text-white"
              >
                {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                id="mobile-menu"
                aria-label={isRtl ? 'القائمة' : 'Mobile'}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden bg-bg-salon/95 backdrop-blur-md border-b border-white/10 overflow-hidden"
              >
                <div className="flex flex-col px-6 py-4 gap-4">
                  {[...navLinks, { name: t.bookBtn, href: '#book' }].map((link) => (
                    <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`text-lg py-2 border-b border-white/5 ${serifFont} text-white/90`}>
                      {link.name}
                    </a>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        {/* Floating booking button: jumps to the booking form */}
        <a
          href="#book"
          aria-label={t.bookBtn}
          className="press fixed bottom-6 right-6 rtl:right-auto rtl:left-6 md:bottom-10 md:right-10 md:rtl:left-10 z-40 bg-[#C7B28B] text-black px-6 md:px-10 py-4 rounded-none shadow-[0_4px_20px_rgba(199,178,139,0.15)] hover:brightness-110 transition-all flex items-center gap-3 font-bold uppercase text-xs tracking-widest"
        >
          <span className="hidden md:inline-block">{t.bookBtn}</span>
          <span aria-hidden="true">{isRtl ? '←' : '→'}</span>
        </a>

        <main id="main">
          {/* 2. Hero Section */}
          <section id="home" className="relative h-[100svh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Photo
                id={HERO_PHOTO}
                alt={t.heroAlt}
                sizes="100vw"
                eager
                wrapperClassName="w-full h-full opacity-40"
                className="w-full h-full object-cover scale-105 origin-center animate-[pulse_20s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
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
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className={`mt-8 text-sm md:text-base uppercase ${buttonTracking} text-white/80`}
              >
                {t.heroSubtitle}
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} className="mt-10 flex flex-col items-center gap-10">
                <a href="#book" className="press bg-[#C7B28B] text-black px-10 py-4 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all">
                  {t.bookBtn}
                </a>
                <div className="h-[80px] w-[1px] bg-gradient-to-b from-[#C7B28B] to-transparent" aria-hidden="true" />
              </motion.div>
            </div>
          </section>

          {/* 3. Services Slideshow */}
          <section id="services" aria-labelledby="services-heading" className="py-24 md:py-32 relative">
            <div className="container mx-auto px-6 max-w-7xl">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="mb-16 flex items-end justify-between gap-6">
                <h2 id="services-heading" className={`text-4xl md:text-5xl lg:text-7xl font-light ${serifFont} ${headingTracking} text-[#C7B28B]`}>
                  {t.servicesTitle}
                </h2>
                <div className="flex gap-3 shrink-0">
                  <button onClick={prevService} aria-label={t.prevService} className="press w-12 h-12 border border-white/30 flex items-center justify-center hover:border-[#C7B28B] text-white hover:text-[#C7B28B] transition-colors">
                    {isRtl ? <ChevronRight size={24} aria-hidden="true" /> : <ChevronLeft size={24} aria-hidden="true" />}
                  </button>
                  <button onClick={nextService} aria-label={t.nextService} className="press w-12 h-12 border border-white/30 flex items-center justify-center hover:border-[#C7B28B] text-white hover:text-[#C7B28B] transition-colors">
                    {isRtl ? <ChevronLeft size={24} aria-hidden="true" /> : <ChevronRight size={24} aria-hidden="true" />}
                  </button>
                </div>
              </motion.div>

              <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden border border-white/10" role="group" aria-roledescription="carousel" aria-label={t.servicesTitle}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    <Photo id={FEATURED_PHOTOS[activeService]} alt={featured.title} sizes="(min-width: 1280px) 1216px, 100vw" wrapperClassName="w-full h-full" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-salon via-bg-salon/40 to-transparent opacity-90" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16" aria-live="polite">
                      <div className="max-w-2xl">
                        <span className="text-[#C7B28B] text-[11px] tracking-[0.3em] uppercase mb-4 block">
                          0{activeService + 1} // {t.featured.length}
                        </span>
                        <h3 className={`text-3xl md:text-5xl mb-4 font-light ${serifFont}`}>{featured.title}</h3>
                        <p className={`text-white/80 text-lg ${sansFont} max-w-xl leading-relaxed`}>{featured.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* 4. Menu & pricing */}
          <section id="pricing" aria-labelledby="pricing-heading" className="py-24 md:py-32 bg-[#141414] border-y border-white/5">
            <div className="container mx-auto px-6 max-w-5xl">
              <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h2 id="pricing-heading" className={`text-4xl md:text-6xl font-light ${serifFont} ${headingTracking} text-[#C7B28B] mb-4`}>
                    {t.pricingTitle}
                  </h2>
                  <p className="text-white/70">{t.pricingIntro}</p>
                </div>
                <p className="text-[#C7B28B]">
                  <IllustrativeBadge label={t.examplePricing} />
                </p>
              </div>
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {SERVICE_MENU.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="py-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
                  >
                    <div>
                      <h3 className={`text-xl md:text-2xl ${serifFont}`}>{t.services[s.id].name}</h3>
                      <p className="text-white/70 text-sm mt-1">{t.services[s.id].description}</p>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <span className="text-white/70 text-sm whitespace-nowrap">
                        <Clock size={14} className="inline -mt-0.5 me-1" aria-hidden="true" />
                        {s.minutes} {t.minutes}
                      </span>
                      <span className="text-[#C7B28B] text-lg whitespace-nowrap">
                        {s.price} {t.currency}
                      </span>
                      <button
                        onClick={() => bookService(s.id)}
                        aria-label={`${t.bookThis}: ${t.services[s.id].name}`}
                        className="press border border-white/30 hover:border-[#C7B28B] hover:text-[#C7B28B] px-5 py-2 text-[11px] uppercase tracking-widest transition-colors"
                      >
                        {t.bookThis}
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </section>

          {/* 5. Memberships */}
          <section id="memberships" aria-labelledby="memberships-heading" className="py-24 md:py-32">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="text-center mb-14">
                <h2 id="memberships-heading" className={`text-4xl md:text-6xl font-light ${serifFont} ${headingTracking} text-[#C7B28B] mb-4`}>
                  {t.membershipsTitle}
                </h2>
                <p className="text-white/70 max-w-xl mx-auto mb-4">{t.membershipsIntro}</p>
                <p className="text-[#C7B28B]">
                  <IllustrativeBadge label={t.examplePricing} />
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {MEMBERSHIPS.map((plan, i) => {
                  const p = t.plans[plan.id];
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className={`relative flex flex-col p-8 border ${plan.featured ? 'border-[#C7B28B] bg-[#C7B28B]/5' : 'border-white/15 bg-white/[0.02]'}`}
                    >
                      {plan.featured && (
                        <span className="absolute -top-3 left-8 rtl:left-auto rtl:right-8 bg-[#C7B28B] text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                          {t.mostPopular}
                        </span>
                      )}
                      <h3 className={`text-2xl ${serifFont} mb-4`}>{p.name}</h3>
                      <p className="mb-6">
                        <span className="text-4xl text-[#C7B28B]">{plan.price}</span>{' '}
                        <span className="text-white/70 text-sm">
                          {t.currency} {t.perMonth}
                        </span>
                      </p>
                      <ul className="space-y-3 mb-8 flex-1">
                        {p.perks.map((perk) => (
                          <li key={perk} className="flex gap-3 text-sm text-white/80">
                            <Check size={16} className="text-[#C7B28B] shrink-0 mt-0.5" aria-hidden="true" />
                            {perk}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => bookService(PLAN_SERVICE[plan.id])}
                        aria-label={`${t.choosePlan}: ${p.name}`}
                        className={`press py-3 text-xs uppercase tracking-widest transition-colors ${plan.featured ? 'bg-[#C7B28B] text-black font-bold hover:brightness-110' : 'border border-white/30 hover:border-[#C7B28B] hover:text-[#C7B28B]'}`}
                      >
                        {t.choosePlan}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 6. About 'The Atelier' */}
          <section id="about" aria-labelledby="about-heading" className="py-24 md:py-32 bg-[#141414] border-y border-white/5">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
                <motion.div initial={{ opacity: 0, x: isRtl ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }}>
                  <p className="text-[#C7B28B] uppercase text-[11px] tracking-[0.3em] mb-8 block">{t.aboutTitle}</p>
                  <h2 id="about-heading" className={`text-3xl md:text-5xl lg:text-6xl font-light ${serifFont} ${headingTracking} mb-8 leading-tight`}>
                    {t.aboutMission}
                  </h2>
                  <div className="w-12 h-[1px] bg-[#C7B28B] mb-8" />
                  <p className={`text-white/70 text-base md:text-lg leading-relaxed ${sansFont}`}>{t.aboutStory}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-100px' }} className="relative aspect-[3/4] overflow-hidden">
                  <Photo id={ATELIER_PHOTO} alt={t.aboutAlt} sizes="(min-width: 768px) 50vw, 100vw" wrapperClassName="w-full h-full" className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all duration-700" />
                  <div className="absolute inset-0 border border-white/10 m-6 pointer-events-none" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* 7. Client Testimonials (marquee; a static grid when the visitor prefers reduced motion) */}
          <section aria-labelledby="reviews-heading" className="py-24 md:py-32 overflow-hidden relative">
            <div className="container mx-auto px-6 max-w-7xl mb-16 text-center">
              <h2 id="reviews-heading" className={`text-3xl md:text-5xl font-light ${serifFont} text-[#C7B28B] mb-4`}>
                {t.testimonialsTitle}
              </h2>
              <p className="text-[#C7B28B]">
                <IllustrativeBadge label={t.sampleReview} />
              </p>
            </div>

            <div className="relative flex whitespace-nowrap group motion-reduce:whitespace-normal">
              <ul className="flex animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-6">
                {[0, 1, 2].flatMap((copy) =>
                  t.reviews.map((review, idx) => (
                    // The marquee repeats the reviews three times; screen readers get one copy.
                    <li
                      key={`${copy}-${idx}`}
                      aria-hidden={copy > 0 ? true : undefined}
                      className={`mx-8 px-12 py-8 bg-black/40 border border-white/10 w-[300px] md:w-[500px] hover:border-[#C7B28B]/30 transition-colors shadow-lg glass ${copy > 0 ? 'motion-reduce:hidden' : ''}`}
                    >
                      <p className={`text-lg md:text-xl font-light italic ${serifFont} text-white/90 whitespace-normal text-center`}>"{review.quote}"</p>
                      <p className={`mt-6 text-sm uppercase ${buttonTracking} text-[#C7B28B] text-center`}>
                        {review.name} · <span className="normal-case tracking-normal">{t.sampleReview}</span>
                      </p>
                    </li>
                  )),
                )}
              </ul>
            </div>
          </section>

          {/* 8. Booking */}
          <section id="book" aria-labelledby="book-heading" className="py-24 md:py-32 bg-[#141414] border-y border-white/5 scroll-mt-20">
            <div className="container mx-auto px-6 max-w-4xl">
              <h2 id="book-heading" className={`text-4xl md:text-6xl font-light ${serifFont} ${headingTracking} text-[#C7B28B] mb-4`}>
                {t.bookTitle}
              </h2>
              <p className="text-white/70 mb-12 max-w-2xl">{t.bookIntro}</p>
              <BookingForm t={t} lang={lang} requested={requested} serifFont={serifFont} />
            </div>
          </section>

          {/* 9. Location & Info */}
          <section id="location" aria-labelledby="location-heading" className="py-24 md:py-32 relative">
            <div className="container mx-auto px-6 max-w-5xl">
              <h2 id="location-heading" className={`text-4xl md:text-6xl font-light ${serifFont} mb-12 text-[#C7B28B]`}>
                {t.locationTitle}
              </h2>
              <div className="grid md:grid-cols-3 gap-10">
                <div className="flex items-start gap-4">
                  <MapPin className="text-[#C7B28B] shrink-0 mt-1" size={24} aria-hidden="true" />
                  <div>
                    <h3 className="text-[11px] uppercase tracking-[0.3em] text-white/70 mb-2">{t.locationHeading}</h3>
                    <p className="text-white/90">{t.locationArea}</p>
                    <p className="text-sm text-white/70 mt-2">{t.locationNote}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="text-[#C7B28B] shrink-0 mt-1" size={24} aria-hidden="true" />
                  <div className="w-full">
                    <h3 className="text-[11px] uppercase tracking-[0.3em] text-white/70 mb-2">{t.hoursTitle}</h3>
                    <table className={`w-full text-xs text-white/90 ${sansFont} bg-white/5 border border-white/5`}>
                      <tbody>
                        {t.hours.map((hour) => (
                          <tr key={hour.days} className="border-b border-white/5 last:border-0">
                            <th scope="row" className="py-3 px-4 font-medium uppercase text-white/80 tracking-widest text-start">
                              {hour.days}
                            </th>
                            <td className="py-3 px-4 text-end text-white/90 whitespace-nowrap">{hour.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageCircle className="text-[#C7B28B] shrink-0 mt-1" size={24} aria-hidden="true" />
                  <div className="w-full">
                    <h3 className="text-[11px] uppercase tracking-[0.3em] text-white/70 mb-4">{t.contactHeading}</h3>
                    <a
                      href={whatsappLink(t.whatsappMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press w-full bg-white hover:bg-[#C7B28B] text-black py-4 px-6 flex justify-center items-center gap-2 transition-colors"
                    >
                      <MessageCircle size={14} aria-hidden="true" />
                      <span className="text-xs uppercase font-bold tracking-widest">{t.bookWhatsApp}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="py-8 pb-28 md:pb-8 border-t border-white/10 text-center bg-[#0a0a0a] px-6">
          <p className="text-[11px] text-white/60 uppercase tracking-widest">
            {t.footerText} {t.footerDemo}
          </p>
          <p className="mt-2 text-[11px] text-white/60 uppercase tracking-widest">
            {t.builtBy} ·{' '}
            <a href="mailto:abdulwahababdullahi3619@gmail.com" className="text-[#C7B28B] underline underline-offset-2 hover:text-[#d6c5a5] transition-colors">
              {t.contactDev}
            </a>
          </p>
        </footer>
      </div>
    </MotionConfig>
  );
}
