import React from 'react';
import { FinanceInvoice } from '@/lib/types';
import { 
  Receipt, 
  Plus, 
  Search, 
  Printer, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Building, 
  DollarSign,
  TrendingDown
} from 'lucide-react';

interface InvoicesFinanceProps {
  invoices: FinanceInvoice[];
  onOpenNewInvoice: () => void;
  onEditInvoice: (inv: FinanceInvoice) => void;
  onPrintInvoice: (inv: FinanceInvoice) => void;
  onDeleteInvoice: (id: string) => void;
}

export default function InvoicesFinance({
  invoices,
  onOpenNewInvoice,
  onEditInvoice,
  onPrintInvoice,
  onDeleteInvoice,
}: InvoicesFinanceProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = React.useState<string>('all');

  // Summary statistics
  const totalPaidBAM = invoices
    .filter((inv) => inv.paymentStatus === 'paid')
    .reduce((acc, inv) => {
      let val = inv.totalAmount;
      if (inv.currency === 'EUR') val *= 1.95583;
      if (inv.currency === 'USD') val *= 1.80;
      return acc + val;
    }, 0);

  const totalPendingBAM = invoices
    .filter((inv) => inv.paymentStatus === 'pending')
    .reduce((acc, inv) => {
      let val = inv.totalAmount;
      if (inv.currency === 'EUR') val *= 1.95583;
      if (inv.currency === 'USD') val *= 1.80;
      return acc + val;
    }, 0);

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.vendorNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.vendorNameBs.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || inv.paymentStatus === selectedStatus;
    const matchesCurrency = selectedCurrency === 'all' || inv.currency === selectedCurrency;

    return matchesSearch && matchesStatus && matchesCurrency;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4" />
            <span>Finansijsko poslovanje i troškovnik ureda Sarajevo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-arabic">
            إدارة الفواتير والمصروفات المالية للفرع
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            توثيق رسوم المحاماة، الترجمة المحلفة، كاتب العدل، إيجار المقر، والتجهيزات بالمارك البوسني واليورو
          </p>
        </div>

        <button
          onClick={onOpenNewInvoice}
          className="flex items-center gap-2 bg-stone-800 hover:bg-stone-900 text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>تسجيل فاتورة صرف جديدة</span>
        </button>
      </div>

      {/* Financial Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl">
          <span className="text-xs font-bold text-emerald-900 font-arabic block mb-1">
            إجمالي المدفوعات المسددة
          </span>
          <div className="text-2xl font-extrabold text-emerald-950 font-mono">
            {totalPaidBAM.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            <span className="text-xs font-sans text-emerald-800">KM (BAM)</span>
          </div>
          <span className="text-[11px] text-emerald-700 mt-1 block">
            بموجب إيصالات وتحويلات مصرفية معتمدة
          </span>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl">
          <span className="text-xs font-bold text-amber-900 font-arabic block mb-1">
            مبالغ قيد الصرف والاعتماد
          </span>
          <div className="text-2xl font-extrabold text-amber-950 font-mono">
            {totalPendingBAM.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            <span className="text-xs font-sans text-amber-800">KM (BAM)</span>
          </div>
          <span className="text-[11px] text-amber-700 mt-1 block">
            بانتظار وصول الحوالة من طرابلس
          </span>
        </div>

        <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl">
          <span className="text-xs font-bold text-stone-700 font-arabic block mb-1">
            إجمالي الفواتير المسجلة
          </span>
          <div className="text-2xl font-extrabold text-stone-900 font-mono">
            {invoices.length}{' '}
            <span className="text-xs font-sans text-stone-500">سند</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            1 EUR = 1.95583 KM (سعر الصرف الثابت)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برقم الفاتورة أو اسم المورد أو الجهة..."
            className="w-full text-xs text-stone-900 focus:outline-hidden bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedStatus === 'all'
                ? 'bg-stone-800 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            الكل ({invoices.length})
          </button>
          <button
            onClick={() => setSelectedStatus('paid')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedStatus === 'paid'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            مسددة
          </button>
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedStatus === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            قيد الصرف
          </button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
            <Receipt className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 font-arabic">لا توجد فواتير مطابقة</h3>
            <p className="text-xs text-stone-500 mt-1">سجل أول مصروف أو فاتورة للمكتب من زر الإضافة أعلاه</p>
          </div>
        ) : (
          filtered.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs hover:border-amber-600 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-0.5 rounded-md border border-stone-300">
                    {inv.invoiceNumber}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    {inv.date}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    inv.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inv.paymentStatus === 'paid' ? 'تم السداد (Plaćeno)' : 'قيد المراجعة (Pending)'}
                  </span>
                  {inv.approvedByDirector && (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      معتمد من المفوض
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-stone-900">
                    {inv.vendorNameBs}
                  </h3>
                  <p className="text-xs font-arabic text-stone-600">
                    {inv.vendorNameAr}
                  </p>
                </div>

                {/* Items Summary */}
                <div className="text-xs text-stone-500 space-y-1">
                  {inv.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                      <span>{item.descriptionBs} ({item.total.toFixed(2)} {inv.currency})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount and Action */}
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                <div className="text-right">
                  <div className="text-xs text-stone-500 font-semibold">المبلغ الإجمالي</div>
                  <div className="font-mono text-xl font-bold text-stone-950">
                    {inv.totalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    <span className="text-xs text-emerald-800 font-bold ml-1">{inv.currency}</span>
                  </div>
                  {inv.vatRate > 0 && (
                    <div className="text-[10px] text-stone-400">شامل ضريبة PDV ({inv.vatRate}%)</div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onPrintInvoice(inv)}
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                    title="طباعة سند الصرف والفاتورة A4"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>طباعة الفاتورة</span>
                  </button>

                  <button
                    onClick={() => onEditInvoice(inv)}
                    className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-xl transition-colors text-xs"
                    title="تعديل الفاتورة"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteInvoice(inv.id)}
                    className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors text-xs"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
