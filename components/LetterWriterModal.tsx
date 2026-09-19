import React from 'react';
import { OfficeDocument, DocumentCategory, DocumentStatus, AppSettings } from '@/lib/types';
import { Sparkles, Languages, Printer, Save, X, Building, AlertCircle, Check, Loader2, ArrowRightLeft } from 'lucide-react';

interface LetterWriterModalProps {
  documentToEdit?: OfficeDocument | null;
  settings: AppSettings;
  onSave: (doc: OfficeDocument) => void;
  onClose: () => void;
  onPrintAfterSave?: (doc: OfficeDocument) => void;
}

const GOVERNMENT_PRESETS = [
  {
    orgName: 'Ministarstvo pravde Bosne i Hercegovine',
    titleAr: 'وزارة العدل في البوسنة والهرسك',
    recipientAr: 'معالي وزير العدل في البوسنة والهرسك المحترم - سراييفو',
    recipientBs: 'Ministarstvo pravde Bosne i Hercegovine, Odjel za upravu, Sarajevo',
    category: 'ministry_application' as DocumentCategory,
    defaultTopicAr: 'طلب تسجيل فرع منظمة أجنبية غير حكومية في البوسنة والهرسك',
  },
  {
    orgName: 'Porezna uprava Federacije BiH',
    titleAr: 'مصلحة الضرائب الفيدرالية - كانتون سراييفو',
    recipientAr: 'السادة إدارة الضرائب في كانتون سراييفو المحترمين',
    recipientBs: 'Porezna uprava FBiH - Kantonalni porezni ured Sarajevo',
    category: 'government_letter' as DocumentCategory,
    defaultTopicAr: 'طلب فتح الملف الضريبي واستخراج الرقم التعريفي (JIB) للفرع',
  },
  {
    orgName: 'Ministarstvo civilnih poslova BiH',
    titleAr: 'وزارة الشؤون المدنية في البوسنة والهرسك',
    recipientAr: 'وزارة الشؤون المدنية - قطاع التعاون الدولي والتنمية الثقافية',
    recipientBs: 'Ministarstvo civilnih poslova BiH, Sektor za međunarodnu saradnju',
    category: 'government_letter' as DocumentCategory,
    defaultTopicAr: 'إشعار ببدء الأنشطة الإنسانية والثقافية لجمعية الدعوة الإسلامية العالمية',
  },
  {
    orgName: 'Općina Stari Grad Sarajevo',
    titleAr: 'بلدية ستاري غراد / مدينة سراييفو',
    recipientAr: 'السيد رئيس بلدية ستاري غراد - سراييفو المحترم',
    recipientBs: 'Općina Stari Grad Sarajevo, Služba za opću upravu',
    category: 'government_letter' as DocumentCategory,
    defaultTopicAr: 'إخطار بمقر المكتب التابع للجمعية والتنسيق للأنشطة المشتركة',
  },
  {
    orgName: 'Notarski ured Sarajevo',
    titleAr: 'مكتب كاتب العدل (النوتر) في سراييفو',
    recipientAr: 'حضرة كاتب العدل المعتمد في سراييفو المحترم',
    recipientBs: 'Notarski ured, Kanton Sarajevo',
    category: 'legal_notary' as DocumentCategory,
    defaultTopicAr: 'طلب توثيق قرار التكليف وتصديق نماذج التوقيع والمستندات التأسيسية',
  },
  {
    orgName: 'Banka (BBI / Ziraat Bank)',
    titleAr: 'المصرف التجاري في سراييفو (فتح حساب)',
    recipientAr: 'إدارة العمليات المصرفية وفتح الحسابات - سراييفو',
    recipientBs: 'BBI Bank d.d. Sarajevo / Odjel za pravna lica',
    category: 'finance_invoice' as DocumentCategory,
    defaultTopicAr: 'طلب فتح حساب تشغيلي رسمي بالمارك البوسني (BAM) والعملات الأجنبية',
  },
];

export default function LetterWriterModal({
  documentToEdit,
  settings,
  onSave,
  onClose,
  onPrintAfterSave,
}: LetterWriterModalProps) {
  const [refNumber, setRefNumber] = React.useState(
    documentToEdit?.refNumber || 'WICS-SJJ/2026-105'
  );
  const [titleAr, setTitleAr] = React.useState(documentToEdit?.titleAr || '');
  const [titleBs, setTitleBs] = React.useState(documentToEdit?.titleBs || '');
  const [recipientAr, setRecipientAr] = React.useState(documentToEdit?.recipientAr || '');
  const [recipientBs, setRecipientBs] = React.useState(documentToEdit?.recipientBs || '');
  const [recipientOrg, setRecipientOrg] = React.useState(documentToEdit?.recipientOrg || 'Ministarstvo pravde BiH');
  const [contentAr, setContentAr] = React.useState(documentToEdit?.contentAr || '');
  const [contentBs, setContentBs] = React.useState(documentToEdit?.contentBs || '');
  const [category, setCategory] = React.useState<DocumentCategory>(documentToEdit?.category || 'government_letter');
  const [status, setStatus] = React.useState<DocumentStatus>(documentToEdit?.status || 'draft');
  const [dateGregorian, setDateGregorian] = React.useState(
    documentToEdit?.dateGregorian || new Date().toISOString().split('T')[0]
  );
  const [dateHijri, setDateHijri] = React.useState(
    documentToEdit?.dateHijri || 'ربيع الأول 1448 هـ'
  );

  const [isTranslating, setIsTranslating] = React.useState(false);
  const [isDrafting, setIsDrafting] = React.useState(false);
  const [aiDraftPrompt, setAiDraftPrompt] = React.useState('');
  const [showAiDraftPanel, setShowAiDraftPanel] = React.useState(false);
  const [translationSuccess, setTranslationSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Apply a Government Preset
  const handleSelectPreset = (preset: typeof GOVERNMENT_PRESETS[0]) => {
    setRecipientOrg(preset.orgName);
    setRecipientAr(preset.recipientAr);
    setRecipientBs(preset.recipientBs);
    setCategory(preset.category);
    if (!titleAr) {
      setTitleAr(preset.defaultTopicAr);
    }
  };

  // Translate Arabic content to Bosnian via server Gemini
  const handleTranslateContent = async () => {
    if (!contentAr.trim()) {
      setErrorMessage('يرجى كتابة نص باللغة العربية أولاً لترجمته');
      return;
    }
    setIsTranslating(true);
    setErrorMessage(null);
    try {
      // Translate body
      const resContent = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: contentAr,
          mode: 'letter',
          sourceLang: 'ar',
          targetLang: 'bs',
        }),
      });
      const dataContent = await resContent.json();
      if (dataContent.translation) {
        setContentBs(dataContent.translation);
      }

      // Translate title if titleAr exists and titleBs is empty
      if (titleAr.trim() && (!titleBs || titleBs.trim() === '')) {
        const resTitle = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: titleAr,
            mode: 'title',
            sourceLang: 'ar',
            targetLang: 'bs',
          }),
        });
        const dataTitle = await resTitle.json();
        if (dataTitle.translation) {
          setTitleBs(dataTitle.translation);
        }
      }

      setTranslationSuccess(true);
      setTimeout(() => setTranslationSuccess(false), 3000);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('تعذر الاتصال بخدمة الترجمة الآلية، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Draft full letter using AI prompt
  const handleGenerateDraft = async () => {
    if (!aiDraftPrompt.trim() && !titleAr.trim()) {
      setErrorMessage('يرجى إدخال ملخص أو موضوع الكتاب ليتولى المساعد الذكي صياغته');
      return;
    }
    setIsDrafting(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/draft-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicAr: aiDraftPrompt.trim() || titleAr.trim(),
          recipientOrg,
          recipientPerson: recipientBs,
          directorName: settings.directorNameAr,
          refNumber,
        }),
      });
      const data = await res.json();
      if (data.draft) {
        if (data.draft.titleAr) setTitleAr(data.draft.titleAr);
        if (data.draft.titleBs) setTitleBs(data.draft.titleBs);
        if (data.draft.recipientAr) setRecipientAr(data.draft.recipientAr);
        if (data.draft.recipientBs) setRecipientBs(data.draft.recipientBs);
        if (data.draft.contentAr) setContentAr(data.draft.contentAr);
        if (data.draft.contentBs) setContentBs(data.draft.contentBs);
        setShowAiDraftPanel(false);
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('حدث خطأ أثناء صياغة الخطاب، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSaveDocument = (shouldPrint: boolean = false) => {
    if (!titleAr.trim() && !titleBs.trim()) {
      setErrorMessage('يرجى إدخال عنوان أو موضوع المستند');
      return;
    }

    const doc: OfficeDocument = {
      id: documentToEdit?.id || `doc-${Date.now()}`,
      refNumber,
      titleAr: titleAr || titleBs,
      titleBs: titleBs || titleAr,
      category,
      recipientAr,
      recipientBs,
      recipientOrg,
      contentAr,
      contentBs,
      dateGregorian,
      dateHijri,
      status: contentBs.trim() ? 'translated' : status,
      authorizedSignatoryAr: settings.directorNameAr,
      authorizedSignatoryBs: settings.directorNameBs,
      createdAt: documentToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(doc);
    if (shouldPrint && onPrintAfterSave) {
      onPrintAfterSave(doc);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
          <div>
            <span className="text-xs font-mono font-bold bg-emerald-700/60 text-emerald-300 px-2.5 py-0.5 rounded-full">
              {documentToEdit ? 'تعديل كتاب رسمي' : 'إنشاء كتاب رسمي للحكومة البوسنية'}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1 font-arabic flex items-center gap-2">
              <span>محرر المراسلات الحكومية والترجمة المعتمدة</span>
              <Languages className="w-5 h-5 text-emerald-400" />
            </h2>
            <p className="text-xs text-stone-300">
              اكتب بالعربية وسيتم توليد الصيغة البوسنية الرسمية المطابقة للوائح الوزارات في سراييفو
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAiDraftPanel(!showAiDraftPanel)}
              className="flex items-center gap-1.5 bg-amber-600/90 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>صياغة ذكية بالذكاء الاصطناعي</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Drafting Drawer */}
        {showAiDraftPanel && (
          <div className="bg-amber-50 border-b border-amber-200 p-4 animate-in fade-in duration-200">
            <div className="max-w-4xl mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-950 font-arabic flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  مساعد الصياغة الذكية لرسائل الحكومة البوسنية
                </h4>
                <span className="text-[11px] text-amber-800">
                  اكتب فكرتك باختصار وسيتولى المساعد صياغة الخطاب بالعربية والبوسنية الرسمية
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiDraftPrompt}
                  onChange={(e) => setAiDraftPrompt(e.target.value)}
                  placeholder="مثال: كتاب لوزارة العدل لطلب تسجيل فرع الجمعية وإيداع وثيقة التكليف وتسمية مصطفى البكشي مديراً..."
                  className="flex-1 bg-white border border-amber-300 rounded-lg px-3.5 py-2 text-xs font-arabic text-stone-900 focus:outline-emerald-600"
                  dir="rtl"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateDraft()}
                />
                <button
                  onClick={handleGenerateDraft}
                  disabled={isDrafting}
                  className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg text-xs font-bold font-arabic flex items-center gap-1.5 disabled:opacity-50 transition-all flex-shrink-0"
                >
                  {isDrafting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الصياغة...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>توليد الخطاب الآن</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Presets Bar */}
        <div className="bg-stone-50 border-b border-stone-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-stone-500 font-semibold flex items-center gap-1 flex-shrink-0">
            <Building className="w-3.5 h-3.5 text-emerald-800" />
            نماذج الجهات الحكومية:
          </span>
          {GOVERNMENT_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all whitespace-nowrap ${
                recipientOrg === preset.orgName
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              {preset.titleAr}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                الرقم الإشاري • Broj protokola
              </label>
              <input
                type="text"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-emerald-950 focus:bg-white focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                التاريخ الميلادي • Datum
              </label>
              <input
                type="date"
                value={dateGregorian}
                onChange={(e) => setDateGregorian(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:bg-white focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-arabic">
                التاريخ الهجري
              </label>
              <input
                type="text"
                value={dateHijri}
                onChange={(e) => setDateHijri(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-arabic text-stone-900 focus:bg-white focus:outline-emerald-600"
                dir="rtl"
              />
            </div>
          </div>

          {/* Recipients Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50/70 p-3.5 rounded-xl border border-stone-200">
            {/* Arabic Recipient */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-arabic text-right">
                الجهة الموجه إليها (بالعربية)
              </label>
              <input
                type="text"
                value={recipientAr}
                onChange={(e) => setRecipientAr(e.target.value)}
                placeholder="مثال: معالي وزير العدل في البوسنة والهرسك المحترم"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-arabic text-stone-900 focus:outline-emerald-600 text-right"
                dir="rtl"
              />
            </div>

            {/* Bosnian Recipient */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 text-left">
                Primalac / Naziv institucije (Bosanski)
              </label>
              <input
                type="text"
                value={recipientBs}
                onChange={(e) => setRecipientBs(e.target.value)}
                placeholder="Npr: Ministarstvo pravde Bosne i Hercegovine, Trg BiH 1"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-emerald-600 text-left"
              />
            </div>
          </div>

          {/* Subjects / Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-950 mb-1 font-arabic text-right">
                موضوع الخطاب (بالعربية) *
              </label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: طلب قيد وتسجيل فرع الجمعية في سجل المنظمات الأجنبية..."
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-arabic font-bold text-stone-900 focus:outline-emerald-600 text-right"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-950 mb-1 text-left">
                PREDMET DOPISA (Bosanski jezik)
              </label>
              <input
                type="text"
                value={titleBs}
                onChange={(e) => setTitleBs(e.target.value)}
                placeholder="Npr: Zahtjev za upis u registar predstavništava stranih nevladinih organizacija"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-bold text-stone-900 focus:outline-emerald-600 text-left"
              />
            </div>
          </div>

          {/* Side-by-Side Content Editors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Arabic Editor (Source) */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-emerald-900 font-arabic flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  نص الكتاب بالعربية (اكتب هنا بحرية)
                </span>
                <span className="text-[11px] text-stone-500 font-arabic">
                  {contentAr.length} حرف
                </span>
              </div>
              <textarea
                value={contentAr}
                onChange={(e) => setContentAr(e.target.value)}
                rows={12}
                placeholder="اكتب تفاصيل الكتاب أو الطلب الموجه للجهة الحكومية هنا بالعربية..."
                className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs sm:text-sm font-arabic leading-relaxed text-stone-900 focus:outline-emerald-600 text-right resize-none"
                dir="rtl"
              />
            </div>

            {/* Bosnian Editor (Target) */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Službeni tekst na bosanskom jeziku (Za predaju u pisarnicu)
                </span>
                {translationSuccess && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    تمت الترجمة بنجاح!
                  </span>
                )}
              </div>
              <textarea
                value={contentBs}
                onChange={(e) => setContentBs(e.target.value)}
                rows={12}
                placeholder="Ovdje će se automatski pojaviti prijevod na službeni bosanski jezik s pravnim terminima..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs sm:text-sm leading-relaxed text-stone-900 focus:bg-white focus:outline-emerald-600 text-left resize-none"
              />
            </div>

          </div>

          {/* Action to translate */}
          <div className="flex justify-center my-1">
            <button
              onClick={handleTranslateContent}
              disabled={isTranslating || !contentAr.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-800 to-teal-700 hover:from-emerald-700 hover:to-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الترجمة القانونية إلى البوسنية...</span>
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4" />
                  <span>ترجمة فورية إلى البوسنية الرسمية (Translate to Bosnian)</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-stone-100 px-4 sm:px-6 py-3.5 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-500 font-arabic">
            المفوض المعتمد للتوقيع: <strong className="text-stone-800">{settings.directorNameAr}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveDocument(false)}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>حفظ في الأرشيف فقط</span>
            </button>

            <button
              onClick={() => handleSaveDocument(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>حفظ وطباعة رسمية (Save & Print A4)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
