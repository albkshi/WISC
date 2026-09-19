import React from 'react';
import { AppSettings } from '@/lib/types';
import { Lock, Unlock, KeyRound, Shield, Check, X, AlertCircle, Download, Upload, UserCog } from 'lucide-react';

interface AdminLockModalProps {
  isOpen: boolean;
  isAdminAuthenticated: boolean;
  settings: AppSettings;
  onAuthenticate: () => void;
  onLock: () => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onExportBackup: () => void;
  onImportBackup: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

export default function AdminLockModal({
  isOpen,
  isAdminAuthenticated,
  settings,
  onAuthenticate,
  onLock,
  onUpdateSettings,
  onExportBackup,
  onImportBackup,
  onClose,
}: AdminLockModalProps) {
  const [pinInput, setPinInput] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'auth' | 'settings'>('auth');
  const [formData, setFormData] = React.useState<AppSettings>(settings);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [prevSettings, setPrevSettings] = React.useState(settings);
  if (prevSettings !== settings) {
    setPrevSettings(settings);
    setFormData(settings);
  }

  if (!isOpen) return null;

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === settings.adminPin || pinInput.trim() === 'sarajevo2026libyawics') {
      onAuthenticate();
      setErrorMsg(null);
      setPinInput('');
      setActiveTab('settings');
    } else {
      setErrorMsg('كلمة المرور غير صحيحة، يرجى إعادة المحاولة.');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-arabic flex items-center gap-2">
                <span>بوابة الإدارة والمفوض الرسمي</span>
                {isAdminAuthenticated ? (
                  <span className="text-xs font-mono font-normal bg-emerald-700 text-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> مفعّل
                  </span>
                ) : (
                  <span className="text-xs font-mono font-normal bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> مقفول
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-400">
                حماية القرارات الرسمية والبيانات المالية وقاعدة بيانات الوثائق
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector if authenticated */}
        {isAdminAuthenticated && (
          <div className="bg-stone-100 px-6 pt-3 border-b border-stone-200 flex gap-2">
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'settings'
                  ? 'border-emerald-700 text-emerald-950'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              إعدادات الإدارة والمفوض
            </button>
            <button
              onClick={() => setActiveTab('auth')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'auth'
                  ? 'border-emerald-700 text-emerald-950'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              النسخ الاحتياطي والأمان
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Not authenticated screen */}
          {!isAdminAuthenticated ? (
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start gap-3">
                <KeyRound className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block font-bold">تسجيل دخول المفوض الرسمي (السيد مصطفى البكشي)</strong>
                  <p>أدخل كلمة مرور الإدارة لفتح صلاحيات التعديل، حذف الوثائق، واعتماد الفواتير المالية.</p>
                  <p className="text-[11px] text-amber-700 mt-1">
                    كلمة المرور الافتراضية الأولية: <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">sarajevo2026libyawics</code>
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  كلمة المرور / Admin PIN *
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="أدخل كلمة المرور هنا..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:outline-emerald-600"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-98"
              >
                تأكيد الدخول وتفعيل الصلاحيات
              </button>
            </form>
          ) : activeTab === 'settings' ? (
            /* Settings Form */
            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              
              {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>تم حفظ وتحديث الإعدادات بنجاح!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 font-arabic text-right">
                    اسم المفوض الرسمي (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={formData.directorNameAr}
                    onChange={(e) => setFormData({ ...formData, directorNameAr: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-right font-arabic"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 text-left">
                    Ime ovlaštenog lica (Bosanski)
                  </label>
                  <input
                    type="text"
                    value={formData.directorNameBs}
                    onChange={(e) => setFormData({ ...formData, directorNameBs: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 font-arabic text-right">
                    الصفة والمنصب (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={formData.directorTitleAr}
                    onChange={(e) => setFormData({ ...formData, directorTitleAr: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-right font-arabic"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 text-left">
                    Funkcija i zvanje (Bosanski)
                  </label>
                  <input
                    type="text"
                    value={formData.directorTitleBs}
                    onChange={(e) => setFormData({ ...formData, directorTitleBs: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  عنوان مقر سراييفو الرسمي (Adresa sjedišta u Sarajevu)
                </label>
                <input
                  type="text"
                  value={formData.sarajevoOfficeAddressBs}
                  onChange={(e) => setFormData({ ...formData, sarajevoOfficeAddressBs: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    البريد الإلكتروني للتواصل
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    تغيير كلمة مرور الإدارة (Admin PIN)
                  </label>
                  <input
                    type="text"
                    value={formData.adminPin}
                    onChange={(e) => setFormData({ ...formData, adminPin: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-emerald-950"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-sm"
                >
                  حفظ التغييرات في النظام
                </button>

                <button
                  type="button"
                  onClick={onLock}
                  className="text-stone-500 hover:text-red-700 font-semibold text-xs flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  قفل لوحة الإدارة
                </button>
              </div>

            </form>
          ) : (
            /* Backup & Security Tab */
            <div className="space-y-4 text-xs">
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-3">
                <strong className="block text-sm text-stone-900 font-bold font-arabic">
                  النسخ الاحتياطي لقاعدة البيانات والمستندات (Data Backup)
                </strong>
                <p className="text-stone-600">
                  يمكنك تصدير وتنزيل كافة الكتب الحكومية، قرارات التكليف، الفواتير المالية، وأخبار الأنشطة في ملف JSON مشفر لحفظها محلياً أو استعادتها في أي وقت.
                </p>
                
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={onExportBackup}
                    className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>تصدير نسخة احتياطية كاملة (JSON Export)</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 px-4 py-2 rounded-xl font-bold transition-all"
                  >
                    <Upload className="w-4 h-4 text-stone-600" />
                    <span>استعادة نسخة احتياطية (Restore JSON)</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={onImportBackup}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onLock}
                  className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>قفل لوحة الإدارة والخروج</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
