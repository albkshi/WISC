import React from 'react';
import { OfficeDocument, FinanceInvoice } from '@/lib/types';
import { 
  FolderKanban, 
  Search, 
  Printer, 
  FileText, 
  Receipt, 
  Award, 
  Download, 
  Building, 
  Calendar,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface DocumentArchiveProps {
  documents: OfficeDocument[];
  invoices: FinanceInvoice[];
  onPrintDocument: (doc: OfficeDocument) => void;
  onPrintInvoice: (inv: FinanceInvoice) => void;
  onViewDocument: (doc: OfficeDocument) => void;
  onViewInvoice: (inv: FinanceInvoice) => void;
  onExportAll: () => void;
}

export default function DocumentArchive({
  documents,
  invoices,
  onPrintDocument,
  onPrintInvoice,
  onViewDocument,
  onViewInvoice,
  onExportAll,
}: DocumentArchiveProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'documents' | 'invoices'>('all');

  // Unified items
  type UnifiedItem = {
    id: string;
    type: 'document' | 'invoice';
    refNumber: string;
    date: string;
    titleAr: string;
    titleBs: string;
    category: string;
    status: string;
    rawDoc?: OfficeDocument;
    rawInvoice?: FinanceInvoice;
  };

  const unifiedList: UnifiedItem[] = [
    ...documents.map((d) => ({
      id: d.id,
      type: 'document' as const,
      refNumber: d.refNumber,
      date: d.dateGregorian,
      titleAr: d.titleAr,
      titleBs: d.titleBs,
      category: d.category === 'mandate' ? 'قرار تكليف رسمي' : 'كتاب حكومي للوزارات',
      status: d.status,
      rawDoc: d,
    })),
    ...invoices.map((inv) => ({
      id: inv.id,
      type: 'invoice' as const,
      refNumber: inv.invoiceNumber,
      date: inv.date,
      titleAr: `فاتورة صرف: ${inv.vendorNameAr} (${inv.totalAmount} ${inv.currency})`,
      titleBs: `Račun / Trošak: ${inv.vendorNameBs} (${inv.totalAmount} ${inv.currency})`,
      category: 'فاتورة وسند صرف مالي',
      status: inv.paymentStatus,
      rawInvoice: inv,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = unifiedList.filter((item) => {
    const matchesSearch =
      item.refNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleBs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      activeFilter === 'all' ||
      (activeFilter === 'documents' && item.type === 'document') ||
      (activeFilter === 'invoices' && item.type === 'invoice');

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Centralna baza podataka i arhiva ureda Sarajevo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-arabic">
            أرشيف وقاعدة بيانات المستندات المركزية
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            مكان موحد لحفظ كافة قرارات التكليف، الكتب الحكومية، المحاضر، وفواتير الصرف مع إمكانية البحث والطباعة الفورية
          </p>
        </div>

        <button
          onClick={onExportAll}
          className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>تصدير الأرشيف كاملاً (JSON Data)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في جميع الوثائق، الفواتير، والأرقام الإشارية..."
            className="w-full text-xs text-stone-900 focus:outline-hidden bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            كافة السجلات ({unifiedList.length})
          </button>
          <button
            onClick={() => setActiveFilter('documents')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeFilter === 'documents'
                ? 'bg-emerald-800 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            المراسلات والقرارات ({documents.length})
          </button>
          <button
            onClick={() => setActiveFilter('invoices')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeFilter === 'invoices'
                ? 'bg-amber-700 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            الفواتير والمالية ({invoices.length})
          </button>
        </div>
      </div>

      {/* Archive Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-100/70 border-b border-stone-200 text-stone-700 font-bold">
              <tr>
                <th className="py-3.5 px-4 text-right">الرقم الإشاري / المرجع</th>
                <th className="py-3.5 px-4 text-right">عنوان الوثيقة / السجل</th>
                <th className="py-3.5 px-4 text-center">التصنيف</th>
                <th className="py-3.5 px-4 text-center">التاريخ</th>
                <th className="py-3.5 px-4 text-center">الحالة</th>
                <th className="py-3.5 px-4 text-center">الإجراءات والطباعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    لا توجد مستندات تطابق معايير البحث
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-950">
                      {item.refNumber}
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-bold text-stone-900 font-arabic line-clamp-1">
                        {item.titleAr}
                      </div>
                      <div className="text-[11px] text-stone-500 font-sans line-clamp-1">
                        {item.titleBs}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.type === 'document' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {item.type === 'document' ? <FileText className="w-3 h-3" /> : <Receipt className="w-3 h-3" />}
                        <span>{item.category}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-stone-600">
                      {item.date}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'approved' || item.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'submitted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status === 'paid' && 'تم السداد'}
                        {item.status === 'approved' && 'معتمد'}
                        {item.status === 'submitted' && 'مقدم للجهة'}
                        {item.status === 'pending' && 'قيد المتابعة'}
                        {item.status === 'draft' && 'مسودة'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item.type === 'document' && item.rawDoc && (
                          <>
                            <button
                              onClick={() => onViewDocument(item.rawDoc!)}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
                            >
                              معاينة
                            </button>
                            <button
                              onClick={() => onPrintDocument(item.rawDoc!)}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <Printer className="w-3 h-3" />
                              <span>طباعة A4</span>
                            </button>
                          </>
                        )}

                        {item.type === 'invoice' && item.rawInvoice && (
                          <>
                            <button
                              onClick={() => onViewInvoice(item.rawInvoice!)}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
                            >
                              معاينة
                            </button>
                            <button
                              onClick={() => onPrintInvoice(item.rawInvoice!)}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <Printer className="w-3 h-3" />
                              <span>طباعة السند</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
