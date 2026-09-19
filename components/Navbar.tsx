'use client';

import React from 'react';
import WicsLogo from './WicsLogo';
import { 
  FileText, 
  Receipt, 
  FolderKanban, 
  Globe, 
  Award, 
  Lock, 
  Unlock, 
  Plus, 
  ShieldCheck,
  Home,
  Building2,
  Mail,
  ArrowRight,
  ExternalLink,
  LogOut,
  LayoutDashboard,
  Image as ImageIcon
} from 'lucide-react';

export type TabType = 'landing' | 'dashboard' | 'letters' | 'finances' | 'archive' | 'activities' | 'landing-editor' | 'media-gallery';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAdminAuthenticated: boolean;
  onOpenAdminModal: () => void;
  onOpenMandateModal: () => void;
  onOpenNewLetter: () => void;
  onOpenNewInvoice: () => void;
  customLogoUrl?: string;
  logoSizePx?: number;
  logoFrameStyle?: 'transparent' | 'white-card' | 'white-circle';
}

export default function Navbar({
  activeTab,
  setActiveTab,
  isAdminAuthenticated,
  onOpenAdminModal,
  onOpenMandateModal,
  onOpenNewLetter,
  onOpenNewInvoice,
  customLogoUrl,
  logoSizePx,
  logoFrameStyle = 'transparent',
}: NavbarProps) {
  const isLanding = activeTab === 'landing';

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs print:hidden">
      
      {/* Top Banner with Official Affiliation */}
      <div className="bg-slate-900 text-slate-200 text-[11px] py-2 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-arabic font-semibold">
            جمعية الدعوة الإسلامية العالمية • فرع البوسنة والهرسك - سراييفو
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400 font-sans text-[11px]">
          <span>World Islamic Call Society • Sarajevo, Bosnia & Herzegovina</span>
        </div>
      </div>

      {/* Main Navigation Bar - Locked reliable height (80px) so resizing the logo never expands the header banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 min-h-[80px] max-h-[80px] gap-4">
          
          {/* Logo Brand - Frameless and scalable without stretching the header */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="cursor-pointer hover:opacity-95 transition-opacity flex items-center h-full max-h-20 py-1 flex-shrink-0"
            title="جمعية الدعوة الإسلامية العالمية - فرع سراييفو"
          >
            <WicsLogo 
              sizePx={logoSizePx || 52} 
              showText={true} 
              bilingual={true} 
              customLogoUrl={customLogoUrl} 
              logoFrameStyle={logoFrameStyle}
            />
          </div>

          {/* If on Public Landing: Show clean navigational anchor links */}
          {isLanding ? (
            <nav className="hidden md:flex items-center gap-1 sm:gap-2 font-arabic text-sm font-bold">
              <a
                href="#hero"
                className="px-3.5 py-2 rounded-xl text-stone-700 hover:text-blue-800 hover:bg-stone-100 transition-colors"
              >
                الرئيسية
              </a>
              <a
                href="#mosques"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-stone-700 hover:text-blue-800 hover:bg-stone-100 transition-colors"
              >
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>مساجد البوسنة</span>
              </a>
              <a
                href="#news"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-stone-700 hover:text-blue-800 hover:bg-stone-100 transition-colors"
              >
                <Globe className="w-4 h-4 text-blue-700" />
                <span>الأخبار والأنشطة</span>
              </a>
              <a
                href="#contact"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 shadow-xs transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>اتصل بنا</span>
              </a>
            </nav>
          ) : (
            /* If in IDARA (Administration Mode): Show admin quick actions & lock */
            <div className="flex items-center gap-2">
              
              {/* Back to Public Site */}
              <button
                onClick={() => {
                  setActiveTab('landing');
                  if (typeof window !== 'undefined') {
                    window.history.replaceState(null, '', window.location.pathname);
                  }
                }}
                className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-arabic transition-all border border-stone-300"
                title="الخروج من لوحة الإدارة إلى الموقع العام"
              >
                <Home className="w-4 h-4 text-stone-600" />
                <span className="hidden sm:inline">الموقع العام</span>
                <span className="sm:hidden">الرئيسية</span>
              </button>

              {/* Quick Government Letter */}
              <button
                onClick={onOpenNewLetter}
                className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-arabic shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">كتاب حكومي جديد</span>
                <span className="sm:hidden">كتاب</span>
              </button>

              {/* Quick Invoice */}
              <button
                onClick={onOpenNewInvoice}
                className="flex items-center gap-1.5 bg-blue-800 hover:bg-blue-900 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-arabic transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                <Receipt className="w-4 h-4 text-blue-200" />
                <span className="hidden sm:inline">فاتورة صرف</span>
                <span className="sm:hidden">فاتورة</span>
              </button>

              {/* Mandate Paper Button (for admin only) */}
              <button
                onClick={onOpenMandateModal}
                className="hidden lg:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-2 rounded-xl text-xs font-bold font-arabic transition-all"
                title="قرار التكليف رقم 1232/1.1"
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span>قرار التكليف</span>
              </button>

              {/* Admin Lock / Auth Button */}
              <button
                onClick={onOpenAdminModal}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isAdminAuthenticated
                    ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                    : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                }`}
                title={isAdminAuthenticated ? 'الإدارة مفعلة' : 'تسجيل دخول الإدارة'}
              >
                {isAdminAuthenticated ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden md:inline font-arabic">الإدارة مفعلة</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-stone-500" />
                    <span className="hidden md:inline font-arabic">تسجيل دخول</span>
                  </>
                )}
              </button>

            </div>
          )}

        </div>

        {/* Second Row Navigation Tabs */}
        {isLanding ? (
          /* Mobile Navigation on Landing */
          <nav className="flex md:hidden items-center justify-around border-t border-stone-100 py-2.5 font-arabic text-xs font-bold">
            <a
              href="#hero"
              className="text-stone-700 hover:text-blue-800 px-2 py-1"
            >
              الرئيسية
            </a>
            <a
              href="#mosques"
              className="flex items-center gap-1 text-stone-700 hover:text-blue-800 px-2 py-1"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>المساجد</span>
            </a>
            <a
              href="#news"
              className="flex items-center gap-1 text-stone-700 hover:text-blue-800 px-2 py-1"
            >
              <Globe className="w-3.5 h-3.5 text-blue-700" />
              <span>الأخبار</span>
            </a>
            <a
              href="#contact"
              className="flex items-center gap-1 text-blue-800 font-bold px-2 py-1 bg-blue-50 rounded-lg"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>اتصل بنا</span>
            </a>
          </nav>
        ) : (
          /* Admin Navigation Tabs Bar (Visible ONLY in IDARA mode) */
          <nav className="flex space-x-1 sm:space-x-2 border-t border-stone-100 overflow-x-auto py-2 -mb-px">
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>مسار التأسيس والملخص</span>
            </button>

            <button
              onClick={() => setActiveTab('letters')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'letters'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>المراسلات والكتب الحكومية</span>
              <span className="text-[10px] bg-amber-400 text-stone-950 font-bold px-1.5 py-0.2 rounded-full">
                ترجمة AI
              </span>
            </button>

            <button
              onClick={() => setActiveTab('finances')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'finances'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>الفواتير والمصروفات المالية</span>
            </button>

            <button
              onClick={() => setActiveTab('archive')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'archive'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>أرشيف وقاعدة المستندات</span>
            </button>

            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'activities'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>إدارة الأخبار والأنشطة</span>
            </button>

            <button
              onClick={() => setActiveTab('landing-editor')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'landing-editor'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              <span>تعديل الواجهة والشعار</span>
            </button>

            <button
              onClick={() => setActiveTab('media-gallery')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'media-gallery'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>مكتبة الصور والرفع</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('landing');
                if (typeof window !== 'undefined') {
                  window.history.replaceState(null, '', window.location.pathname);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap text-stone-500 hover:text-stone-900 hover:bg-stone-100 mr-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج إلى الموقع</span>
            </button>

          </nav>
        )}

      </div>
    </header>
  );
}
