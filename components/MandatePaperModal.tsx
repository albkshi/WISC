import React from 'react';
import { OfficeDocument, AppSettings } from '@/lib/types';
import { Printer, X, Award, CheckCircle2, ShieldCheck, FileCheck, Copy, ExternalLink } from 'lucide-react';

interface MandatePaperModalProps {
  document: OfficeDocument;
  settings: AppSettings;
  onClose: () => void;
  onPrint: () => void;
}

export default function MandatePaperModal({
  document,
  settings,
  onClose,
  onPrint,
}: MandatePaperModalProps) {
  const [activeTab, setActiveTab] = React.useState<'both' | 'arabic' | 'bosnian'>('both');
  const [copied, setCopied] = React.useState(false);

  const handleCopyText = () => {
    navigator.clipboard.writeText(`${document.titleAr}\n\n${document.contentAr}\n\n---\n\n${document.titleBs}\n\n${document.contentBs}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  قرار التكليف الرسمي رقم {document.refNumber}
                </span>
                <span className="text-xs text-emerald-300">
                  {document.dateGregorian} ({document.dateHijri})
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1 font-arabic">
                وثيقة التفويض القانوني لفتح فرع سراييفو
              </h2>
              <p className="text-xs text-stone-300">
                Službena odluka o ovlaštenju za otvaranje ureda u Bosni i Hercegovini
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة رسمية (A4 Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legal Mandate Highlights */}
        <div className="bg-amber-50/80 border-b border-amber-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-950 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>
              <strong>المفوض المعتمد:</strong> {settings.directorNameAr} ({settings.directorNameBs})
            </span>
          </div>
          <div className="flex items-center gap-2 text-amber-950 font-medium">
            <FileCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>
              <strong>الموقع والممثل القانوني:</strong> أ.د. صالح سليم الفاخري (Tripoli Headquarters)
            </span>
          </div>
        </div>

        {/* View Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-stone-200 flex items-center justify-between">
          <div className="flex gap-1 bg-stone-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'both' ? 'bg-white shadow-xs text-emerald-950 font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              عرض ثنائي (عربي وبوسني متطابق)
            </button>
            <button
              onClick={() => setActiveTab('arabic')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'arabic' ? 'bg-white shadow-xs text-emerald-950 font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              النص العربي الأصلي
            </button>
            <button
              onClick={() => setActiveTab('bosnian')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'bosnian' ? 'bg-white shadow-xs text-emerald-950 font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Prijevod na bosanski (Sudski tumač)
            </button>
          </div>

          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-emerald-800 font-medium transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'تم النسخ بنجاح!' : 'نسخ النص'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Powers Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
            <h4 className="font-bold text-sm text-emerald-950 font-arabic flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              الصلاحيات القانونية الممنوحة للمفوض بموجب هذا القرار:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-emerald-900">
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                <strong className="block text-emerald-950 font-bold mb-1">1. التسجيل والافتتاح</strong>
                إتخاذ كافة الإجراءات الإدارية والقانونية والمالية اللازمة لإتمام التسجيل وفق قوانين البوسنة والهرسك.
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                <strong className="block text-emerald-950 font-bold mb-1">2. توكيل المحامين والمستشارين</strong>
                الاستعانة بالمكاتب القانونية والمحامين المعتمدين والمستشارين المحليين للتوثيقات الرسمية.
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                <strong className="block text-emerald-950 font-bold mb-1">3. التمثيل أمام الحكومة</strong>
                تمثيل الجمعية أمام كافة الوزارات والمؤسسات الرسمية ذات الصلة في جمهورية البوسنة والهرسك.
              </div>
            </div>
          </div>

          {/* Document Content Display */}
          <div className={`grid gap-6 ${activeTab === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            
            {/* Arabic Original */}
            {(activeTab === 'both' || activeTab === 'arabic') && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-right font-arabic" dir="rtl">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4 font-sans">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/60 px-2.5 py-1 rounded-md">
                    النص العربي المعتمد (الوثيقة المرفقة)
                  </span>
                  <span className="text-xs text-stone-500 font-mono">الرقم: {document.refNumber}</span>
                </div>

                <div className="text-xs text-stone-600 mb-2">
                  السيد / مصطفى محمود البكشي المحترم<br />
                  تحية طيبة وبعد،،
                </div>

                <h3 className="font-bold text-sm text-stone-900 mb-4 text-emerald-950">
                  {document.titleAr}
                </h3>

                <div className="text-xs sm:text-sm text-stone-800 leading-loose whitespace-pre-line text-justify">
                  {document.contentAr}
                </div>

                <div className="mt-8 pt-4 border-t border-stone-200 flex justify-between items-end text-xs">
                  <div>
                    <span className="text-stone-500 block">التاريخ: 2026/9/3 م (20 ربيع الأول 1448 هـ)</span>
                  </div>
                  <div className="text-left font-sans">
                    <span className="block font-bold text-stone-900">الممثل القانوني لجمعية</span>
                    <span className="block font-bold text-emerald-950">الدعوة الإسلامية العالمية</span>
                    <span className="block text-emerald-800 font-semibold mt-1">أ.د. صالح سليم الفاخري</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bosnian Translation */}
            {(activeTab === 'both' || activeTab === 'bosnian') && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-left font-sans">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/60 px-2.5 py-1 rounded-md">
                    Službeni prijevod (Sudski tumač za arapski)
                  </span>
                  <span className="text-xs text-stone-500 font-mono">Broj: {document.refNumber}</span>
                </div>

                <div className="text-xs text-stone-600 mb-2">
                  Poštovani g. Mustafa Mahmoud Al-Bakshi<br />
                  S poštovanjem,
                </div>

                <h3 className="font-bold text-sm text-stone-900 mb-4 text-emerald-950">
                  {document.titleBs}
                </h3>

                <div className="text-xs sm:text-sm text-stone-800 leading-relaxed space-y-2 whitespace-pre-line text-justify">
                  {document.contentBs}
                </div>

                <div className="mt-8 pt-4 border-t border-stone-200 flex justify-between items-end text-xs">
                  <div>
                    <span className="text-stone-500 block">Datum: 03.09.2026. godine</span>
                  </div>
                  <div>
                    <span className="block font-bold text-stone-900">Pravni zastupnik Svjetske organizacije</span>
                    <span className="block font-bold text-emerald-950">World Islamic Call Society</span>
                    <span className="block text-emerald-800 font-semibold mt-1">Prof. dr. Saleh Salim Al-Fakhri</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-6 py-3.5 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <span>
            جمعية الدعوة الإسلامية العالمية • طرابلس | فرع سراييفو • البوسنة والهرسك
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onPrint}
              className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              طباعة هذا القرار لتقديمه للجهات الحكومية
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
