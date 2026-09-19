import React from 'react';
import { OfficeDocument } from '@/lib/types';
import { 
  FileText, 
  Plus, 
  Search, 
  Printer, 
  Edit3, 
  Trash2, 
  Languages, 
  Building, 
  Calendar,
  CheckCircle2,
  Clock,
  Globe
} from 'lucide-react';

interface GovernmentLettersProps {
  documents: OfficeDocument[];
  onOpenNewLetter: () => void;
  onEditDocument: (doc: OfficeDocument) => void;
  onPrintDocument: (doc: OfficeDocument) => void;
  onDeleteDocument: (id: string) => void;
}

export default function GovernmentLetters({
  documents,
  onOpenNewLetter,
  onEditDocument,
  onPrintDocument,
  onDeleteDocument,
}: GovernmentLettersProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  // Filter letters
  const filtered = documents.filter((doc) => {
    const matchesSearch = 
      doc.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.titleBs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.refNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.recipientOrg && doc.recipientOrg.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Languages className="w-4 h-4" />
            <span>Službena prepiska i ovjereni prijevodi na bosanski jezik</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-arabic">
            المراسلات والكتب الرسمية للدوائر الحكومية البوسنية
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            كتابة الكتب بالعربية مع توليد الصياغة البوسنية المعتمدة للوزارات وطباعتها على ورق الترويسة الرسمي A4
          </p>
        </div>

        <button
          onClick={onOpenNewLetter}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>تحرير كتاب رسمي جديد</span>
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
            placeholder="بحث بالرقم الإشاري، الموضوع، أو اسم الوزارة..."
            className="w-full text-xs text-stone-900 focus:outline-hidden bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            الكل ({documents.length})
          </button>
          <button
            onClick={() => setSelectedCategory('ministry_application')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'ministry_application'
                ? 'bg-emerald-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            طلبات وزارة العدل
          </button>
          <button
            onClick={() => setSelectedCategory('government_letter')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'government_letter'
                ? 'bg-emerald-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            مصلحة الضرائب والبلديات
          </button>
          <button
            onClick={() => setSelectedCategory('mandate')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'mandate'
                ? 'bg-emerald-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            قرارات التكليف
          </button>
        </div>
      </div>

      {/* Letters List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
            <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 font-arabic">لا توجد كتب مطابقة لخيارات البحث</h3>
            <p className="text-xs text-stone-500 mt-1">يمكنك البدء بإنشاء كتاب رسمي جديد للوزارة المعنية</p>
          </div>
        ) : (
          filtered.map((doc) => (
            <div 
              key={doc.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs hover:border-emerald-600 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100/70 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {doc.refNumber}
                  </span>
                  <span className="text-xs text-stone-500 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {doc.dateGregorian}
                  </span>
                  {doc.recipientOrg && (
                    <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <Building className="w-3 h-3 text-emerald-700" />
                      {doc.recipientOrg}
                    </span>
                  )}
                  {doc.status === 'submitted' && (
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      مقدم للوزارة
                    </span>
                  )}
                  {doc.status === 'approved' && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      معتمد
                    </span>
                  )}
                </div>

                {/* Arabic Title */}
                <h3 className="text-base font-bold text-stone-900 font-arabic leading-snug">
                  {doc.titleAr}
                </h3>

                {/* Bosnian Title */}
                <p className="text-xs sm:text-sm font-semibold text-emerald-950">
                  {doc.titleBs}
                </p>

                {/* Short snippet */}
                <p className="text-xs text-stone-500 font-arabic line-clamp-2">
                  {doc.contentAr.substring(0, 200)}...
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                <button
                  onClick={() => onPrintDocument(doc)}
                  className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                  title="طباعة على ورق الترويسة A4"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة A4</span>
                </button>

                <button
                  onClick={() => onEditDocument(doc)}
                  className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-xl transition-colors text-xs"
                  title="تعديل الكتاب"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteDocument(doc.id)}
                  className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors text-xs"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
