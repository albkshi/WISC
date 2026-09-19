'use client';

import React from 'react';
import { GalleryImage, BosnianMosque, LandingPageConfig, AppSettings } from '@/lib/types';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  ExternalLink, 
  Search, 
  Sparkles, 
  CloudCheck, 
  Layers, 
  Eye, 
  Copy, 
  Building2, 
  Globe, 
  X, 
  ArrowUpRight,
  Filter,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { compressImageFile, formatFileSize } from '@/lib/image-utils';

interface MediaGalleryProps {
  images: GalleryImage[];
  mosques: BosnianMosque[];
  landingConfig: LandingPageConfig;
  settings: AppSettings;
  onUploadImage: (newImage: GalleryImage) => Promise<boolean>;
  onDeleteImage: (id: string) => Promise<boolean>;
  onSetHeroImage: (imageUrl: string) => Promise<boolean>;
  onSetLogoImage: (imageUrl: string) => Promise<boolean>;
  onUpdateMosqueImage: (mosqueId: string, imageUrl: string) => Promise<boolean>;
  onShowToast: (msg: string) => void;
}

export default function MediaGallery({
  images,
  mosques,
  landingConfig,
  settings,
  onUploadImage,
  onDeleteImage,
  onSetHeroImage,
  onSetLogoImage,
  onUpdateMosqueImage,
  onShowToast,
}: MediaGalleryProps) {
  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeSubTab, setActiveSubTab] = React.useState<'gallery' | 'mosques-sync'>('gallery');

  // Upload Studio states
  const [isDragging, setIsDragging] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [previewData, setPreviewData] = React.useState<{
    dataUrl: string;
    sizeKb: number;
    width: number;
    height: number;
    name: string;
  } | null>(null);

  const [uploadTitleAr, setUploadTitleAr] = React.useState('');
  const [uploadTitleBs, setUploadTitleBs] = React.useState('');
  const [uploadCategory, setUploadCategory] = React.useState<'mosque' | 'activity' | 'hero' | 'logo' | 'general'>('activity');
  const [uploadTags, setUploadTags] = React.useState('');
  const [isSavingToFirebase, setIsSavingToFirebase] = React.useState(false);

  // Mosque replace modal state
  const [selectedMosqueForImage, setSelectedMosqueForImage] = React.useState<string | null>(null);
  const [mosqueImageSource, setMosqueImageSource] = React.useState<string | null>(null);

  // Lightbox
  const [lightboxImage, setLightboxImage] = React.useState<GalleryImage | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const mosqueSpecificFileInputRef = React.useRef<HTMLInputElement>(null);
  const [targetMosqueForDirectUpload, setTargetMosqueForDirectUpload] = React.useState<string | null>(null);

  // Handle file drop / selection
  const processSelectedFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP, SVG)');
      return;
    }
    setIsProcessing(true);
    try {
      const processed = await compressImageFile(file, 1400, 0.84);
      setPreviewData(processed);

      // Auto-suggest titles if blank
      if (!uploadTitleAr) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        setUploadTitleAr(cleanName);
        setUploadTitleBs(cleanName);
      }
    } catch (err) {
      console.error('Error processing image:', err);
      onShowToast('حدث خطأ أثناء معالجة الصورة، يرجى المحاولة مرة أخرى');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  // Submit to Firebase
  const handleSaveUpload = async () => {
    if (!previewData) {
      onShowToast('يرجى اختيار صورة أولاً');
      return;
    }

    setIsSavingToFirebase(true);
    try {
      const newImg: GalleryImage = {
        id: `img-${Date.now()}`,
        titleAr: uploadTitleAr.trim() || previewData.name,
        titleBs: uploadTitleBs.trim() || previewData.name,
        category: uploadCategory,
        imageUrl: previewData.dataUrl,
        sizeKb: previewData.sizeKb,
        uploadedAt: new Date().toISOString(),
        tags: uploadTags ? uploadTags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        isBuiltIn: false,
      };

      const success = await onUploadImage(newImg);
      if (success) {
        onShowToast('تم حفظ الصورة وربطها بقاعدة بيانات فايربيس بنجاح');
        setPreviewData(null);
        setUploadTitleAr('');
        setUploadTitleBs('');
        setUploadTags('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        onShowToast('تعذر الحفظ في فايربيس، يرجى التحقق من الاتصال');
      }
    } catch (error) {
      console.error('Failed to save to firebase:', error);
      onShowToast('خطأ أثناء الحفظ في فايربيس');
    } finally {
      setIsSavingToFirebase(false);
    }
  };

  // Mosque direct upload
  const handleMosqueDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetMosqueForDirectUpload) return;

    try {
      onShowToast('جاري ضغط ورفع صورة المسجد إلى فايربيس...');
      const processed = await compressImageFile(file, 1200, 0.82);
      
      // Update mosque in Firestore
      await onUpdateMosqueImage(targetMosqueForDirectUpload, processed.dataUrl);

      // Also register in gallery_images collection
      const targetMosque = mosques.find(m => m.id === targetMosqueForDirectUpload);
      const newGalleryImg: GalleryImage = {
        id: `img-mosque-${targetMosqueForDirectUpload}-${Date.now()}`,
        titleAr: targetMosque ? targetMosque.nameAr : 'صورة مسجد',
        titleBs: targetMosque ? targetMosque.nameBs : 'Slika džamije',
        category: 'mosque',
        imageUrl: processed.dataUrl,
        sizeKb: processed.sizeKb,
        uploadedAt: new Date().toISOString(),
        tags: targetMosque ? [targetMosque.cityAr, targetMosque.cityBs, 'مسجد'] : ['مسجد'],
        isBuiltIn: false,
      };
      await onUploadImage(newGalleryImg);

      onShowToast('تم تحديث صورة المسجد وربطها في فايربيس بنجاح!');
    } catch (err) {
      console.error('Failed to direct upload mosque image:', err);
      onShowToast('تعذر رفع صورة المسجد');
    } finally {
      setTargetMosqueForDirectUpload(null);
      if (mosqueSpecificFileInputRef.current) mosqueSpecificFileInputRef.current.value = '';
    }
  };

  // Copy link
  const handleCopyLink = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      onShowToast('تم نسخ مسار الصورة إلى الحافظة');
    }
  };

  // Filtered images
  const filteredImages = images.filter((img) => {
    const matchesCat = selectedCategory === 'all' || img.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCat;

    const matchesSearch = 
      img.titleAr.toLowerCase().includes(query) ||
      img.titleBs.toLowerCase().includes(query) ||
      (img.tags && img.tags.some(t => t.toLowerCase().includes(query)));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-arabic text-stone-900" dir="rtl">
      
      {/* Hidden File Input for Direct Mosque Upload */}
      <input
        ref={mosqueSpecificFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleMosqueDirectUpload}
      />

      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs relative overflow-hidden">
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold">
                <CloudCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>متصل بقاعدة Google Firebase Firestore</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100/80 text-blue-900 text-xs font-bold">
                <Layers className="w-3.5 h-3.5 text-blue-700" />
                <span>{images.length} صورة ووسيط</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-arabic tracking-tight">
              مكتبة الصور والوسائط الرقمية
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm max-w-2xl font-arabic leading-relaxed">
              إدارة ورفع وربط صور المعالم البوسنية، وأنشطة فرع جمعية الدعوة الإسلامية العالمية، وصور الواجهة الرئيسية، والشعارات الرسمية مباشرة بقاعدة بيانات فايربيس السحابية.
            </p>
          </div>

          {/* Sub-tab switcher */}
          <div className="flex items-center p-1.5 bg-stone-100 border border-stone-200 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveSubTab('gallery')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeSubTab === 'gallery'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>مكتبة الوسائط والرفع ({images.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('mosques-sync')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeSubTab === 'mosques-sync'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>صور المساجد التاريخية ({mosques.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: MEDIA GALLERY & UPLOADER */}
      {activeSubTab === 'gallery' && (
        <div className="space-y-8">
          
          {/* UPLOAD STUDIO ZONE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900">
                    رفع صورة جديدة وربطها في فايربيس
                  </h2>
                  <p className="text-xs text-stone-500">
                    يتم ضغط الصورة تلقائياً للحفاظ على سرعة التحميل وملاءمة سعة Firestore
                  </p>
                </div>
              </div>

              {previewData && (
                <button
                  type="button"
                  onClick={() => setPreviewData(null)}
                  className="text-stone-400 hover:text-stone-700 text-xs font-bold flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>إلغاء المعاينة</span>
                </button>
              )}
            </div>

            {/* Drag & Drop Area */}
            {!previewData ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                    : 'border-stone-300 hover:border-emerald-500 bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shadow-xs">
                    {isProcessing ? (
                      <Loader2 className="w-7 h-7 animate-spin" />
                    ) : (
                      <Upload className="w-7 h-7" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-stone-800">
                      اسحب وأفلت ملف الصورة هنا، أو اضغط للتصفح
                    </p>
                    <p className="text-xs text-stone-500">
                      يدعم PNG, JPG, JPEG, WEBP, SVG • حجم أقصى مستحسن 5MB
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>ضغط ذكي فوري للحفاظ على الجودة العالية</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Image Upload Metadata Form */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Preview Card */}
                <div className="lg:col-span-4 bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-200 border border-stone-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewData.dataUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-stone-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md" dir="ltr">
                      {previewData.width} × {previewData.height} px
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-600 px-1 font-semibold">
                    <span>حجم الصورة بعد الضغط:</span>
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md" dir="ltr">
                      {formatFileSize(previewData.sizeKb)}
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        عنوان الصورة بالعربية *
                      </label>
                      <input
                        type="text"
                        value={uploadTitleAr}
                        onChange={(e) => setUploadTitleAr(e.target.value)}
                        placeholder="مثال: جامع الغازي خسرو بك في الشتاء"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        عنوان الصورة بالبوسنية • Naslov na bosanskom *
                      </label>
                      <input
                        type="text"
                        value={uploadTitleBs}
                        onChange={(e) => setUploadTitleBs(e.target.value)}
                        placeholder="Npr. Gazi Husrev-begova džamija zimi"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-emerald-600"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        تصنيف الصورة • Kategorija
                      </label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value as any)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-emerald-600"
                      >
                        <option value="mosque">معالم ومساجد البوسنة (Džamije)</option>
                        <option value="activity">أخبار وفعاليات الفرع (Aktivnosti)</option>
                        <option value="hero">لافتة الواجهة الرئيسية (Hero Banner)</option>
                        <option value="logo">شعارات وهوية الجمعية (Logo & Amblem)</option>
                        <option value="general">وثائق وتراث عام (Opće & Naslijeđe)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        وسوم وكلمات دلالية (مفصولة بفاصلة)
                      </label>
                      <input
                        type="text"
                        value={uploadTags}
                        onChange={(e) => setUploadTags(e.target.value)}
                        placeholder="سراييفو, تاريخ, تراث, فرع"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setPreviewData(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      disabled={isSavingToFirebase}
                      onClick={handleSaveUpload}
                      className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {isSavingToFirebase ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري الحفظ في فايربيس...</span>
                        </>
                      ) : (
                        <>
                          <CloudCheck className="w-4 h-4" />
                          <span>حفظ وربط في فايربيس (Firestore)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* FILTER & SEARCH BAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                الكل ({images.length})
              </button>
              <button
                onClick={() => setSelectedCategory('mosque')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === 'mosque'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                المساجد التاريخية ({images.filter(i => i.category === 'mosque').length})
              </button>
              <button
                onClick={() => setSelectedCategory('activity')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === 'activity'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                الأخبار والأنشطة ({images.filter(i => i.category === 'activity').length})
              </button>
              <button
                onClick={() => setSelectedCategory('hero')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === 'hero'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                لافتة الواجهة ({images.filter(i => i.category === 'hero').length})
              </button>
              <button
                onClick={() => setSelectedCategory('logo')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === 'logo'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                الشعارات ({images.filter(i => i.category === 'logo').length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في الصور والوسوم..."
                className="w-full bg-white border border-stone-200 rounded-full pr-9 pl-4 py-1.5 text-xs text-stone-800 focus:outline-emerald-600 shadow-2xs"
              />
            </div>
          </div>

          {/* IMAGES GRID */}
          {filteredImages.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
              <ImageIcon className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-bold text-stone-700">لم يتم العثور على صور مطابقة</p>
              <p className="text-xs text-stone-500">جرب تغيير كلمات البحث أو اختر تصنيفاً آخر</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((img) => {
                const isCurrentHero = landingConfig.heroImageUrl === img.imageUrl;
                const isCurrentLogo = settings.customLogoUrl === img.imageUrl;

                return (
                  <div
                    key={img.id}
                    className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Preview Container */}
                      <div className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer" onClick={() => setLightboxImage(img)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.imageUrl}
                          alt={img.titleBs}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/mosques/begova.jpg';
                          }}
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                            img.category === 'mosque' ? 'bg-emerald-600 text-white' :
                            img.category === 'activity' ? 'bg-blue-600 text-white' :
                            img.category === 'hero' ? 'bg-amber-600 text-white' :
                            img.category === 'logo' ? 'bg-purple-600 text-white' :
                            'bg-stone-700 text-white'
                          }`}>
                            {img.category === 'mosque' ? 'مسجد' :
                             img.category === 'activity' ? 'نشاط' :
                             img.category === 'hero' ? 'واجهة' :
                             img.category === 'logo' ? 'شعار' : 'عام'}
                          </span>

                          {isCurrentHero && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 flex items-center gap-1 shadow-xs">
                              <Check className="w-3 h-3" />
                              <span>الواجهة</span>
                            </span>
                          )}

                          {isCurrentLogo && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500 text-white flex items-center gap-1 shadow-xs">
                              <Check className="w-3 h-3" />
                              <span>الشعار</span>
                            </span>
                          )}
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setLightboxImage(img); }}
                            className="w-9 h-9 rounded-full bg-white/90 text-stone-800 flex items-center justify-center hover:bg-white transition-all shadow-sm"
                            title="معاينة كاملة"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleCopyLink(img.imageUrl); }}
                            className="w-9 h-9 rounded-full bg-white/90 text-stone-800 flex items-center justify-center hover:bg-white transition-all shadow-sm"
                            title="نسخ الرابط"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                          {img.titleAr}
                        </h3>
                        <p className="text-[11px] text-stone-500 line-clamp-1 font-sans" dir="ltr">
                          {img.titleBs}
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-100">
                          <span>{img.sizeKb ? `${img.sizeKb} KB` : 'محلي'}</span>
                          <span>{img.isBuiltIn ? 'رسمي مدمج' : 'مرفوع في فايربيس'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-3 bg-stone-50 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-[11px]">
                      
                      {/* Set as Hero Button */}
                      <button
                        type="button"
                        onClick={async () => {
                          await onSetHeroImage(img.imageUrl);
                          onShowToast('تم تحديث صورة الواجهة الرئيسية وحفظها في فايربيس');
                        }}
                        className={`px-2 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
                          isCurrentHero
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                        }`}
                        title="تعيين كصورة الواجهة الرئيسية"
                      >
                        <span>تعيين للواجهة</span>
                      </button>

                      {/* Set as Logo Button (if category is logo or any image) */}
                      <button
                        type="button"
                        onClick={async () => {
                          await onSetLogoImage(img.imageUrl);
                          onShowToast('تم تعيين الصورة كشعار رسمي في فايربيس');
                        }}
                        className={`px-2 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
                          isCurrentLogo
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                        }`}
                        title="تعيين كشعار الهيدر"
                      >
                        <span>كشعار</span>
                      </button>

                      {/* Link to Mosque */}
                      <button
                        type="button"
                        onClick={() => {
                          setMosqueImageSource(img.imageUrl);
                          setSelectedMosqueForImage(mosques[0]?.id || null);
                        }}
                        className="px-2 py-1 bg-white hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-md font-semibold transition-colors"
                        title="ربط الصورة بمسجد"
                      >
                        <span>ربط بمسجد</span>
                      </button>

                      {/* Delete Custom Image */}
                      {!img.isBuiltIn && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm('هل أنت متأكد من حذف هذه الصورة من فايربيس؟')) {
                              await onDeleteImage(img.id);
                              onShowToast('تم حذف الصورة من فايربيس');
                            }
                          }}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors mr-auto"
                          title="حذف من فايربيس"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* SUB-TAB 2: HISTORIC BOSNIAN MOSQUES SYNC */}
      {activeSubTab === 'mosques-sync' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5 mb-6">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-700" />
                  <span>ربط وتحديث صور المساجد التاريخية الثمانية في فايربيس</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  يمكنك استبدال أو رفع صورة جديدة لأي مسجد وسيتم حفظها وتحديثها فوراً في مجموعة `mosques` في Firestore.
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-center">
                مربوطة بقاعدة فايربيس: collection(&apos;mosques&apos;)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mosques.map((mosque) => (
                <div
                  key={mosque.id}
                  className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-4/3 overflow-hidden bg-stone-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mosque.imageUrl}
                        alt={mosque.nameBs}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/mosques/begova.jpg';
                        }}
                      />
                      <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {mosque.cityAr}
                      </div>
                      <div className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md" dir="ltr">
                        {mosque.yearBuilt}
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h3 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                        {mosque.nameAr}
                      </h3>
                      <p className="text-[11px] text-stone-500 line-clamp-1 font-sans" dir="ltr">
                        {mosque.nameBs}
                      </p>
                      <p className="text-[11px] text-emerald-800 font-medium line-clamp-2 pt-1">
                        {mosque.tagAr}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetMosqueForDirectUpload(mosque.id);
                        mosqueSpecificFileInputRef.current?.click();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg transition-colors shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع صورة جديدة</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        await onSetHeroImage(mosque.imageUrl);
                        onShowToast(`تم تعيين صورة ${mosque.nameAr} كواجهة رئيسية`);
                      }}
                      className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
                      title="تعيين كواجهة الموقع"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* MODAL: LINK IMAGE TO MOSQUE */}
      {mosqueImageSource && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>ربط هذه الصورة بأحد مساجد البوسنة</span>
              </h3>
              <button
                type="button"
                onClick={() => setMosqueImageSource(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mosqueImageSource} alt="Target" className="w-full h-full object-cover" />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                اختر المسجد المراد تحديث صورته في فايربيس:
              </label>
              <select
                value={selectedMosqueForImage || ''}
                onChange={(e) => setSelectedMosqueForImage(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600"
              >
                {mosques.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nameAr} ({m.cityAr}) - {m.nameBs}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setMosqueImageSource(null)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!selectedMosqueForImage) return;
                  await onUpdateMosqueImage(selectedMosqueForImage, mosqueImageSource);
                  onShowToast('تم تحديث صورة المسجد في فايربيس بنجاح');
                  setMosqueImageSource(null);
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                تأكيد وتحديث المسجد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LIGHTBOX */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden border border-stone-200 shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video sm:aspect-16/10 bg-stone-950 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.titleBs}
                className="max-h-full max-w-full object-contain"
              />
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-stone-900/80 text-white flex items-center justify-center hover:bg-stone-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-stone-900">{lightboxImage.titleAr}</h3>
                  <p className="text-xs text-stone-500 font-sans" dir="ltr">{lightboxImage.titleBs}</p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  {lightboxImage.sizeKb ? `${lightboxImage.sizeKb} KB` : 'حجم قياسي'}
                </span>
              </div>

              {lightboxImage.descriptionAr && (
                <p className="text-xs text-stone-700 leading-relaxed">
                  {lightboxImage.descriptionAr}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await onSetHeroImage(lightboxImage.imageUrl);
                      onShowToast('تم تعيين الصورة كواجهة رئيسية');
                      setLightboxImage(null);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    تعيين كصورة الواجهة
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await onSetLogoImage(lightboxImage.imageUrl);
                      onShowToast('تم تعيين الصورة كشعار رسمي');
                      setLightboxImage(null);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    تعيين كشعار
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyLink(lightboxImage.imageUrl)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ مسار الصورة</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
