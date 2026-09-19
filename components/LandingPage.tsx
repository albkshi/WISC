'use client';

import React from 'react';
import Image from 'next/image';
import { RegionalActivity, AppSettings, BosnianMosque, LandingPageConfig } from '@/lib/types';
import { historicBosnianMosques } from '@/lib/mosques-data';
import { 
  Globe, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  HeartHandshake, 
  BookOpen, 
  Mail, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Compass, 
  MessageSquare
} from 'lucide-react';

interface LandingPageProps {
  activities: RegionalActivity[];
  settings: AppSettings;
  landingConfig: LandingPageConfig;
  mosques?: BosnianMosque[];
}

export default function LandingPage({
  activities,
  settings,
  landingConfig,
  mosques = historicBosnianMosques,
}: LandingPageProps) {
  // Language view toggle (Arabic / Bosnian)
  const [lang, setLang] = React.useState<'ar' | 'bs'>('ar');
  
  // Mosque Filter by City
  const [selectedCity, setSelectedCity] = React.useState<string>('all');
  const [selectedMosque, setSelectedMosque] = React.useState<BosnianMosque | null>(null);
  const [mosqueImageErrors, setMosqueImageErrors] = React.useState<Record<string, boolean>>({});
  const [heroImageError, setHeroImageError] = React.useState(false);

  // News Filter by Category
  const [newsCategory, setNewsCategory] = React.useState<string>('all');
  const [selectedNews, setSelectedNews] = React.useState<RegionalActivity | null>(null);
  const [newsImageErrors, setNewsImageErrors] = React.useState<Record<string, boolean>>({});

  // Contact Form State
  const [contactForm, setContactForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmittingContact, setIsSubmittingContact] = React.useState(false);
  const [contactSubmitted, setContactSubmitted] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setIsSubmittingContact(true);
    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSubmitted(true);
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setContactSubmitted(false), 7000);
    }, 600);
  };

  // Active Mosques (From Firebase or fallback)
  const activeMosques = (mosques && mosques.length > 0) ? mosques : historicBosnianMosques;

  // Filtered Mosques
  const filteredMosques = React.useMemo(() => {
    if (selectedCity === 'all') return activeMosques;
    return activeMosques.filter(m => m.cityBs.toLowerCase().includes(selectedCity.toLowerCase()));
  }, [selectedCity, activeMosques]);

  // Filtered News
  const filteredNews = React.useMemo(() => {
    let list = activities.filter(a => a.published);
    if (newsCategory !== 'all') {
      list = list.filter(a => a.category === newsCategory);
    }
    return list;
  }, [activities, newsCategory]);

  return (
    <div className="w-full text-stone-900 selection:bg-blue-200">

      {/* ========================================================= */}
      {/* 1. MAIN / HERO SECTION                                    */}
      {/* ========================================================= */}
      <section id="hero" className="relative bg-white text-slate-900 overflow-hidden py-12 sm:py-16 border-b border-slate-200">
        
        {/* Ambient Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Header Row: Region Badge & Language Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 bg-stone-50 text-stone-800 px-4 py-1.5 rounded-full text-xs font-semibold border border-stone-200 shadow-xs">
              <Compass className="w-4 h-4 text-stone-600" />
              <span className="font-arabic font-bold">
                {lang === 'ar' ? landingConfig.topBadgeAr : landingConfig.topBadgeBs}
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-stone-50 border border-stone-200 rounded-full p-1 text-xs shadow-xs">
              <button
                onClick={() => setLang('ar')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  lang === 'ar' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang('bs')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  lang === 'bs' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Bosanski
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* NOBLE QURANIC VERSE BANNER (SURAH ALI 'IMRAN: 104)        */}
          {/* ========================================================= */}
          {landingConfig.showQuranVerse && (
            <div className="mb-10 relative overflow-hidden rounded-3xl bg-stone-50/70 border border-stone-200 p-6 sm:p-8 shadow-xs">
              <div className="relative text-center space-y-3.5">
                <blockquote className="font-arabic font-extrabold text-xl sm:text-2xl md:text-3xl text-stone-900 leading-relaxed sm:leading-loose tracking-wide max-w-4xl mx-auto">
                  {lang === 'ar' ? landingConfig.quranVerseAr : landingConfig.quranVerseBs}
                </blockquote>

                <div className="inline-block text-xs sm:text-sm font-semibold text-stone-600 font-mono bg-white px-3.5 py-1 rounded-full border border-stone-200 shadow-xs">
                  {lang === 'ar' ? landingConfig.quranCitationAr : landingConfig.quranCitationBs}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Main Column: Organization Introduction */}
            <div className="lg:col-span-8 space-y-6 text-right">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold">
                <Globe className="w-3.5 h-3.5 text-stone-600" />
                <span>
                  {lang === 'ar'
                    ? 'الفرع الإقليمي في العاصمة سراييفو'
                    : 'Regionalno predstavništvo u Sarajevu'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-arabic tracking-tight text-slate-900 leading-tight">
                {lang === 'ar' ? (
                  <>
                    {landingConfig.orgNameAr}
                    <span className="block text-stone-700 text-2xl sm:text-4xl mt-2 font-normal">
                      {landingConfig.subTitleAr}
                    </span>
                  </>
                ) : (
                  <>
                    {landingConfig.orgNameBs}
                    <span className="block text-stone-700 text-2xl sm:text-4xl mt-2 font-normal">
                      {landingConfig.subTitleBs}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-arabic leading-relaxed">
                {lang === 'ar' ? landingConfig.heroDescriptionAr : landingConfig.heroDescriptionBs}
              </p>

              {/* Action Buttons to Sections */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                {/* Mosques Shortcut */}
                <a
                  href="#mosques"
                  className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-3.5 rounded-2xl font-bold font-arabic text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-stone-300" />
                  <span>{lang === 'ar' ? 'استكشف مساجد البوسنة التاريخية' : 'Istražite historijske džamije'}</span>
                  <ArrowLeft className="w-4 h-4" />
                </a>

                {/* News Shortcut */}
                <a
                  href="#news"
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-3.5 rounded-2xl font-bold font-arabic text-sm transition-all border border-slate-300 shadow-xs cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-stone-700" />
                  <span>{lang === 'ar' ? 'الأخبار والأنشطة' : 'Vijesti i aktivnosti'}</span>
                </a>

                {/* Contact Shortcut */}
                <a
                  href="#contact"
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-3.5 rounded-2xl font-bold font-arabic text-sm transition-all border border-slate-300 shadow-xs cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'اتصل بنا' : 'Kontaktirajte nas'}</span>
                </a>
              </div>

              {/* Key Pillars - Dynamic from landingConfig.stats (WICS حوار وإنسانية removed) */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 border-t border-slate-200">
                {landingConfig.stats.map((stat, idx) => (
                  <div key={stat.id || idx} className="bg-white p-3 rounded-xl border border-slate-200 text-right shadow-xs">
                    <div className={`text-xl font-bold ${idx === 0 ? 'text-amber-600' : 'text-stone-800'}`}>
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-slate-500 font-arabic">
                      {lang === 'ar' ? stat.labelAr : stat.labelBs}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Visual Feature Card */}
            <div className="lg:col-span-4">
              <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl group">
                <div className="relative h-80 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={heroImageError || !landingConfig.heroImageUrl ? '/mosques/begova.jpg' : landingConfig.heroImageUrl}
                    alt="Sarajevo Baščaršija Mosque"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImageError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                  
                  {/* Floating Stamp */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-200 flex items-center gap-1.5 text-xs text-slate-900 font-bold shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-blue-700" />
                    <span>Sarajevo • Baščaršija</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3 bg-white text-right border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-800 font-mono font-bold">WICS-BiH</span>
                    <span className="text-xs font-arabic font-bold text-slate-600">
                      {lang === 'ar' ? 'سراييفو العاصمة' : 'Sarajevo, Centar'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 font-arabic text-base">
                    {lang === 'ar' ? landingConfig.heroImageCaptionAr : landingConfig.heroImageCaptionBs}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-arabic">
                    {lang === 'ar'
                      ? 'تتميز البوسنة والهرسك بتراث معماري وروحي فريد يمتد لقرون، حيث تصدح المآذن التاريخية بأسمى معاني الإخاء والتعايش.'
                      : 'Bosna i Hercegovina baštini jedinstveno duhovno i arhitektonsko naslijeđe koje stoljećima svjedoči o kulturi suživota.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 2. HISTORIC MOSQUES OF BOSNIA SECTION                     */}
      {/* ========================================================= */}
      <section id="mosques" className="py-20 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-900 text-xs font-bold font-arabic">
                <Building2 className="w-3.5 h-3.5 text-stone-700" />
                <span>
                  {lang === 'ar' ? 'التراث المعماري الإسلامي في البلقان' : 'Islamska arhitektura u Bosni i Hercegovini'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-arabic">
                {lang === 'ar'
                  ? 'مساجد البوسنة والهرسك التاريخية'
                  : 'Historijske džamije u Bosni i Hercegovini'}
              </h2>
              <p className="text-sm sm:text-base text-stone-600 max-w-2xl font-arabic">
                {lang === 'ar'
                  ? 'شواهد حيّة على قرون من الإشعاع الحضاري الإسلامي والتعايش، شيّدها كبار الولاة والمعماريين مثل معمار سنان وخسرو بك.'
                  : 'Pregled najznačajnijih monumentalnih zadužbina i spomenika islamske civilizacije u gradovima širom Bosne i Hercegovine.'}
              </p>
            </div>

            {/* City Filters */}
            <div className="flex items-center gap-2 flex-wrap bg-white p-1.5 rounded-2xl border border-stone-200 shadow-xs">
              {[
                { id: 'all', labelAr: 'كافة المدن', labelBs: 'Svi gradovi' },
                { id: 'sarajevo', labelAr: 'سراييفو', labelBs: 'Sarajevo' },
                { id: 'mostar', labelAr: 'موستار', labelBs: 'Mostar' },
                { id: 'travnik', labelAr: 'ترافنيك', labelBs: 'Travnik' },
                { id: 'foča', labelAr: 'فوتشا', labelBs: 'Foča' },
                { id: 'banja luka', labelAr: 'بانيا لوكا', labelBs: 'Banja Luka' },
              ].map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-arabic transition-all ${
                    selectedCity === city.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {lang === 'ar' ? city.labelAr : city.labelBs}
                </button>
              ))}
            </div>
          </div>

          {/* Mosques Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMosques.map((mosque) => (
              <div
                key={mosque.id}
                onClick={() => setSelectedMosque(mosque)}
                className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
              >
                {/* Photo */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={mosqueImageErrors[mosque.id] ? '/mosques/begova.jpg' : mosque.imageUrl}
                    alt={mosque.nameBs}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={() => setMosqueImageErrors(prev => ({ ...prev, [mosque.id]: true }))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                  
                  {/* City Badge */}
                  <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    {lang === 'ar' ? mosque.cityAr.split('(')[0] : mosque.cityBs.split('(')[0]}
                  </div>

                  {/* Year Tag */}
                  <div className="absolute bottom-3 right-3 text-amber-300 text-xs font-bold font-mono">
                    {mosque.yearBuilt.split(' ')[0]}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between text-right space-y-3 font-arabic">
                  <div>
                    <h3 className="font-bold text-stone-900 text-base group-hover:text-stone-700 transition-colors leading-snug">
                      {lang === 'ar' ? mosque.nameAr : mosque.nameBs}
                    </h3>
                    <p className="text-xs text-stone-700 font-semibold mt-1">
                      {lang === 'ar' ? mosque.tagAr : mosque.tagBs}
                    </p>
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                      {lang === 'ar' ? mosque.descriptionAr : mosque.descriptionBs}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-blue-700">
                    <span className="flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      <span>{lang === 'ar' ? 'عرض التفاصيل والمعلومات' : 'Pogledaj detalje'}</span>
                    </span>
                    <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 3. NEWS & REGIONAL ACTIVITIES SECTION                     */}
      {/* ========================================================= */}
      <section id="news" className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold font-arabic">
                <Globe className="w-3.5 h-3.5 text-amber-700" />
                <span>
                  {lang === 'ar' ? 'النشاط الميداني والأخبار الرسمية' : 'Zvanične vijesti i aktivnosti'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-arabic">
                {lang === 'ar'
                  ? 'أخبار وأنشطة الجمعية في البوسنة'
                  : 'Vijesti i regionalne aktivnosti'}
              </h2>
              <p className="text-sm sm:text-base text-stone-600 max-w-2xl font-arabic">
                {lang === 'ar'
                  ? 'متابعة حية للمشاريع الإنسانية، رعاية اللغة العربية، وبرامج التواصل الثقافي في سراييفو ومختلف المدن.'
                  : 'Najnovije informacije o kulturnoj saradnji, humanitarnim akcijama i obrazovnim projektima u Bosni i Hercegovini.'}
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 flex-wrap bg-stone-50 p-1.5 rounded-2xl border border-stone-200">
              {[
                { id: 'all', labelAr: 'كافة الأنشطة', labelBs: 'Sve' },
                { id: 'diplomatic', labelAr: 'اللقاءات الرسمية', labelBs: 'Zvanični susreti' },
                { id: 'humanitarian', labelAr: 'المساعدات والإغاثة', labelBs: 'Humanitarno' },
                { id: 'dialogue', labelAr: 'الحوار والتسامح', labelBs: 'Dijalog' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setNewsCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-arabic transition-all ${
                    newsCategory === cat.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {lang === 'ar' ? cat.labelAr : cat.labelBs}
                </button>
              ))}
            </div>
          </div>

          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredNews.map((news) => (
              <article
                key={news.id}
                onClick={() => setSelectedNews(news)}
                className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  {news.imageUrl ? (
                    <Image
                      src={newsImageErrors[news.id] ? '/mosques/begova.jpg' : news.imageUrl}
                      alt={news.titleBs}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={() => setNewsImageErrors(prev => ({ ...prev, [news.id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <Globe className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-stone-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                    {news.category}
                  </div>

                  <div className="absolute bottom-3 right-3 text-white text-xs font-mono flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{news.date}</span>
                    <span>•</span>
                    <span>{news.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between text-right space-y-4 font-arabic">
                  <div>
                    <h3 className="font-bold text-stone-900 text-lg group-hover:text-blue-700 transition-colors leading-snug">
                      {lang === 'ar' ? news.titleAr : news.titleBs}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                      {lang === 'ar' ? news.summaryAr : news.summaryBs}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-800">
                    <span className="flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      <span>{lang === 'ar' ? 'قراءة الخبر كاملاً' : 'Pročitaj više'}</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </span>
                    {news.partnerOrganization && (
                      <span className="text-[11px] text-stone-500 font-normal font-sans">
                        {news.partnerOrganization.split('&')[0]}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 4. CONTACTS & OFFICIAL INQUIRIES SECTION                  */}
      {/* ========================================================= */}
      <section id="contact" className="py-20 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-right max-w-3xl mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200 text-stone-900 text-xs font-bold font-arabic">
              <Mail className="w-3.5 h-3.5 text-stone-700" />
              <span>
                {lang === 'ar' ? 'قنوات الاتصال والتواصل الرسمي' : 'Službeni kontakt i adrese'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-arabic">
              {lang === 'ar' ? 'اتصل بفرع الجمعية في سراييفو' : 'Kontaktirajte predstavništvo u Sarajevu'}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 font-arabic">
              {lang === 'ar'
                ? 'يسعدنا استقبال استفساراتكم ومقترحات التعاون الثقافي والإنساني والمؤسسي عبر القنوات الرسمية لفرع البوسنة والهرسك.'
                : 'Stojimo vam na raspolaganju za sve upite, institucionalnu saradnju, kulturne i obrazovne projekte u Bosni i Hercegovini.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left/Main Column: Interactive Contact Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs text-right font-arabic">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-stone-400 font-mono">WICS-BiH INQUIRY</span>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span>{lang === 'ar' ? 'إرسال رسالة أو استفسار' : 'Pošaljite nam poruku'}</span>
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </h3>
              </div>

              {contactSubmitted ? (
                <div className="bg-stone-50 border border-stone-300 rounded-2xl p-6 text-center space-y-3 animate-in fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-stone-900">
                    {lang === 'ar' ? 'تم استلام رسالتكم بنجاح!' : 'Vaša poruka je uspješno poslana!'}
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed max-w-md mx-auto">
                    {lang === 'ar'
                      ? 'شكراً لتواصلكم مع جمعية الدعوة الإسلامية العالمية - فرع سراييفو. سيقوم فريقنا بمراجعة استفساركم والرد عليكم في أقرب وقت ممكن.'
                      : 'Zahvaljujemo se na kontaktu. Naš tim će pregledati vaš upit i odgovoriti u najkraćem roku.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        {lang === 'ar' ? 'الاسم الكامل *' : 'Puno ime i prezime *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder={lang === 'ar' ? 'مثال: أحمد مصطفى' : 'npr. Ahmed Horozović'}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-blue-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email adresa *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-blue-600 transition-colors text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        {lang === 'ar' ? 'رقم الهاتف / واتساب' : 'Broj telefona'}
                      </label>
                      <input
                        type="text"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+387 61 000 000"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-blue-600 transition-colors text-left"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        {lang === 'ar' ? 'موضوع الرسالة *' : 'Predmet poruke *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder={lang === 'ar' ? 'استفسار عام / تعاون ثقافي' : 'Upit / Saradnja'}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      {lang === 'ar' ? 'نص الرسالة والاستفسار *' : 'Tekst poruke *'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder={lang === 'ar' ? 'اكتب تفاصيل رسالتكم هنا...' : 'Unesite detalje vaše poruke...'}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-900 focus:outline-hidden focus:border-blue-600 transition-colors resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingContact ? (
                      <span>{lang === 'ar' ? 'جاري الإرسال...' : 'Slanje...'}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{lang === 'ar' ? 'إرسال الرسالة الآن' : 'Pošaljite poruku'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Office Cards & Location Info */}
            <div className="lg:col-span-5 space-y-4 text-right font-arabic">
              
              {/* Office Address Card */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleCopy(landingConfig.contactAddressBs || settings.sarajevoOfficeAddressBs, 'address')}
                    className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
                    title="نسخ العنوان"
                  >
                    {copiedField === 'address' ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                    <span>{lang === 'ar' ? 'مقر الفرع في سراييفو' : 'Adresa predstavništva'}</span>
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-sans" dir="ltr">
                  {lang === 'ar' ? (landingConfig.contactAddressAr || settings.sarajevoOfficeAddressAr) : (landingConfig.contactAddressBs || settings.sarajevoOfficeAddressBs)}
                </p>
                <div className="text-[11px] text-blue-700 font-bold">
                  {lang === 'ar' ? 'سراييفو القديمة • بالقرب من جامع الغازي خسرو بك' : 'Stari Grad Sarajevo • U neposrednoj blizini Begove džamije'}
                </div>
              </div>

              {/* Email & Phone Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Email */}
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleCopy(landingConfig.contactEmail || settings.contactEmail, 'email')}
                      className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
                      title="نسخ البريد"
                    >
                      {copiedField === 'email' ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <div className="flex items-center gap-1.5 text-stone-900 font-bold text-xs">
                      <span>{lang === 'ar' ? 'البريد الرسمي' : 'Email'}</span>
                      <Mail className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                  </div>
                  <a
                    href={`mailto:${landingConfig.contactEmail || settings.contactEmail}`}
                    className="block text-xs font-mono text-blue-700 hover:underline truncate"
                    dir="ltr"
                  >
                    {landingConfig.contactEmail || settings.contactEmail}
                  </a>
                  <p className="text-[10px] text-stone-400">
                    {lang === 'ar' ? 'للمراسلات الرسمية' : 'Zvanična korespondencija'}
                  </p>
                </div>

                {/* Phone */}
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleCopy(landingConfig.contactPhone || settings.contactPhone, 'phone')}
                      className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
                      title="نسخ الهاتف"
                    >
                      {copiedField === 'phone' ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <div className="flex items-center gap-1.5 text-stone-900 font-bold text-xs">
                      <span>{lang === 'ar' ? 'الهاتف المباشر' : 'Telefon'}</span>
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                  </div>
                  <a
                    href={`tel:${landingConfig.contactPhone || settings.contactPhone}`}
                    className="block text-xs font-mono text-stone-800 hover:text-blue-700"
                    dir="ltr"
                  >
                    {landingConfig.contactPhone || settings.contactPhone}
                  </a>
                  <p className="text-[10px] text-stone-400">
                    {lang === 'ar' ? 'سراييفو - البوسنة' : 'Sarajevo, BiH'}
                  </p>
                </div>

              </div>

              {/* Working Hours */}
              <div className="bg-stone-100 text-stone-900 p-5 rounded-3xl shadow-xs space-y-2 border border-stone-200">
                <div className="flex items-center justify-end gap-2 text-xs font-bold text-stone-900">
                  <span>{lang === 'ar' ? 'أوقات العمل واستقبال المراجعين' : 'Radno vrijeme'}</span>
                  <Clock className="w-4 h-4 text-stone-700" />
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200">
                  <span className="font-mono text-stone-800 font-bold">{landingConfig.workingHoursWeekdays || '09:00 - 17:00 (CET)'}</span>
                  <span className="text-slate-700">{lang === 'ar' ? 'الإثنين - الجمعة' : 'Ponedjeljak - Petak'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="text-amber-700 font-bold">{lang === 'ar' ? (landingConfig.workingHoursWeekendsAr || 'عطلة رسمية') : (landingConfig.workingHoursWeekendsBs || 'Zatvoreno')}</span>
                  <span>{lang === 'ar' ? 'السبت والأحد' : 'Subota i Nedjelja'}</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 5. MODALS (MOSQUE DETAIL & NEWS DETAIL)                   */}
      {/* ========================================================= */}

      {/* Mosque Detail Modal */}
      {selectedMosque && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-stone-200">
            
            {/* Modal Image Banner */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-100">
              <Image
                src={mosqueImageErrors[selectedMosque.id] ? '/mosques/begova.jpg' : selectedMosque.imageUrl}
                alt={selectedMosque.nameBs}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                onError={() => setMosqueImageErrors(prev => ({ ...prev, [selectedMosque.id]: true }))}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              
              <button
                onClick={() => setSelectedMosque(null)}
                className="absolute top-4 left-4 bg-stone-900/80 hover:bg-stone-900 text-white p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 right-4 left-4 text-right text-white">
                <span className="text-xs bg-stone-900/90 text-white font-bold px-3 py-1 rounded-full inline-block mb-2 shadow-sm">
                  {lang === 'ar' ? selectedMosque.cityAr : selectedMosque.cityBs} • {selectedMosque.yearBuilt}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-arabic">
                  {lang === 'ar' ? selectedMosque.nameAr : selectedMosque.nameBs}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-right font-arabic">
              
              {/* Builder & Architect Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <div className="text-stone-500 font-bold mb-1">
                    {lang === 'ar' ? 'المؤسس والواقف:' : 'Vakif i graditelj:'}
                  </div>
                  <div className="text-stone-900 font-bold text-sm">
                    {lang === 'ar' ? selectedMosque.builderAr : selectedMosque.builderBs}
                  </div>
                </div>
                {selectedMosque.architectAr && (
                  <div>
                    <div className="text-stone-500 font-bold mb-1">
                      {lang === 'ar' ? 'المعماري المصمم:' : 'Arhitekt:'}
                    </div>
                    <div className="text-stone-900 font-bold text-sm">
                      {lang === 'ar' ? selectedMosque.architectAr : selectedMosque.architectBs}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-stone-900">
                  {lang === 'ar' ? 'نبذة تاريخية ومعمارية:' : 'Historijski i arhitektonski pregled:'}
                </h4>
                <p className="text-stone-700 text-sm leading-relaxed">
                  {lang === 'ar' ? selectedMosque.descriptionAr : selectedMosque.descriptionBs}
                </p>
              </div>

              {/* Significance */}
              <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 justify-end">
                  <span>{lang === 'ar' ? 'الأهمية الدينية والحضارية:' : 'Vjerski i kulturni značaj:'}</span>
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </h4>
                <p className="text-stone-700 text-xs leading-relaxed">
                  {lang === 'ar' ? selectedMosque.historicalSignificanceAr : selectedMosque.historicalSignificanceBs}
                </p>
              </div>

              {/* Key Features List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {lang === 'ar' ? 'أبرز الخصائص والمعالم:' : 'Ključne karakteristike:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(lang === 'ar' ? selectedMosque.featuresAr : selectedMosque.featuresBs).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-stone-800 bg-stone-100/70 p-2.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center">
              <span className="text-xs text-stone-500 font-mono">
                WICS Islamic Heritage
              </span>
              <button
                onClick={() => setSelectedMosque(null)}
                className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2 rounded-xl text-xs font-bold font-arabic transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Zatvori'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* News Article Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-stone-200">
            
            {/* Header */}
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <button
                onClick={() => setSelectedNews(null)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-right">
                <span className="text-[10px] bg-stone-100 text-stone-800 font-bold px-2 py-0.5 rounded-md border border-stone-200">
                  {selectedNews.category}
                </span>
                <div className="text-xs text-stone-500 font-mono mt-1">
                  {selectedNews.date} • {selectedNews.location}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-right font-arabic">
              
              {selectedNews.imageUrl && (
                <div className="relative h-64 w-full rounded-2xl overflow-hidden">
                  <Image
                    src={newsImageErrors[selectedNews.id] ? '/mosques/begova.jpg' : selectedNews.imageUrl}
                    alt={selectedNews.titleBs}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setNewsImageErrors(prev => ({ ...prev, [selectedNews.id]: true }))}
                  />
                </div>
              )}

              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                {lang === 'ar' ? selectedNews.titleAr : selectedNews.titleBs}
              </h2>

              <div className="p-4 bg-stone-50 rounded-2xl border-r-4 border-blue-600 text-stone-700 text-sm font-semibold leading-relaxed">
                {lang === 'ar' ? selectedNews.summaryAr : selectedNews.summaryBs}
              </div>

              {selectedNews.detailsAr && (
                <div className="text-stone-700 text-sm leading-relaxed space-y-3">
                  <p>{lang === 'ar' ? selectedNews.detailsAr : selectedNews.detailsBs}</p>
                </div>
              )}

              {selectedNews.partnerOrganization && (
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold text-stone-700">{selectedNews.partnerOrganization}</span>
                  <span>{lang === 'ar' ? 'الجهات الشريكة:' : 'Partner:'}</span>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2 rounded-xl text-xs font-bold font-arabic transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Zatvori'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
