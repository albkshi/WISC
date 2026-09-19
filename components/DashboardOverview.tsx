import React from 'react';
import { OfficeDocument, FinanceInvoice, RegionalActivity, SetupMilestone, AppSettings } from '@/lib/types';
import { 
  FileText, 
  Receipt, 
  Globe, 
  Award, 
  Printer, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Building,
  ShieldCheck
} from 'lucide-react';

interface DashboardOverviewProps {
  documents: OfficeDocument[];
  invoices: FinanceInvoice[];
  activities: RegionalActivity[];
  milestones: SetupMilestone[];
  settings: AppSettings;
  onOpenMandateModal: () => void;
  onOpenNewLetter: () => void;
  onOpenNewInvoice: () => void;
  onViewDocument: (doc: OfficeDocument) => void;
  onPrintDocument: (doc: OfficeDocument) => void;
  onViewInvoice: (inv: FinanceInvoice) => void;
  onPrintInvoice: (inv: FinanceInvoice) => void;
  onNavigateTab: (tab: 'letters' | 'finances' | 'archive' | 'activities') => void;
}

export default function DashboardOverview({
  documents,
  invoices,
  activities,
  milestones,
  settings,
  onOpenMandateModal,
  onOpenNewLetter,
  onOpenNewInvoice,
  onViewDocument,
  onPrintDocument,
  onViewInvoice,
  onPrintInvoice,
  onNavigateTab,
}: DashboardOverviewProps) {
  // Financial metrics
  const totalBAM = invoices.reduce((acc, inv) => {
    // Standard conversion: 1 EUR = 1.95583 BAM, 1 USD ~ 1.80 BAM
    let amount = inv.totalAmount;
    if (inv.currency === 'EUR') amount = inv.totalAmount * 1.95583;
    if (inv.currency === 'USD') amount = inv.totalAmount * 1.80;
    return acc + amount;
  }, 0);

  const completedSteps = milestones.filter(m => m.status === 'completed').length;
  const progressPercent = Math.round((completedSteps / milestones.length) * 100);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Authentic Mandate Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 rounded-3xl text-white p-6 sm:p-8 shadow-xl border border-emerald-800 relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
          <Award className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                قرار تكليف رسمي • Broj: 1232/1.1
              </span>
              <span className="text-xs text-emerald-300 font-mono">
                تاريخ القرار: 2026/9/3 م (20 ربيع الأول 1448 هـ)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-arabic tracking-tight leading-snug">
              فتح وإنشاء فرع جمعية الدعوة الإسلامية العالمية في جمهورية البوسنة والهرسك
            </h1>

            <p className="text-sm text-stone-200 leading-relaxed">
              المفوض القانوني المعتمد: <strong className="text-amber-300">{settings.directorNameAr} ({settings.directorNameBs})</strong> بموجب التفويض الصادر عن الممثل القانوني للجمعية <strong className="text-white">أ.د. صالح سليم الفاخري</strong> لتمثيل الجمعية أمام كافة الوزارات والهيئات الحكومية في البوسنة والهرسك.
            </p>
          </div>

          {/* Banner Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 flex-shrink-0">
            <button
              onClick={onOpenMandateModal}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>عرض وثيقة التكليف والترجمة</span>
            </button>

            <button
              onClick={onOpenNewLetter}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm transition-all backdrop-blur-xs"
            >
              <FileText className="w-4 h-4" />
              <span>مراسلة جهة حكومية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => onNavigateTab('letters')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 font-arabic">الكتب والمراسلات الحكومية</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 font-mono">
            {documents.length}
          </div>
          <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
            <span>مترجمة للبوسنية الرسمية</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('finances')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 font-arabic">إجمالي النفقات التأسيسية</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 group-hover:bg-amber-700 group-hover:text-white transition-colors">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 font-mono">
            {totalBAM.toLocaleString('de-DE', { maximumFractionDigits: 0 })} <span className="text-xs text-stone-500">KM / BAM</span>
          </div>
          <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
            <span>{invoices.length} فواتير موثقة في السجل</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('archive')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 font-arabic">سجل الوثائق المحفوظة</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-800 group-hover:bg-blue-800 group-hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 font-mono">
            {documents.length + invoices.length}
          </div>
          <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
            <span>جاهزة للطباعة المعيارية A4</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('activities')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 font-arabic">أنشطة وأخبار الإقليم</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 font-mono">
            {activities.length}
          </div>
          <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
            <span>مبادرات في سراييفو والبلقان</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
          </p>
        </div>

      </div>

      {/* Bosnian Government Registration Roadmap */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Plan i koraci registracije predstavništva u BiH
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-1 font-arabic">
              مسار الإجراءات الحكومية لفتح مكتب سراييفو رسمياً
            </h3>
          </div>

          <div className="flex items-center gap-3 bg-stone-100 px-4 py-2 rounded-xl text-xs">
            <span className="text-stone-600 font-medium">نسبة إنجاز الخطوات:</span>
            <strong className="text-emerald-800 font-mono text-sm">{progressPercent}%</strong>
          </div>
        </div>

        {/* Steps List */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {milestones.map((m) => (
            <div 
              key={m.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                m.status === 'completed'
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : m.status === 'in_progress'
                  ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/40'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center font-mono ${
                    m.status === 'completed'
                      ? 'bg-emerald-700 text-white'
                      : m.status === 'in_progress'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-300 text-stone-700'
                  }`}>
                    {m.stepNumber}
                  </span>
                  
                  {m.status === 'completed' ? (
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> منجز
                    </span>
                  ) : m.status === 'in_progress' ? (
                    <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> جاري
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-500">
                      قيد الانتظار
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-xs text-stone-900 font-arabic leading-snug mb-1">
                  {m.titleAr}
                </h4>
                <p className="text-[11px] text-stone-600 leading-tight mb-2">
                  {m.titleBs}
                </p>
                <div className="text-[10px] text-emerald-950 font-semibold bg-white/80 p-1.5 rounded-md border border-stone-200">
                  {m.authority}
                </div>
              </div>

              {m.notesAr && (
                <div className="text-[10px] text-stone-500 mt-3 pt-2 border-t border-stone-200 font-arabic">
                  {m.notesAr}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Recent Governmental Letters & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Official Letters */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900 font-arabic flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                أحدث المراسلات والكتب الحكومية
              </h3>
              <p className="text-xs text-stone-500">
                Službeni dopisi i zahtjevi za organe uprave u BiH
              </p>
            </div>
            
            <button
              onClick={onOpenNewLetter}
              className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>كتاب جديد</span>
            </button>
          </div>

          <div className="space-y-3">
            {documents.slice(0, 4).map((doc) => (
              <div 
                key={doc.id}
                className="p-4 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-stone-50/60 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                      {doc.refNumber}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {doc.dateGregorian}
                    </span>
                    {doc.status === 'submitted' && (
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        مقدّم للوزارة
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 font-arabic line-clamp-1">
                    {doc.titleAr}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-1">
                    {doc.titleBs}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onViewDocument(doc)}
                    className="p-2 text-stone-500 hover:text-emerald-800 hover:bg-stone-200 rounded-lg transition-colors text-xs"
                    title="معاينة"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onPrintDocument(doc)}
                    className="p-2 text-stone-500 hover:text-emerald-800 hover:bg-stone-200 rounded-lg transition-colors text-xs"
                    title="طباعة رسمية A4"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('letters')}
            className="w-full text-center py-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors block border-t border-stone-100"
          >
            عرض كافة المراسلات والكتب الحكومية ({documents.length}) &larr;
          </button>
        </div>

        {/* Recent Financial Invoices */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900 font-arabic flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-700" />
                سجل الفواتير والمصروفات التأسيسية
              </h3>
              <p className="text-xs text-stone-500">
                Računi i troškovi uspostave ureda Sarajevo
              </p>
            </div>
            
            <button
              onClick={onOpenNewInvoice}
              className="flex items-center gap-1 bg-stone-800 hover:bg-stone-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>فاتورة جديدة</span>
            </button>
          </div>

          <div className="space-y-3">
            {invoices.slice(0, 4).map((inv) => (
              <div 
                key={inv.id}
                className="p-4 rounded-xl border border-stone-200 hover:border-amber-600 hover:bg-stone-50/60 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-sm">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {inv.date}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inv.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.paymentStatus === 'paid' ? 'تم السداد' : 'قيد الصرف'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                    {inv.vendorNameBs}
                  </h4>
                  <p className="text-xs text-stone-600 font-arabic line-clamp-1">
                    {inv.vendorNameAr}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-stone-900">
                      {inv.totalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    </div>
                    <span className="text-[10px] font-semibold text-stone-500">{inv.currency}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewInvoice(inv)}
                      className="p-2 text-stone-500 hover:text-emerald-800 hover:bg-stone-200 rounded-lg transition-colors text-xs"
                      title="معاينة"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onPrintInvoice(inv)}
                      className="p-2 text-stone-500 hover:text-emerald-800 hover:bg-stone-200 rounded-lg transition-colors text-xs"
                      title="طباعة الفاتورة A4"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('finances')}
            className="w-full text-center py-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors block border-t border-stone-100"
          >
            عرض سجل الحسابات والفواتير بالكامل ({invoices.length}) &larr;
          </button>
        </div>

      </div>

      {/* Regional News Snapshot */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-200">
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-arabic flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-700" />
              أنشطة الجمعية والتعاون الإقليمي في البلقان
            </h3>
            <p className="text-xs text-stone-600">
              Aktivnosti i projekti Svjetske organizacije za islamski poziv u BiH i regiji
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('activities')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950"
          >
            عرض جميع الأنشطة ({activities.length}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activities.slice(0, 3).map((act) => (
            <div 
              key={act.id} 
              className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-stone-500 mb-2">
                  <span className="font-semibold text-emerald-800">{act.location}</span>
                  <span>{act.date}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 font-arabic mb-1 leading-snug line-clamp-2">
                  {act.titleAr}
                </h4>
                <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                  {act.summaryBs}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex justify-between items-center">
                <span>{act.partnerOrganization || 'WICS Sarajevo'}</span>
                <span className="text-emerald-700 font-bold">معتمد</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
