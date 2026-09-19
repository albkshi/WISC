import React from 'react';
import { FinanceInvoice, InvoiceItem, AppSettings } from '@/lib/types';
import { Plus, Trash2, Languages, Save, Printer, X, Receipt, Check, Loader2, DollarSign } from 'lucide-react';

interface InvoiceModalProps {
  invoiceToEdit?: FinanceInvoice | null;
  settings: AppSettings;
  onSave: (invoice: FinanceInvoice) => void;
  onClose: () => void;
  onPrintAfterSave?: (invoice: FinanceInvoice) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'legal_counsel', labelAr: 'أتعاب المحاماة والاستشارات القانونية', labelBs: 'Advokatske i pravne usluge' },
  { value: 'notary_court', labelAr: 'رسوم كاتب العدل والمحكمة (النوتر)', labelBs: 'Notarske i sudske takse' },
  { value: 'translation_sworn', labelAr: 'الترجمة القضائية المحلفة والمصادقات', labelBs: 'Sudski tumač i ovjere' },
  { value: 'office_rent_deposit', labelAr: 'إيجار مقر المكتب وتأمين العقار', labelBs: 'Zakup poslovnog prostora i depozit' },
  { value: 'government_fees', labelAr: 'رسوم التسجيل الحكومية والضرائب', labelBs: 'Državne takse i registracija' },
  { value: 'equipment_furniture', labelAr: 'تجهيزات ومستلزمات وأثاث المكتب', labelBs: 'Uredski namještaj i oprema' },
  { value: 'utilities_telecom', labelAr: 'الخدمات والاتصالات والإنترنت', labelBs: 'Režijski troškovi i telekomunikacije' },
  { value: 'travel_hospitality', labelAr: 'نفقات السفر والإقامة والضيافة', labelBs: 'Putni troškovi i reprezentacija' },
  { value: 'hq_remittance', labelAr: 'تحويلات ومخصصات الإدارة العامة', labelBs: 'Doznake centrale WICS' },
];

export default function InvoiceModal({
  invoiceToEdit,
  settings,
  onSave,
  onClose,
  onPrintAfterSave,
}: InvoiceModalProps) {
  const [invoiceNumber, setInvoiceNumber] = React.useState(
    invoiceToEdit?.invoiceNumber || 'INV-SJJ/2026-105'
  );
  const [type, setType] = React.useState<'expense' | 'income' | 'budget_allocation'>(
    invoiceToEdit?.type || 'expense'
  );
  const [date, setDate] = React.useState(
    invoiceToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [vendorNameAr, setVendorNameAr] = React.useState(invoiceToEdit?.vendorNameAr || '');
  const [vendorNameBs, setVendorNameBs] = React.useState(invoiceToEdit?.vendorNameBs || '');
  const [vendorTaxId, setVendorTaxId] = React.useState(invoiceToEdit?.vendorTaxId || '');
  const [category, setCategory] = React.useState<FinanceInvoice['category']>(
    invoiceToEdit?.category || 'legal_counsel'
  );
  const [currency, setCurrency] = React.useState<'BAM' | 'EUR' | 'USD'>(
    invoiceToEdit?.currency || 'BAM'
  );
  const [vatRate, setVatRate] = React.useState<number>(invoiceToEdit?.vatRate ?? 17);
  const [paymentStatus, setPaymentStatus] = React.useState<'paid' | 'pending' | 'partially_paid'>(
    invoiceToEdit?.paymentStatus || 'paid'
  );
  const [paymentMethod, setPaymentMethod] = React.useState<'bank_transfer' | 'cash' | 'card'>(
    invoiceToEdit?.paymentMethod || 'bank_transfer'
  );
  const [notesAr, setNotesAr] = React.useState(invoiceToEdit?.notesAr || '');
  const [notesBs, setNotesBs] = React.useState(invoiceToEdit?.notesBs || '');
  const [approvedByDirector, setApprovedByDirector] = React.useState(
    invoiceToEdit?.approvedByDirector ?? true
  );

  const [items, setItems] = React.useState<InvoiceItem[]>(
    invoiceToEdit?.items || [
      {
        id: 'item-1',
        descriptionAr: 'أتعاب الإجراءات القانونية وفتح ملف التسجيل',
        descriptionBs: 'Pravne usluge i otvaranje predmeta registracije',
        quantity: 1,
        unitPrice: 500,
        total: 500,
      },
    ]
  );

  const [isTranslatingIndex, setIsTranslatingIndex] = React.useState<number | null>(null);

  // Auto calculate amounts
  const subtotal = items.reduce((acc, it) => acc + (Number(it.total) || 0), 0);
  const vatAmount = vatRate > 0 ? (subtotal * vatRate) / 100 : 0;
  const totalAmount = subtotal + vatAmount;

  // Handle item change
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(value) : current.quantity;
      const p = field === 'unitPrice' ? Number(value) : current.unitPrice;
      current.total = (q || 0) * (p || 0);
    }
    
    updated[index] = current;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${items.length + 1}`,
        descriptionAr: '',
        descriptionBs: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Translate single item description from Arabic to Bosnian
  const handleTranslateItem = async (index: number) => {
    const item = items[index];
    if (!item.descriptionAr.trim()) return;

    setIsTranslatingIndex(index);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: item.descriptionAr,
          mode: 'invoice',
          sourceLang: 'ar',
          targetLang: 'bs',
        }),
      });
      const data = await res.json();
      if (data.translation) {
        handleItemChange(index, 'descriptionBs', data.translation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslatingIndex(null);
    }
  };

  const handleSave = (shouldPrint: boolean = false) => {
    const newInvoice: FinanceInvoice = {
      id: invoiceToEdit?.id || `inv-${invoiceNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      invoiceNumber,
      type,
      date,
      vendorNameAr: vendorNameAr || vendorNameBs || 'جهة غير محددة',
      vendorNameBs: vendorNameBs || vendorNameAr || 'Nespecificirani dobavljač',
      vendorTaxId,
      category,
      currency,
      items,
      subtotal,
      vatRate,
      vatAmount,
      totalAmount,
      paymentStatus,
      paymentMethod,
      notesAr,
      notesBs,
      approvedByDirector,
      createdAt: invoiceToEdit?.createdAt || new Date().toISOString(),
    };

    onSave(newInvoice);
    if (shouldPrint && onPrintAfterSave) {
      onPrintAfterSave(newInvoice);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center text-emerald-300">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full">
                {invoiceNumber}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 font-arabic">
                تسجيل فاتورة وسند صرف مالي • Unos finansijskog računa
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white hover:bg-emerald-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Top Row: Number, Date, Currency, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                رقم الفاتورة • Broj fakture
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-emerald-950 focus:bg-white focus:outline-emerald-600"
              />
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
                العملة • Valuta
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'BAM' | 'EUR' | 'USD')}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-bold text-emerald-950 focus:bg-white focus:outline-emerald-600"
              >
                <option value="BAM">مارك بوسني (BAM / KM)</option>
                <option value="EUR">يورو أوروبي (EUR €)</option>
                <option value="USD">دولار أمريكي (USD $)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                نوع المصروف • Kategorija
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FinanceInvoice['category'])}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:bg-white focus:outline-emerald-600 font-arabic"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.labelAr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vendor Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-arabic text-right">
                اسم الجهة / المورد (بالعربية)
              </label>
              <input
                type="text"
                value={vendorNameAr}
                onChange={(e) => setVendorNameAr(e.target.value)}
                placeholder="مثال: مكتب المحامي المعتمد في سراييفو"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-arabic text-stone-900 focus:outline-emerald-600 text-right"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 text-left">
                Naziv dobavljača (Bosanski)
              </label>
              <input
                type="text"
                value={vendorNameBs}
                onChange={(e) => setVendorNameBs(e.target.value)}
                placeholder="Npr: Advokatska kancelarija Sarajevo"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-emerald-600 text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 text-left">
                الرقم الضريبي (JIB / PIB)
              </label>
              <input
                type="text"
                value={vendorTaxId}
                onChange={(e) => setVendorTaxId(e.target.value)}
                placeholder="Npr: 4201889920001"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono text-stone-900 focus:outline-emerald-600 text-left"
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <div className="bg-stone-100 px-4 py-2.5 flex items-center justify-between border-b border-stone-200">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-emerald-800" />
                بنود الفاتورة والترجمة الثنائية • Stavke računa
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-md text-xs font-semibold transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة بند جديد</span>
              </button>
            </div>

            <div className="p-3 space-y-3">
              {items.map((item, idx) => (
                <div key={item.id || idx} className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-500">بند #{idx + 1}</span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="حذف البند"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Dual language descriptions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={item.descriptionAr}
                        onChange={(e) => handleItemChange(idx, 'descriptionAr', e.target.value)}
                        placeholder="الوصف بالعربية (مثال: أتعاب دراسة ملف التسجيل)..."
                        className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-xs font-arabic text-stone-900 focus:outline-emerald-600 text-right pr-2 pl-16"
                        dir="rtl"
                      />
                      <button
                        type="button"
                        onClick={() => handleTranslateItem(idx)}
                        disabled={isTranslatingIndex === idx || !item.descriptionAr.trim()}
                        className="absolute left-1 top-1 bottom-1 px-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded text-[10px] font-bold flex items-center gap-1 disabled:opacity-40 transition-all"
                        title="ترجمة إلى البوسنية"
                      >
                        {isTranslatingIndex === idx ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <Languages className="w-3 h-3" />
                            <span>ترجم</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={item.descriptionBs}
                        onChange={(e) => handleItemChange(idx, 'descriptionBs', e.target.value)}
                        placeholder="Opis na bosanskom (npr. Usluga analize registracije)..."
                        className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-xs text-stone-900 focus:outline-emerald-600 text-left"
                      />
                    </div>
                  </div>

                  {/* Quantity, Unit Price, Total */}
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[10px] text-stone-500 font-semibold mb-0.5">الكمية / Količina</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-stone-300 rounded-md px-2 py-1 text-xs text-stone-900 focus:outline-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 font-semibold mb-0.5">السعر الفردي / Cijena ({currency})</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-stone-300 rounded-md px-2 py-1 text-xs font-mono text-stone-900 focus:outline-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 font-semibold mb-0.5">الإجمالي / Ukupno ({currency})</label>
                      <div className="w-full bg-stone-200/80 border border-stone-300 rounded-md px-2 py-1 text-xs font-mono font-bold text-stone-900 text-right">
                        {item.total.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Calculations Bar */}
            <div className="bg-stone-100 p-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-stone-600 block">نسبة الضريبة (PDV):</span>
                  <select
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="bg-white border border-stone-300 rounded px-2 py-1 text-xs font-bold mt-0.5"
                  >
                    <option value={17}>17% (النسبة القياسية للبوسنة)</option>
                    <option value={0}>0% (إعفاء ضريبي / Taksa oslobođena)</option>
                  </select>
                </div>

                <div>
                  <span className="text-stone-600 block">طريقة السداد:</span>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as 'bank_transfer' | 'cash' | 'card')}
                    className="bg-white border border-stone-300 rounded px-2 py-1 text-xs mt-0.5"
                  >
                    <option value="bank_transfer">تحويل بنكي (Bankovni transfer)</option>
                    <option value="cash">نقداً من الخزينة (Gotovina)</option>
                    <option value="card">بطاقة دفع (Kartica)</option>
                  </select>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-stone-600">
                  المجموع قبل الضريبة: <strong className="font-mono">{subtotal.toFixed(2)} {currency}</strong>
                </div>
                <div className="text-stone-600">
                  الضريبة ({vatRate}%): <strong className="font-mono">{vatAmount.toFixed(2)} {currency}</strong>
                </div>
                <div className="text-sm font-bold text-emerald-950">
                  الإجمالي النهائي: <strong className="font-mono text-base text-emerald-900">{totalAmount.toFixed(2)} {currency}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Approval */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                حالة الصرف / Status plaćanja
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentStatus('paid')}
                  className={`flex-1 py-1.5 rounded-lg border font-medium transition-all ${
                    paymentStatus === 'paid' ? 'bg-emerald-700 text-white border-emerald-800' : 'bg-white text-stone-700 border-stone-300'
                  }`}
                >
                  تم الصرف والسداد (Plaćeno)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentStatus('pending')}
                  className={`flex-1 py-1.5 rounded-lg border font-medium transition-all ${
                    paymentStatus === 'pending' ? 'bg-amber-600 text-white border-amber-700' : 'bg-white text-stone-700 border-stone-300'
                  }`}
                >
                  قيد المراجعة والاعتماد (Na čekanju)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <strong className="block text-stone-900">اعتماد المفوض الرسمي</strong>
                <span className="text-[11px] text-stone-500">
                  تم الصرف بموجب الصلاحيات المخولة للأستاذ مصطفى البكشي
                </span>
              </div>
              <input
                type="checkbox"
                checked={approvedByDirector}
                onChange={(e) => setApprovedByDirector(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-4 sm:px-6 py-3.5 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            الحساب: جمعية الدعوة الإسلامية العالمية - فرع سراييفو
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>حفظ في السجل</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>حفظ وطباعة الفاتورة (A4 Print)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
