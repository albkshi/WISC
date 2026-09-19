import React from 'react';
import { RegionalActivity } from '@/lib/types';
import { Languages, Save, X, Globe, MapPin, Calendar, Check, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { compressImageFile } from '@/lib/image-utils';

interface ActivityModalProps {
  activityToEdit?: RegionalActivity | null;
  onSave: (activity: RegionalActivity) => void;
  onClose: () => void;
}

const LOCATIONS = [
  'Sarajevo (سراييفو)',
  'Mostar (موستار)',
  'Tuzla (توزلا)',
  'Zenica (زينيتسا)',
  'Bihać (بيهاج)',
  'Travnik (ترافنيك)',
  'Srebrenica (سريبرينيتسا)',
  'Banja Luka (بانيا لوكا)',
];

export default function ActivityModal({
  activityToEdit,
  onSave,
  onClose,
}: ActivityModalProps) {
  const [titleAr, setTitleAr] = React.useState(activityToEdit?.titleAr || '');
  const [titleBs, setTitleBs] = React.useState(activityToEdit?.titleBs || '');
  const [date, setDate] = React.useState(
    activityToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [location, setLocation] = React.useState(activityToEdit?.location || 'Sarajevo');
  const [category, setCategory] = React.useState<RegionalActivity['category']>(
    activityToEdit?.category || 'humanitarian'
  );
  const [summaryAr, setSummaryAr] = React.useState(activityToEdit?.summaryAr || '');
  const [summaryBs, setSummaryBs] = React.useState(activityToEdit?.summaryBs || '');
  const [detailsAr, setDetailsAr] = React.useState(activityToEdit?.detailsAr || '');
  const [detailsBs, setDetailsBs] = React.useState(activityToEdit?.detailsBs || '');
  const [partnerOrganization, setPartnerOrganization] = React.useState(
    activityToEdit?.partnerOrganization || ''
  );
  const [imageUrl, setImageUrl] = React.useState(
    activityToEdit?.imageUrl || '/images/diplomatic-meeting.jpg'
  );
  const [published, setPublished] = React.useState(activityToEdit?.published ?? true);

  const [isTranslating, setIsTranslating] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const processed = await compressImageFile(file, 1200, 0.82);
      setImageUrl(processed.dataUrl);
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleTranslateAll = async () => {
    if (!titleAr.trim() && !summaryAr.trim()) return;
    setIsTranslating(true);
    try {
      if (titleAr.trim()) {
        const resTitle = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: titleAr, mode: 'title', sourceLang: 'ar', targetLang: 'bs' }),
        });
        const dataTitle = await resTitle.json();
        if (dataTitle.translation) setTitleBs(dataTitle.translation);
      }

      if (summaryAr.trim()) {
        const resSummary = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: summaryAr, mode: 'general', sourceLang: 'ar', targetLang: 'bs' }),
        });
        const dataSummary = await resSummary.json();
        if (dataSummary.translation) setSummaryBs(dataSummary.translation);
      }

      if (detailsAr.trim()) {
        const resDetails = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: detailsAr, mode: 'general', sourceLang: 'ar', targetLang: 'bs' }),
        });
        const dataDetails = await resDetails.json();
        if (dataDetails.translation) setDetailsBs(dataDetails.translation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = () => {
    if (!titleAr.trim() && !titleBs.trim()) return;

    const newActivity: RegionalActivity = {
      id: activityToEdit?.id || `act-${Date.now()}`,
      titleAr: titleAr || titleBs,
      titleBs: titleBs || titleAr,
      date,
      location,
      category,
      summaryAr,
      summaryBs,
      detailsAr,
      detailsBs,
      imageUrl,
      partnerOrganization,
      published,
      createdAt: activityToEdit?.createdAt || new Date().toISOString(),
    };

    onSave(newActivity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center text-emerald-200">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold bg-emerald-700 text-emerald-100 px-2.5 py-0.5 rounded-full">
                أخبار وأنشطة إقليم البلقان
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 font-arabic">
                إضافة خبر أو نشاط إقليمي للجمعية • Unos regionalne aktivnosti
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                المدينة / المنطقة • Lokacija
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:bg-white focus:outline-emerald-600"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc.split(' ')[0]}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                التاريخ • Datum
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                التصنيف • Kategorija
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RegionalActivity['category'])}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:bg-white focus:outline-emerald-600 font-arabic"
              >
                <option value="diplomatic">علاقات دبلوماسية وحكومية (Diplomatija)</option>
                <option value="humanitarian">مساعدات وإغاثة إنسانية (Humanitarni rad)</option>
                <option value="cultural">برامج ثقافية وتعليمية (Kulturno-obrazovni)</option>
                <option value="dialogue">حوار الثقافات والتعايش (Dijalog i suživot)</option>
                <option value="educational">مراكز تحفيظ ولغة عربية (Arapski jezik)</option>
              </select>
            </div>
          </div>

          {/* Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-950 mb-1 font-arabic text-right">
                عنوان الخبر / النشاط (بالعربية) *
              </label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: انطلاق مشروع دعم مراكز اللغة العربية في سراييفو..."
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-arabic font-bold text-stone-900 focus:outline-emerald-600 text-right"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-950 mb-1 text-left">
                Naslov vijesti / aktivnosti (Bosanski)
              </label>
              <input
                type="text"
                value={titleBs}
                onChange={(e) => setTitleBs(e.target.value)}
                placeholder="Npr: Pokretanje projekta podrške centrima za arapski jezik u Sarajevu"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-bold text-stone-900 focus:outline-emerald-600 text-left"
              />
            </div>
          </div>

          {/* Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-arabic text-right">
                الملخص التنفيذي (بالعربية)
              </label>
              <textarea
                value={summaryAr}
                onChange={(e) => setSummaryAr(e.target.value)}
                rows={3}
                placeholder="ملخص موجز لنشاط الجمعية في البوسنة..."
                className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs font-arabic leading-relaxed text-stone-900 focus:outline-emerald-600 text-right"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 text-left">
                Kratak sažetak (Bosanski)
              </label>
              <textarea
                value={summaryBs}
                onChange={(e) => setSummaryBs(e.target.value)}
                rows={3}
                placeholder="Kratak pregled aktivnosti za objavu na portalu..."
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs leading-relaxed text-stone-900 focus:bg-white focus:outline-emerald-600 text-left"
              />
            </div>
          </div>

          {/* Detailed Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-arabic text-right">
                التفاصيل الكاملة للنشاط (بالعربية)
              </label>
              <textarea
                value={detailsAr}
                onChange={(e) => setDetailsAr(e.target.value)}
                rows={4}
                placeholder="أهداف المشروع، الشركاء، المستفيدين، والتوصيات..."
                className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs font-arabic leading-relaxed text-stone-900 focus:outline-emerald-600 text-right"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 text-left">
                Detaljan opis aktivnosti (Bosanski)
              </label>
              <textarea
                value={detailsBs}
                onChange={(e) => setDetailsBs(e.target.value)}
                rows={4}
                placeholder="Ciljevi, partneri i rezultati projekta..."
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs leading-relaxed text-stone-900 focus:bg-white focus:outline-emerald-600 text-left"
              />
            </div>
          </div>

          {/* Auto Translate Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleTranslateAll}
              disabled={isTranslating || (!titleAr.trim() && !summaryAr.trim())}
              className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري الترجمة للبوسنية...</span>
                </>
              ) : (
                <>
                  <Languages className="w-3.5 h-3.5" />
                  <span>ترجمة المحتوى آلياً إلى البوسنية (Auto Translate to Bosnian)</span>
                </>
              )}
            </button>
          </div>

          {/* Partner & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                الجهة الشريكة / الشريك المحلي في البوسنة
              </label>
              <input
                type="text"
                value={partnerOrganization}
                onChange={(e) => setPartnerOrganization(e.target.value)}
                placeholder="مثال: جامعة سراييفو / المشيخة الإسلامية"
                className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-xs text-stone-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                صورة الخبر أو النشاط • Slika aktivnosti
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... أو مسار الصورة"
                    className="flex-1 bg-white border border-stone-300 rounded-md px-3 py-1.5 text-xs text-stone-900 focus:outline-emerald-600"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors"
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>جاري المعالجة...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>رفع صورة</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileUpload}
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-600">
                  <span className="font-semibold text-stone-700">نماذج جاهزة:</span>
                  <button
                    type="button"
                    onClick={() => setImageUrl('/images/diplomatic-meeting.jpg')}
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded text-stone-800 transition-colors"
                  >
                    لقاء رسمي
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('/images/humanitarian-aid.jpg')}
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded text-stone-800 transition-colors"
                  >
                    مساعدات إنسانية
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('/images/cultural-dialogue.jpg')}
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded text-stone-800 transition-colors"
                  >
                    حوار وتسامح
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('/mosques/begova.jpg')}
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded text-stone-800 transition-colors"
                  >
                    جامع الغازي خسرو بك
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('/mosques/careva.jpg')}
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded text-stone-800 transition-colors"
                  >
                    الجامع الإمبراطوري
                  </button>
                </div>

                {/* Preview */}
                {imageUrl && (
                  <div className="flex items-center gap-3 p-2 bg-stone-50 border border-stone-200 rounded-lg">
                    <div className="relative w-16 h-12 rounded overflow-hidden bg-stone-200 border border-stone-300 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>معاينة الصورة المعتمدة للخبر</span>
                      </div>
                      <p className="text-[10px] text-stone-500 truncate" dir="ltr">
                        {imageUrl.startsWith('data:') ? 'صورة مرفوعة (Base64 محلي ومحفوظة في فايربيس)' : imageUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-4 sm:px-6 py-3.5 border-t border-stone-200 flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 accent-emerald-700"
            />
            <span className="font-semibold text-stone-800">نشر في لوحة الأخبار الرسمية</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-lg font-semibold transition-all"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>حفظ ونشر الخبر</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
