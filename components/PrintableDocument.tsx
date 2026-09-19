import React from 'react';
import { OfficeDocument, FinanceInvoice, AppSettings } from '@/lib/types';
import WicsLogo from './WicsLogo';
import { Printer, X, FileText, Globe, CheckCircle2 } from 'lucide-react';

interface PrintableDocumentProps {
  document?: OfficeDocument | null;
  invoice?: FinanceInvoice | null;
  settings: AppSettings;
  onClose: () => void;
  initialMode?: 'bosnian' | 'bilingual' | 'arabic' | 'invoice';
}

export default function PrintableDocument({
  document,
  invoice,
  settings,
  onClose,
  initialMode = 'bilingual',
}: PrintableDocumentProps) {
  const [printMode, setPrintMode] = React.useState<'bosnian' | 'bilingual' | 'arabic' | 'invoice'>(
    invoice ? 'invoice' : initialMode
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Container Dialog */}
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none">
        
        {/* Top Action Bar (Hidden during printing) */}
        <div className="bg-stone-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 print:hidden">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-emerald-700/60 rounded-lg text-emerald-300">
              <Printer className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-stone-100 flex items-center gap-2">
                معاينة الطباعة الرسمية • Službeni pregled za štampu
              </h3>
              <p className="text-xs text-stone-400">
                {document ? document.refNumber : invoice?.invoiceNumber} — القياس المعياري A4 الرسمي
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {!invoice && (
              <div className="flex bg-stone-800 p-1 rounded-lg border border-stone-700 text-xs">
                <button
                  onClick={() => setPrintMode('bosnian')}
                  className={`px-3 py-1.5 rounded font-medium transition-all ${
                    printMode === 'bosnian' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  بوسني فقط (للوزارات)
                </button>
                <button
                  onClick={() => setPrintMode('bilingual')}
                  className={`px-3 py-1.5 rounded font-medium transition-all ${
                    printMode === 'bilingual' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  ثنائي اللغة (عربي - بوسني)
                </button>
                <button
                  onClick={() => setPrintMode('arabic')}
                  className={`px-3 py-1.5 rounded font-medium transition-all ${
                    printMode === 'arabic' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  عربي فقط (للإدارة)
                </button>
              </div>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المستند (Print / PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
              title="إغلاق المعاينة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Paper Area */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-stone-100/60 print:p-0 print:bg-white print:overflow-visible flex justify-center">
          
          {/* Authentic A4 Sheet */}
          <div className="bg-white w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-md border border-stone-300 rounded-sm print:shadow-none print:border-none print:p-8 print:w-full print:max-w-none text-stone-900 font-serif leading-relaxed relative flex flex-col justify-between">
            
            {/* Header / Letterhead */}
            <div>
              <div className="flex items-start justify-between border-b-2 border-emerald-800 pb-4 mb-6">
                {/* Right Side (Arabic) */}
                <div className="text-right flex-1 font-sans">
                  <h1 className="text-base sm:text-lg font-bold text-emerald-950 font-arabic leading-tight">
                    جمعية الدعوة الإسلامية العالمية
                  </h1>
                  <p className="text-xs font-semibold text-emerald-800">
                    فرع جمهورية البوسنة والهرسك - سراييفو
                  </p>
                  <p className="text-[11px] text-stone-600 font-arabic mt-0.5">
                    مكتب التمثيل الرسمي والعلاقات الحكومية
                  </p>
                </div>

                {/* Center Emblem */}
                <div className="px-4 flex flex-col items-center flex-shrink-0">
                  <WicsLogo 
                    size="md" 
                    showText={false} 
                    customLogoUrl={settings.customLogoUrl} 
                    logoFrameStyle={settings.logoFrameStyle || 'transparent'} 
                  />
                  <span className="text-[10px] font-sans font-bold text-emerald-900 mt-1 uppercase tracking-widest">
                    WICS SARAJEVO
                  </span>
                </div>

                {/* Left Side (Bosnian / English) */}
                <div className="text-left flex-1 font-sans">
                  <h2 className="text-sm sm:text-base font-bold text-emerald-950 tracking-tight leading-tight">
                    WORLD ISLAMIC CALL SOCIETY
                  </h2>
                  <p className="text-xs font-semibold text-emerald-800">
                    Predstavništvo u Bosni i Hercegovini
                  </p>
                  <p className="text-[11px] text-stone-600">
                    Ured za saradnju i vladine institucije • Sarajevo
                  </p>
                </div>
              </div>

              {/* Reference and Date Bar */}
              <div className="flex justify-between items-center text-xs font-sans text-stone-700 bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-sm mb-6">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-900">Broj / الرقم الإشاري:</span>
                  <span className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 border border-stone-300 rounded-xs">
                    {document ? document.refNumber : invoice?.invoiceNumber}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span>
                    <strong className="text-stone-900">Datum:</strong> {document ? document.dateGregorian : invoice?.date}
                  </span>
                  {document?.dateHijri && (
                    <span className="font-arabic text-stone-600">
                      <strong>التاريخ الهجري:</strong> {document.dateHijri}
                    </span>
                  )}
                </div>
              </div>

              {/* Document Case */}
              {document && (
                <>
                  {/* Recipient Box */}
                  <div className="mb-6 font-sans">
                    {(printMode === 'bosnian' || printMode === 'bilingual') && document.recipientBs && (
                      <div className="text-left mb-2">
                        <div className="text-xs font-bold uppercase text-stone-500 tracking-wider">Primalac / Naslov:</div>
                        <div className="text-sm sm:text-base font-bold text-stone-900">{document.recipientBs}</div>
                        {document.recipientOrg && (
                          <div className="text-xs text-emerald-900 font-semibold">{document.recipientOrg}</div>
                        )}
                      </div>
                    )}
                    {(printMode === 'arabic' || printMode === 'bilingual') && document.recipientAr && (
                      <div className="text-right font-arabic mt-2">
                        <div className="text-xs font-bold text-stone-500">إلى السادة المحترمين:</div>
                        <div className="text-sm sm:text-base font-bold text-stone-900">{document.recipientAr}</div>
                      </div>
                    )}
                  </div>

                  {/* Subject Line */}
                  <div className="bg-emerald-50/70 border-r-4 border-l-4 border-emerald-700 p-3 mb-6">
                    {(printMode === 'bosnian' || printMode === 'bilingual') && (
                      <div className="text-left font-sans">
                        <span className="font-bold text-xs uppercase text-emerald-900 mr-2">PREDMET:</span>
                        <span className="font-bold text-sm sm:text-base text-stone-900">{document.titleBs}</span>
                      </div>
                    )}
                    {(printMode === 'arabic' || printMode === 'bilingual') && (
                      <div className={`text-right font-arabic ${printMode === 'bilingual' ? 'mt-2 pt-2 border-t border-emerald-200' : ''}`}>
                        <span className="font-bold text-xs text-emerald-900 ml-2">الموضوع:</span>
                        <span className="font-bold text-sm sm:text-base text-stone-900">{document.titleAr}</span>
                      </div>
                    )}
                  </div>

                  {/* Document Body */}
                  {printMode === 'bilingual' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 my-4">
                      {/* Bosnian Column (Left) */}
                      <div className="text-left text-xs sm:text-sm font-sans leading-relaxed text-stone-800 space-y-3 border-r border-stone-200 pr-4 print:pr-4">
                        <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider pb-1 border-b border-emerald-100 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" />
                          Verzija na bosanskom jeziku (Za organe vlasti)
                        </div>
                        <div className="whitespace-pre-line text-justify">
                          {document.contentBs}
                        </div>
                      </div>

                      {/* Arabic Column (Right) */}
                      <div className="text-right text-xs sm:text-sm font-arabic leading-loose text-stone-800 space-y-3 pl-4 print:pl-4" dir="rtl">
                        <div className="text-[11px] font-bold text-emerald-800 pb-1 border-b border-emerald-100 flex items-center justify-end gap-1.5 font-sans">
                          <span>النص الرسمي باللغة العربية (الأصل)</span>
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="whitespace-pre-line text-justify">
                          {document.contentAr}
                        </div>
                      </div>
                    </div>
                  ) : printMode === 'bosnian' ? (
                    <div className="text-left text-sm sm:text-base font-sans leading-relaxed text-stone-800 space-y-4 my-6 whitespace-pre-line text-justify">
                      {document.contentBs}
                    </div>
                  ) : (
                    <div className="text-right text-sm sm:text-base font-arabic leading-loose text-stone-800 space-y-4 my-6 whitespace-pre-line text-justify" dir="rtl">
                      {document.contentAr}
                    </div>
                  )}
                </>
              )}

              {/* Invoice Case */}
              {invoice && (
                <div className="font-sans">
                  {/* Invoice Meta Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6 bg-stone-50 p-4 border border-stone-200 rounded-sm text-xs">
                    <div>
                      <span className="text-stone-500 uppercase font-semibold block">Izdavalac / Dobavljač (Vendor):</span>
                      <strong className="text-sm text-stone-900 block mt-0.5">{invoice.vendorNameBs}</strong>
                      <span className="font-arabic text-stone-600 block">{invoice.vendorNameAr}</span>
                      {invoice.vendorTaxId && (
                        <span className="text-stone-600 block mt-1">JIB / Ident. broj: {invoice.vendorTaxId}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-stone-500 uppercase font-semibold block">Korisnik / Uplatilac (Client):</span>
                      <strong className="text-sm text-emerald-950 block mt-0.5">
                        World Islamic Call Society - Predstavništvo Sarajevo
                      </strong>
                      <span className="text-stone-600 block">Ferhadija bb, Centar, 71000 Sarajevo, BiH</span>
                      <span className="text-stone-600 block">Status plaćanja: 
                        <span className={`ml-1 font-bold ${invoice.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {invoice.paymentStatus === 'paid' ? 'PLAĆENO (Paid)' : 'U OBRADI (Pending)'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="border border-stone-300 rounded-sm overflow-hidden mb-6">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-emerald-900 text-white font-semibold">
                          <th className="py-2.5 px-3 border-b border-emerald-950 w-12 text-center">#</th>
                          <th className="py-2.5 px-3 border-b border-emerald-950">Opis stavke (Bosanski)</th>
                          <th className="py-2.5 px-3 border-b border-emerald-950 text-right font-arabic">الوصف بالعربية</th>
                          <th className="py-2.5 px-3 border-b border-emerald-950 text-center w-16">Kol.</th>
                          <th className="py-2.5 px-3 border-b border-emerald-950 text-right w-24">Cijena ({invoice.currency})</th>
                          <th className="py-2.5 px-3 border-b border-emerald-950 text-right w-28">Ukupno ({invoice.currency})</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {invoice.items.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-stone-50">
                            <td className="py-2.5 px-3 text-center text-stone-500">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-medium text-stone-900">{item.descriptionBs}</td>
                            <td className="py-2.5 px-3 text-right font-arabic text-stone-700" dir="rtl">{item.descriptionAr}</td>
                            <td className="py-2.5 px-3 text-center text-stone-600">{item.quantity}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-stone-700">
                              {item.unitPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-stone-900">
                              {item.total.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Calculations summary */}
                  <div className="flex justify-end mb-6">
                    <div className="w-72 bg-stone-50 border border-stone-200 rounded-sm p-3 text-xs space-y-1.5">
                      <div className="flex justify-between text-stone-600">
                        <span>Iznos bez PDV / Osnovica:</span>
                        <span className="font-mono font-medium">
                          {invoice.subtotal.toLocaleString('de-DE', { minimumFractionDigits: 2 })} {invoice.currency}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Stopa PDV-a ({invoice.vatRate}%):</span>
                        <span className="font-mono font-medium">
                          {invoice.vatAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} {invoice.currency}
                        </span>
                      </div>
                      <div className="border-t border-stone-300 pt-1.5 flex justify-between text-sm font-bold text-emerald-950">
                        <span>UKUPNO ZA UPLATU:</span>
                        <span className="font-mono text-base text-emerald-900">
                          {invoice.totalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} {invoice.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Notes */}
                  {(invoice.notesAr || invoice.notesBs) && (
                    <div className="bg-stone-50 border border-stone-200 p-3 rounded-sm text-xs mb-6">
                      <strong className="text-stone-700 block mb-1">Napomene / ملاحظات:</strong>
                      {invoice.notesBs && <p className="text-stone-700">{invoice.notesBs}</p>}
                      {invoice.notesAr && <p className="text-stone-700 font-arabic text-right mt-1" dir="rtl">{invoice.notesAr}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Signatures and Official Stamp */}
            <div className="border-t border-stone-300 pt-6 mt-8 font-sans">
              <div className="flex items-end justify-between">
                
                {/* Official Stamp Simulation */}
                <div className="flex items-center gap-3">
                  <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-emerald-700/60 flex items-center justify-center p-1 text-center rotate-[-6deg]">
                    <div className="w-full h-full rounded-full border border-emerald-600/40 flex flex-col items-center justify-center p-1 text-[8px] font-bold text-emerald-800 uppercase tracking-tighter leading-tight">
                      <span>جمعية الدعوة الإسلامية</span>
                      <span className="my-0.5 text-emerald-900">★ ★ ★</span>
                      <span className="text-[7px]">PREDSTAVNIŠTVO SARAJEVO</span>
                      <span className="text-[7px] font-mono text-emerald-700">WICS BIH</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono space-y-0.5">
                    <div>Verifikovano u sistemu</div>
                    <div>Digital Hash: WICS-{document ? document.id.substring(0, 8) : invoice?.id.substring(0, 8)}</div>
                    <div className="text-emerald-800 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Službeni dokument
                    </div>
                  </div>
                </div>

                {/* Signatory Box */}
                <div className="text-center w-64">
                  <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Ovlašteno lice za zastupanje
                  </div>
                  <div className="font-arabic text-xs font-bold text-emerald-950 mb-4">
                    المفوض الرسمي لإدارة الفرع
                  </div>
                  <div className="h-10 flex items-center justify-center">
                    {/* Handwritten style signature simulation */}
                    <span className="font-serif italic text-lg text-emerald-950 font-bold underline decoration-emerald-600/50 decoration-wavy">
                      M. Mahmoud Al-Bakshi
                    </span>
                  </div>
                  <div className="border-t border-stone-400 pt-1">
                    <div className="font-bold text-xs text-stone-900">{settings.directorNameBs}</div>
                    <div className="font-arabic text-xs text-stone-700">{settings.directorNameAr}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{settings.directorTitleBs}</div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="text-center text-[9px] text-stone-500 border-t border-stone-200 mt-6 pt-2 flex justify-between items-center">
                <span>Ferhadija bb, 71000 Sarajevo, BiH • Tel: {settings.contactPhone} • {settings.contactEmail}</span>
                <span>WICS Tripoli: {settings.hqEmail} • www.wicsociety.ly</span>
                <span>Stranica 1 od 1</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
