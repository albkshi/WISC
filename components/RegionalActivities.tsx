import React from 'react';
import Image from 'next/image';
import { RegionalActivity } from '@/lib/types';
import { 
  Globe, 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  Edit3, 
  Trash2, 
  Building2, 
  ExternalLink,
  Languages,
  BookOpen
} from 'lucide-react';

interface RegionalActivitiesProps {
  activities: RegionalActivity[];
  onOpenNewActivity: () => void;
  onEditActivity: (activity: RegionalActivity) => void;
  onDeleteActivity: (id: string) => void;
}

export default function RegionalActivities({
  activities,
  onOpenNewActivity,
  onEditActivity,
  onDeleteActivity,
}: RegionalActivitiesProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedLocation, setSelectedLocation] = React.useState<string>('all');
  const [languageMode, setLanguageMode] = React.useState<'bilingual' | 'ar' | 'bs'>('bilingual');
  const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({});

  const filtered = activities.filter((act) => {
    const matchesSearch =
      act.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.titleBs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.summaryAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.summaryBs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'all' || act.category === selectedCategory;
    const matchesLoc = selectedLocation === 'all' || act.location.includes(selectedLocation);

    return matchesSearch && matchesCat && matchesLoc;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Regionalne aktivnosti i vijesti WICS-a u Bosni i Hercegovini</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-arabic">
            لوحة أنشطة وأخبار الجمعية في البوسنة وإقليم البلقان
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            متابعة المبادرات الإنسانية، المراكز التعليمية لتعليم اللغة العربية، وبرامج الحوار الثقافي المشترك
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Language display toggle */}
          <div className="bg-stone-100 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setLanguageMode('ar')}
              className={`px-3 py-1.5 rounded-lg font-bold font-arabic transition-all ${
                languageMode === 'ar' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setLanguageMode('bilingual')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                languageMode === 'bilingual' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
              }`}
            >
              ثنائي
            </button>
            <button
              onClick={() => setLanguageMode('bs')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                languageMode === 'bs' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
              }`}
            >
              Bosanski
            </button>
          </div>

          <button
            onClick={onOpenNewActivity}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة نشاط جديد</span>
          </button>
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
            placeholder="بحث في الأخبار والمشاريع والمدن..."
            className="w-full text-xs text-stone-900 focus:outline-hidden bg-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            جميع المجالات ({activities.length})
          </button>
          <button
            onClick={() => setSelectedCategory('diplomatic')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'diplomatic'
                ? 'bg-emerald-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            علاقات حكومية ودبلوماسية
          </button>
          <button
            onClick={() => setSelectedCategory('humanitarian')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'humanitarian'
                ? 'bg-emerald-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            إغاثية وإنسانية
          </button>
          <button
            onClick={() => setSelectedCategory('educational')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'educational'
                ? 'bg-emerald-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            تعليم ولغة عربية
          </button>
        </div>
      </div>

      {/* Grid of Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-stone-200">
            <Globe className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 font-arabic">لا توجد أخبار مطابقة للبحث</h3>
            <p className="text-xs text-stone-500 mt-1">أضف خبراً أو نشاطاً جديداً عن جهود الجمعية في البوسنة</p>
          </div>
        ) : (
          filtered.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                {act.imageUrl && (
                  <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                    <Image
                      src={imageErrors[act.id] ? '/mosques/careva.jpg' : (act.imageUrl || '/mosques/careva.jpg')}
                      alt={act.titleBs}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={() => setImageErrors(prev => ({ ...prev, [act.id]: true }))}
                    />
                    <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{act.location}</span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {act.date}
                    </span>
                    <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md font-sans">
                      {act.category === 'diplomatic' && 'دبلوماسية'}
                      {act.category === 'humanitarian' && 'إنسانية وإغاثة'}
                      {act.category === 'cultural' && 'ثقافية'}
                      {act.category === 'dialogue' && 'حوار وتعايش'}
                      {act.category === 'educational' && 'تعليم ولغة عربية'}
                    </span>
                  </div>

                  {/* Title */}
                  {(languageMode === 'ar' || languageMode === 'bilingual') && (
                    <h3 className="font-bold text-sm sm:text-base text-stone-900 font-arabic leading-snug" dir="rtl">
                      {act.titleAr}
                    </h3>
                  )}

                  {(languageMode === 'bs' || languageMode === 'bilingual') && (
                    <h4 className="font-bold text-xs sm:text-sm text-stone-800 leading-snug">
                      {act.titleBs}
                    </h4>
                  )}

                  {/* Summary */}
                  {(languageMode === 'ar' || languageMode === 'bilingual') && (
                    <p className="text-xs text-stone-600 font-arabic leading-relaxed line-clamp-3" dir="rtl">
                      {act.summaryAr}
                    </p>
                  )}

                  {(languageMode === 'bs' || (languageMode === 'bilingual' && !act.summaryAr)) && (
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {act.summaryBs}
                    </p>
                  )}

                  {/* Partner Organization */}
                  {act.partnerOrganization && (
                    <div className="pt-2 flex items-center gap-1.5 text-xs text-stone-500 font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>الشريك: {act.partnerOrganization}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold text-[11px]">
                  مكتب سراييفو الرسمي
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditActivity(act)}
                    className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-stone-200 rounded-lg transition-colors"
                    title="تعديل"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteActivity(act.id)}
                    className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
