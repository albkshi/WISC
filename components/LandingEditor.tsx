import React from 'react';
import { LandingPageConfig, AppSettings, StatItem } from '@/lib/types';
import WicsLogo from './WicsLogo';
import { 
  Upload, 
  Trash2, 
  Plus, 
  Save, 
  CheckCircle2, 
  Globe, 
  Sparkles, 
  RotateCcw, 
  Image as ImageIcon,
  BookOpen,
  BarChart3,
  Phone,
  Building,
  Loader2,
  Sliders,
  Maximize2,
  Eye,
  Layers
} from 'lucide-react';

interface LandingEditorProps {
  config: LandingPageConfig;
  settings: AppSettings;
  onSaveConfig: (updatedConfig: LandingPageConfig) => Promise<boolean>;
  onSaveLogo: (
    logoDataUrl: string | undefined, 
    logoSize?: number, 
    logoFrameStyle?: 'transparent' | 'white-card' | 'white-circle'
  ) => Promise<boolean>;
  onResetDefault: () => void;
}

export default function LandingEditor({
  config,
  settings,
  onSaveConfig,
  onSaveLogo,
  onResetDefault,
}: LandingEditorProps) {
  const [formData, setFormData] = React.useState<LandingPageConfig>(config);
  const [logoUrl, setLogoUrl] = React.useState<string | undefined>(settings.customLogoUrl);
  const [logoSize, setLogoSize] = React.useState<number>(settings.logoSizePx || 52);
  const [logoFrameStyle, setLogoFrameStyle] = React.useState<'transparent' | 'white-card' | 'white-circle'>(
    settings.logoFrameStyle || 'transparent'
  );
  const [activeSection, setActiveSection] = React.useState<'logo' | 'hero' | 'verse' | 'stats' | 'contact'>('hero');
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [logoSuccess, setLogoSuccess] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const heroImageInputRef = React.useRef<HTMLInputElement>(null);

  // Sync state if external config or logo changes
  const [prevConfig, setPrevConfig] = React.useState<LandingPageConfig>(config);
  if (prevConfig !== config) {
    setPrevConfig(config);
    setFormData(config);
  }

  const [prevLogo, setPrevLogo] = React.useState<string | undefined>(settings.customLogoUrl);
  if (prevLogo !== settings.customLogoUrl) {
    setPrevLogo(settings.customLogoUrl);
    setLogoUrl(settings.customLogoUrl);
  }

  const [prevSettings, setPrevSettings] = React.useState(settings);
  if (prevSettings !== settings) {
    setPrevSettings(settings);
    if (settings.logoSizePx && settings.logoSizePx !== logoSize) {
      setLogoSize(settings.logoSizePx);
    }
    if (settings.logoFrameStyle && settings.logoFrameStyle !== logoFrameStyle) {
      setLogoFrameStyle(settings.logoFrameStyle);
    }
  }

  // Handle Logo Upload
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (PNG, JPG, SVG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setLogoUrl(dataUrl);
      setIsSaving(true);
      const ok = await onSaveLogo(dataUrl, logoSize, logoFrameStyle);
      setIsSaving(false);
      if (ok) {
        setLogoSuccess(true);
        setTimeout(() => setLogoSuccess(false), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = async () => {
    setLogoUrl(undefined);
    setIsSaving(true);
    const ok = await onSaveLogo(undefined, logoSize, logoFrameStyle);
    setIsSaving(false);
    if (ok) {
      setLogoSuccess(true);
      setTimeout(() => setLogoSuccess(false), 3000);
    }
  };

  const handleSaveLogoCustomization = async () => {
    setIsSaving(true);
    const ok = await onSaveLogo(logoUrl, logoSize, logoFrameStyle);
    setIsSaving(false);
    if (ok) {
      setLogoSuccess(true);
      setTimeout(() => setLogoSuccess(false), 3000);
    }
  };

  // Handle Hero Image Upload
  const handleHeroImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData(prev => ({ ...prev, heroImageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Save All Config
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const ok = await onSaveConfig(formData);
    setIsSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  // Stat items handlers
  const handleUpdateStat = (id: string, field: keyof StatItem, val: string) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.map(s => s.id === id ? { ...s, [field]: val } : s)
    }));
  };

  const handleAddStat = () => {
    const newStat: StatItem = {
      id: `stat-${Date.now()}`,
      value: '100+',
      labelAr: 'إحصائية جديدة',
      labelBs: 'Nova stavka',
    };
    setFormData(prev => ({ ...prev, stats: [...prev.stats, newStat] }));
  };

  const handleRemoveStat = (id: string) => {
    setFormData(prev => ({ ...prev, stats: prev.stats.filter(s => s.id !== id) }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-bold font-arabic">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>نظام إدارة وتخصيص محتوى الواجهة والهيرو</span>
          </div>
          <h2 className="text-xl font-black text-stone-900 font-arabic">
            تعديل معلومات الواجهة الرئيسية وشعار الجمعية
          </h2>
          <p className="text-xs text-stone-500 font-arabic">
            جميع النصوص، الإحصائيات، الآية القرآنية، بيانات الاتصال، وشعار الجمعية قابلة للتعديل والتحديث فورياً.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors"
            title="استرجاع النصوص الافتراضية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الافتراضي</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>حفظ التغييرات</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs sm:text-sm font-arabic font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>تم حفظ كافة بيانات وتعديلات الواجهة الرئيسية بنجاح!</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveSection('logo')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'logo'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>شعار الجمعية (Logo)</span>
        </button>

        <button
          onClick={() => setActiveSection('hero')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'hero'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>عناوين ونصوص الهيرو</span>
        </button>

        <button
          onClick={() => setActiveSection('verse')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'verse'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>الآية القرآنية الكريمة</span>
        </button>

        <button
          onClick={() => setActiveSection('stats')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'stats'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>إحصائيات وأرقام الهيرو</span>
        </button>

        <button
          onClick={() => setActiveSection('contact')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'contact'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>بيانات الاتصال ومقر سراييفو</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. LOGO UPLOAD & MANAGEMENT                               */}
      {/* ========================================================= */}
      {activeSection === 'logo' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-8 text-right">
          
          {/* Header Title and Description */}
          <div className="border-b border-stone-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-700" />
                <h3 className="text-base font-bold text-stone-900 font-arabic">
                  تخصيص الشعار والحجم والشفافية (بدون إطار)
                </h3>
              </div>
              <p className="text-xs text-stone-500 font-arabic mt-1 leading-relaxed">
                يمكنك تغيير مقاس الشعار بحرية، وإلغاء الإطار ليكون مدمجاً وشفافاً (Frameless)، مع تثبيت ارتفاع شريط الهيدر العلوي عند 80px تلقائياً دون أي تمدد أو تشويه في شكل الموقع.
              </p>
            </div>

            {/* Quick Save Customization Action */}
            <button
              type="button"
              onClick={handleSaveLogoCustomization}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold font-arabic shadow-sm transition-all flex-shrink-0 disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>حفظ وتطبيق المقاس والإطار فورياً</span>
            </button>
          </div>

          {logoSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs font-arabic font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>تم حفظ وتحديث إعدادات الشعار، الحجم، ونمط العرض بنجاح عبر كامل النظام!</span>
            </div>
          )}

          {/* Sizing & Framing Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Right Column: Sizing and Frame Style Customization */}
            <div className="space-y-6 bg-stone-50/70 p-5 rounded-2xl border border-stone-200">
              
              {/* 1. Size Slider & Presets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-950 font-mono bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                    {logoSize}px
                  </span>
                  <label className="text-xs font-bold text-stone-800 font-arabic flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-stone-500" />
                    <span>حجم الشعار (Logo Resize)</span>
                  </label>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={32}
                  max={72}
                  step={2}
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                />

                <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                  <span>32px (أصغر)</span>
                  <span>52px (افتراضي)</span>
                  <span>72px (أقصى ملء)</span>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-stone-500 font-arabic ml-1">مقاسات سريعة:</span>
                  {[
                    { px: 38, label: '38px ناعم' },
                    { px: 48, label: '48px كلاسيكي' },
                    { px: 54, label: '54px متوازن ★' },
                    { px: 62, label: '62px واضح' },
                    { px: 68, label: '68px أقصى حجم' },
                  ].map((preset) => (
                    <button
                      key={preset.px}
                      type="button"
                      onClick={() => setLogoSize(preset.px)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                        logoSize === preset.px
                          ? 'bg-blue-900 text-white font-bold shadow-xs'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Frame Style Selector */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                <label className="text-xs font-bold text-stone-800 font-arabic flex items-center justify-end gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-stone-500" />
                  <span>نمط الإطار (Frame Style)</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Frameless Transparent */}
                  <button
                    type="button"
                    onClick={() => setLogoFrameStyle('transparent')}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-1.5 ${
                      logoFrameStyle === 'transparent'
                        ? 'border-blue-700 bg-blue-50/70 text-blue-950 ring-1 ring-blue-700 font-bold'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="w-2.5 h-2.5 rounded-full border border-blue-600 flex items-center justify-center">
                        {logoFrameStyle === 'transparent' && <span className="w-1.5 h-1.5 bg-blue-700 rounded-full" />}
                      </span>
                      <span className="text-xs font-arabic font-bold">بدون إطار (شفاف)</span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-arabic">مظهر نقي مدمج بالخلفية مباشرة</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold w-fit">
                      الموصى به ★
                    </span>
                  </button>

                  {/* White Card */}
                  <button
                    type="button"
                    onClick={() => setLogoFrameStyle('white-card')}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-1.5 ${
                      logoFrameStyle === 'white-card'
                        ? 'border-blue-700 bg-blue-50/70 text-blue-950 ring-1 ring-blue-700 font-bold'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="w-2.5 h-2.5 rounded-full border border-blue-600 flex items-center justify-center">
                        {logoFrameStyle === 'white-card' && <span className="w-1.5 h-1.5 bg-blue-700 rounded-full" />}
                      </span>
                      <span className="text-xs font-arabic font-bold">بطاقة بيضاء</span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-arabic">صندوق أبيض بزوايا ناعمة</span>
                  </button>

                  {/* White Circle */}
                  <button
                    type="button"
                    onClick={() => setLogoFrameStyle('white-circle')}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-1.5 ${
                      logoFrameStyle === 'white-circle'
                        ? 'border-blue-700 bg-blue-50/70 text-blue-950 ring-1 ring-blue-700 font-bold'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="w-2.5 h-2.5 rounded-full border border-blue-600 flex items-center justify-center">
                        {logoFrameStyle === 'white-circle' && <span className="w-1.5 h-1.5 bg-blue-700 rounded-full" />}
                      </span>
                      <span className="text-xs font-arabic font-bold">دائري أبيض</span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-arabic">إطار دائري كلاسيكي محاط</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Left Column: File Upload Area & Status */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-stone-800 font-arabic block mb-2">
                  رفع ملف شعار جديد من جهازك
                </span>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-blue-700 hover:bg-blue-50/30 p-6 rounded-2xl text-center cursor-pointer transition-all space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-stone-100 group-hover:bg-blue-100 flex items-center justify-center mx-auto text-stone-600 group-hover:text-blue-800 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-stone-800 font-arabic">
                      انقر هنا لاختيار ملف الشعار الجديد
                    </span>
                    <span className="block text-xs text-stone-500 mt-1">
                      يدعم PNG شفاف، SVG، JPG، WebP (للحصول على أفضل نتيجة بدون إطار: ارفع PNG بخلفية شفافة)
                    </span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoFileChange}
                />
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <div className="flex items-center gap-2 font-arabic">
                    {logoUrl ? (
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        شعار مخصص قيد الاستخدام
                      </span>
                    ) : (
                      <span className="text-stone-700 font-medium bg-stone-200 px-2.5 py-0.5 rounded-full">
                        الشعار الافتراضي بدون إطار
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono">
                    النمط: {logoFrameStyle === 'transparent' ? 'بدون إطار (شفاف)' : logoFrameStyle}
                  </span>
                </div>

                {logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-2.5 rounded-xl font-bold text-xs font-arabic transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>إزالة الشعار المخصص واستعادة الشعار الأصلي</span>
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* ======================================================= */}
          {/* LIVE SIMULATION: Exact Header Banner (Fixed 80px Height) */}
          {/* ======================================================= */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-stone-500 font-arabic">
                ارتفاع شريط الهيدر ثابت ومستقر عند 80px تماماً
              </span>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-stone-600" />
                <span className="text-xs font-bold text-stone-700 font-arabic">
                  معاينة حية ومحاكاة شريط الهيدر العلوي (Header Banner Simulation)
                </span>
              </div>
            </div>

            {/* Mock Header Frame */}
            <div className="rounded-2xl border border-stone-300 overflow-hidden shadow-xs bg-white">
              
              {/* Mini dark top banner */}
              <div className="bg-slate-900 text-slate-300 text-[10px] py-1 px-4 flex items-center justify-between">
                <span className="font-arabic">جمعية الدعوة الإسلامية العالمية • فرع البوسنة والهرسك</span>
                <span className="text-[9px] text-slate-400 font-sans hidden sm:inline">World Islamic Call Society • Sarajevo</span>
              </div>

              {/* Exact Header Bar - Height locked to 80px */}
              <div className="h-20 min-h-[80px] max-h-[80px] px-4 sm:px-6 bg-white flex items-center justify-between border-b border-stone-200">
                
                {/* Scaled and Frameless Logo */}
                <div className="flex items-center h-full py-1">
                  <WicsLogo
                    customLogoUrl={logoUrl}
                    sizePx={logoSize}
                    logoFrameStyle={logoFrameStyle}
                    showText={true}
                    bilingual={true}
                  />
                </div>

                {/* Sample navigation links on the left */}
                <div className="hidden sm:flex items-center gap-2 font-arabic text-xs font-bold text-stone-600">
                  <span className="px-3 py-1.5 rounded-lg bg-stone-100 text-blue-900">الرئيسية</span>
                  <span className="px-3 py-1.5 rounded-lg text-stone-600">مساجد البوسنة</span>
                  <span className="px-3 py-1.5 rounded-lg text-stone-600">الأنشطة</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 font-arabic text-center bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60">
              💡 يمكنك تكبير الشعار إلى {logoSize}px كما تشاء؛ ولن يؤثر ذلك على أبعاد أو حجم شريط الهيدر العلوي، حيث يبقى ثابتاً ومتناسقاً ومريحاً للعين.
            </p>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2. HERO & MAIN INFORMATION                                */}
      {/* ========================================================= */}
      {activeSection === 'hero' && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-right">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-base font-bold text-stone-900 font-arabic">
              عناوين ونصوص الهيرو والمقدمة التعريفية
            </h3>
            <p className="text-xs text-stone-500 font-arabic mt-1">
              قم بتعديل المسميات الرسمية باللغتين العربية والبوسنية.
            </p>
          </div>

          {/* Top Badge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 font-arabic">
                الشريط التعريفي العلوي (عربي)
              </label>
              <input
                type="text"
                value={formData.topBadgeAr}
                onChange={e => setFormData({ ...formData, topBadgeAr: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-right font-arabic focus:bg-white focus:border-stone-900"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 text-left">
                Gornja traka lokacije (Bosanski)
              </label>
              <input
                type="text"
                value={formData.topBadgeBs}
                onChange={e => setFormData({ ...formData, topBadgeBs: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-left focus:bg-white focus:border-stone-900"
                dir="ltr"
              />
            </div>
          </div>

          {/* Org Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 font-arabic">
                اسم الجمعية الرسمي (عربي)
              </label>
              <input
                type="text"
                value={formData.orgNameAr}
                onChange={e => setFormData({ ...formData, orgNameAr: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-right font-arabic focus:bg-white"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 text-left">
                Službeni naziv organizacije (Bosanski)
              </label>
              <input
                type="text"
                value={formData.orgNameBs}
                onChange={e => setFormData({ ...formData, orgNameBs: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-left focus:bg-white"
                dir="ltr"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 font-arabic">
                عنوان الفرع الإقليمي (عربي)
              </label>
              <input
                type="text"
                value={formData.subTitleAr}
                onChange={e => setFormData({ ...formData, subTitleAr: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-right font-arabic focus:bg-white"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 text-left">
                Podnaslov regionalnog ureda (Bosanski)
              </label>
              <input
                type="text"
                value={formData.subTitleBs}
                onChange={e => setFormData({ ...formData, subTitleBs: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-left focus:bg-white"
                dir="ltr"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 font-arabic">
                النص التعريفي الشامل في الهيرو (عربي)
              </label>
              <textarea
                rows={4}
                value={formData.heroDescriptionAr}
                onChange={e => setFormData({ ...formData, heroDescriptionAr: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-right font-arabic focus:bg-white"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 text-left">
                Glavni uvodni tekst na početnoj stranici (Bosanski)
              </label>
              <textarea
                rows={4}
                value={formData.heroDescriptionBs}
                onChange={e => setFormData({ ...formData, heroDescriptionBs: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-left focus:bg-white"
                dir="ltr"
              />
            </div>
          </div>

          {/* Hero Card Image and Caption */}
          <div className="border-t border-stone-100 pt-4 space-y-4">
            <h4 className="text-sm font-bold text-stone-800 font-arabic">
              الصورة البارزة في بطاقة الهيرو (Hero Feature Card)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 font-arabic">
                  وصف الصورة (عربي)
                </label>
                <input
                  type="text"
                  value={formData.heroImageCaptionAr}
                  onChange={e => setFormData({ ...formData, heroImageCaptionAr: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-right font-arabic"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 text-left">
                  Opis slike (Bosanski)
                </label>
                <input
                  type="text"
                  value={formData.heroImageCaptionBs}
                  onChange={e => setFormData({ ...formData, heroImageCaptionBs: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 font-arabic">
                رابط الصورة أو مسارها المحلي • URL ili lokalna slika
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={formData.heroImageUrl || ''}
                  onChange={e => setFormData({ ...formData, heroImageUrl: e.target.value })}
                  placeholder="/mosques/begova.jpg ili https://..."
                  className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-left"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => heroImageInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-stone-300 whitespace-nowrap"
                >
                  <Upload className="w-4 h-4 text-stone-600" />
                  <span>رفع ملف صورة</span>
                </button>
              </div>

              {/* Reliable local image presets */}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-stone-600">
                <span className="font-arabic font-semibold">صور محلية موثوقة:</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, heroImageUrl: '/mosques/begova.jpg' })}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 text-blue-900 font-medium transition-colors"
                >
                  جامع الغازي خسرو بك
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, heroImageUrl: '/mosques/careva.jpg' })}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 text-blue-900 font-medium transition-colors"
                >
                  جامع السلطان (تساريفا)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, heroImageUrl: '/mosques/sarena-travnik.jpg' })}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 text-blue-900 font-medium transition-colors"
                >
                  جامع السليمانية (ترافنيك)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, heroImageUrl: '/mosques/koski-mehmed.jpg' })}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 text-blue-900 font-medium transition-colors"
                >
                  جامع قوشكي محمد باشا (موستار)
                </button>
              </div>
            </div>
            <input
              ref={heroImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleHeroImageFileChange}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>حفظ نصوص الهيرو</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* 3. NOBLE QURANIC VERSE BANNER                             */}
      {/* ========================================================= */}
      {activeSection === 'verse' && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-right">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-base font-bold text-stone-900 font-arabic">
              الآية القرآنية الكريمة في الواجهة
            </h3>
            <p className="text-xs text-stone-500 font-arabic mt-1">
              الآية الكريمة المعروضة بأعلى الصفحة الرئيسية (سورة آل عمران، الآية 104) مع ترجمتها باللغة البوسنية.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <input
              type="checkbox"
              id="showQuranVerse"
              checked={formData.showQuranVerse}
              onChange={e => setFormData({ ...formData, showQuranVerse: e.target.checked })}
              className="w-4 h-4 accent-emerald-700 rounded"
            />
            <label htmlFor="showQuranVerse" className="text-xs font-bold text-stone-800 font-arabic cursor-pointer">
              إظهار بطاقة الآية القرآنية الكريمة في أعلى الصفحة الرئيسية
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 font-arabic">
              نص الآية القرآنية الكريمة (بالرسم العثماني)
            </label>
            <textarea
              rows={3}
              value={formData.quranVerseAr}
              onChange={e => setFormData({ ...formData, quranVerseAr: e.target.value })}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-bold text-right font-arabic leading-relaxed focus:bg-white"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 text-left">
              Prijevod ajeta na bosanski jezik
            </label>
            <textarea
              rows={3}
              value={formData.quranVerseBs}
              onChange={e => setFormData({ ...formData, quranVerseBs: e.target.value })}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-left leading-relaxed focus:bg-white"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 font-arabic">
                التوثيق والسورة (عربي)
              </label>
              <input
                type="text"
                value={formData.quranCitationAr}
                onChange={e => setFormData({ ...formData, quranCitationAr: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-right font-arabic"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 text-left">
                Referenca sure i ajeta (Bosanski)
              </label>
              <input
                type="text"
                value={formData.quranCitationBs}
                onChange={e => setFormData({ ...formData, quranCitationBs: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>حفظ إعدادات الآية الكريمة</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* 4. HERO STATS & PILLARS                                   */}
      {/* ========================================================= */}
      {activeSection === 'stats' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-right">
          <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handleAddStat}
              className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-xl text-xs font-bold font-arabic transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة بطاقة إحصائية جديدة</span>
            </button>

            <div>
              <h3 className="text-base font-bold text-stone-900 font-arabic">
                إحصائيات وأرقام الهيرو الرئيسية
              </h3>
              <p className="text-xs text-stone-500 font-arabic mt-0.5">
                يمكنك تخصيص الأرقام، النصوص، إضافة بطاقات جديدة، أو حذف أي بطاقة.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {formData.stats.map((stat, idx) => (
              <div key={stat.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-stone-600 mb-1 font-arabic">
                    الرقم / القيمة (Value)
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={e => handleUpdateStat(stat.id, 'value', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-sm font-bold text-stone-900 text-center font-mono"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-stone-600 mb-1 font-arabic">
                    الوصف (عربي)
                  </label>
                  <input
                    type="text"
                    value={stat.labelAr}
                    onChange={e => handleUpdateStat(stat.id, 'labelAr', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-right font-arabic"
                    dir="rtl"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-stone-600 mb-1 text-left">
                    Opis (Bosanski)
                  </label>
                  <input
                    type="text"
                    value={stat.labelBs}
                    onChange={e => handleUpdateStat(stat.id, 'labelBs', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-left"
                    dir="ltr"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-center pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(stat.id)}
                    className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف هذه الإحصائية"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}

            {formData.stats.length === 0 && (
              <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
                لا توجد إحصائيات معروضة حالياً. انقر على &quot;إضافة بطاقة إحصائية جديدة&quot; للبدء.
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>حفظ الإحصائيات</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. CONTACT & OFFICE INFO                                  */}
      {/* ========================================================= */}
      {activeSection === 'contact' && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-right">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-base font-bold text-stone-900 font-arabic">
              بيانات الاتصال ومقر فرع سراييفو
            </h3>
            <p className="text-xs text-stone-500 font-arabic mt-1">
              العنوان، الهواتف، البريد الإلكتروني، وساعات الدوام المعروضة في قسم &quot;اتصل بنا&quot;.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 font-arabic">
                العنوان الرسمي لمقر سراييفو (عربي)
              </label>
              <input
                type="text"
                value={formData.contactAddressAr}
                onChange={e => setFormData({ ...formData, contactAddressAr: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-right font-arabic"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 text-left">
                Službena adresa ureda u Sarajevu (Bosanski)
              </label>
              <input
                type="text"
                value={formData.contactAddressBs}
                onChange={e => setFormData({ ...formData, contactAddressBs: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 font-arabic">
                رقم الهاتف للتواصل
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-left"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 font-arabic">
                البريد الإلكتروني الرسمي
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 font-arabic">
                أوقات العمل أيام الأسبوع
              </label>
              <input
                type="text"
                value={formData.workingHoursWeekdays}
                onChange={e => setFormData({ ...formData, workingHoursWeekdays: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 font-arabic">
                عطلة نهاية الأسبوع (عربي)
              </label>
              <input
                type="text"
                value={formData.workingHoursWeekendsAr}
                onChange={e => setFormData({ ...formData, workingHoursWeekendsAr: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-right font-arabic"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 text-left">
                Vikend (Bosanski)
              </label>
              <input
                type="text"
                value={formData.workingHoursWeekendsBs}
                onChange={e => setFormData({ ...formData, workingHoursWeekendsBs: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>حفظ بيانات الاتصال</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
