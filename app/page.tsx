'use client';

import React from 'react';
import { 
  OfficeDocument, 
  FinanceInvoice, 
  RegionalActivity, 
  SetupMilestone, 
  AppSettings,
  LandingPageConfig,
  BosnianMosque,
  GalleryImage
} from '@/lib/types';
import { 
  initialDocuments, 
  initialInvoices, 
  initialActivities, 
  initialMilestones, 
  initialSettings,
  initialLandingConfig,
  initialGalleryImages
} from '@/lib/initial-data';
import { historicBosnianMosques } from '@/lib/mosques-data';
import {
  isFirebaseConfigured,
  seedFirestoreIfEmpty,
  getSettingsFromFirestore,
  saveSettingsToFirestore,
  getDocumentsFromFirestore,
  saveDocumentToFirestore,
  deleteDocumentFromFirestore,
  getInvoicesFromFirestore,
  saveInvoiceToFirestore,
  deleteInvoiceFromFirestore,
  getActivitiesFromFirestore,
  saveActivityToFirestore,
  deleteActivityFromFirestore,
  getLandingConfigFromFirestore,
  saveLandingConfigToFirestore,
  uploadLogoToFirestore,
  getMosquesFromFirestore,
  saveMosqueToFirestore,
  updateMosqueImageInFirestore,
  getGalleryImagesFromFirestore,
  saveGalleryImageToFirestore,
  deleteGalleryImageFromFirestore,
} from '@/lib/firebase';

import Navbar, { TabType } from '@/components/Navbar';
import LandingPage from '@/components/LandingPage';
import LandingEditor from '@/components/LandingEditor';
import MediaGallery from '@/components/MediaGallery';
import DashboardOverview from '@/components/DashboardOverview';
import GovernmentLetters from '@/components/GovernmentLetters';
import InvoicesFinance from '@/components/InvoicesFinance';
import RegionalActivities from '@/components/RegionalActivities';
import DocumentArchive from '@/components/DocumentArchive';
import LetterWriterModal from '@/components/LetterWriterModal';
import InvoiceModal from '@/components/InvoiceModal';
import ActivityModal from '@/components/ActivityModal';
import AdminLockModal from '@/components/AdminLockModal';
import MandatePaperModal from '@/components/MandatePaperModal';
import PrintableDocument from '@/components/PrintableDocument';

import { Loader2, CheckCircle2, AlertCircle, CloudCheck } from 'lucide-react';

export default function App() {
  // Navigation State - Defaults to Landing Page (public view) or 'dashboard' if ?idara is present
  const [activeTab, setActiveTab] = React.useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('idara') || window.location.hash === '#idara') {
        return 'dashboard';
      }
    }
    return 'landing';
  });

  // Application Data States
  const [documents, setDocuments] = React.useState<OfficeDocument[]>(initialDocuments);
  const [invoices, setInvoices] = React.useState<FinanceInvoice[]>(initialInvoices);
  const [activities, setActivities] = React.useState<RegionalActivity[]>(initialActivities);
  const [milestones, setMilestones] = React.useState<SetupMilestone[]>(initialMilestones);
  const [settings, setSettings] = React.useState<AppSettings>(initialSettings);
  const [landingConfig, setLandingConfig] = React.useState<LandingPageConfig>(initialLandingConfig);
  const [mosques, setMosques] = React.useState<BosnianMosque[]>(historicBosnianMosques);
  const [galleryImages, setGalleryImages] = React.useState<GalleryImage[]>(initialGalleryImages);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFirebaseSynced, setIsFirebaseSynced] = React.useState(false);

  // Admin Authentication
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('wics_admin_auth') === 'true';
    }
    return false;
  });

  // Modals
  const [isMandateModalOpen, setIsMandateModalOpen] = React.useState(false);
  const [isLetterModalOpen, setIsLetterModalOpen] = React.useState(false);
  const [letterToEdit, setLetterToEdit] = React.useState<OfficeDocument | null>(null);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = React.useState<FinanceInvoice | null>(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = React.useState(false);
  const [activityToEdit, setActivityToEdit] = React.useState<RegionalActivity | null>(null);

  const [isAdminModalOpen, setIsAdminModalOpen] = React.useState(false);

  // Print Preview
  const [printTarget, setPrintTarget] = React.useState<{
    type: 'document' | 'invoice';
    doc?: OfficeDocument;
    inv?: FinanceInvoice;
  } | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load from Google Firebase or Local Storage on initial mount
  React.useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        if (isFirebaseConfigured) {
          // Initialize and seed firestore if empty
          await seedFirestoreIfEmpty();

          // Fetch all collections from Firestore
          const [fbSettings, fbLanding, fbDocs, fbInvs, fbActs, fbMosques, fbGallery] = await Promise.all([
            getSettingsFromFirestore(),
            getLandingConfigFromFirestore(),
            getDocumentsFromFirestore(),
            getInvoicesFromFirestore(),
            getActivitiesFromFirestore(),
            getMosquesFromFirestore(),
            getGalleryImagesFromFirestore(),
          ]);

          if (fbSettings) setSettings(fbSettings);
          if (fbLanding) setLandingConfig(fbLanding);
          if (fbDocs && fbDocs.length > 0) setDocuments(fbDocs);
          if (fbInvs && fbInvs.length > 0) setInvoices(fbInvs);
          if (fbActs && fbActs.length > 0) setActivities(fbActs);
          if (fbMosques && fbMosques.length > 0) setMosques(fbMosques);
          if (fbGallery && fbGallery.length > 0) setGalleryImages(fbGallery);

          setIsFirebaseSynced(true);
        } else {
          // Fallback to local storage endpoint
          const res = await fetch('/api/storage');
          if (res.ok) {
            const data = await res.json();
            if (data.documents?.length) setDocuments(data.documents);
            if (data.invoices?.length) setInvoices(data.invoices);
            if (data.activities?.length) setActivities(data.activities);
            if (data.milestones?.length) setMilestones(data.milestones);
            if (data.settings) setSettings(data.settings);
          }
        }
      } catch (err) {
        console.warn('Firebase sync load error, using local fallback:', err);
        try {
          const res = await fetch('/api/storage');
          if (res.ok) {
            const data = await res.json();
            if (data.documents?.length) setDocuments(data.documents);
            if (data.invoices?.length) setInvoices(data.invoices);
            if (data.activities?.length) setActivities(data.activities);
            if (data.milestones?.length) setMilestones(data.milestones);
            if (data.settings) setSettings(data.settings);
          }
        } catch (e) {
          console.error('Local fallback failed:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Sync back to storage API helper
  const persistChanges = async (
    newDocs = documents,
    newInvs = invoices,
    newActs = activities,
    newSets = settings,
    newMiles = milestones
  ) => {
    try {
      await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: newDocs,
          invoices: newInvs,
          activities: newActs,
          settings: newSets,
          milestones: newMiles,
        }),
      });
    } catch (err) {
      console.error('Failed to sync to database:', err);
    }
  };

  // Save Document (Letter / Application) to Firestore & Local Storage
  const handleSaveDocument = async (savedDoc: OfficeDocument) => {
    let updatedDocs: OfficeDocument[];
    const exists = documents.some((d) => d.id === savedDoc.id);
    if (exists) {
      updatedDocs = documents.map((d) => (d.id === savedDoc.id ? savedDoc : d));
    } else {
      updatedDocs = [savedDoc, ...documents];
    }
    setDocuments(updatedDocs);
    persistChanges(updatedDocs, invoices, activities, settings, milestones);

    // Save directly to Firebase Firestore
    try {
      await saveDocumentToFirestore(savedDoc);
    } catch (err) {
      console.error('Failed to save document to Firebase:', err);
    }

    showToast(`تم حفظ الوثيقة [${savedDoc.refNumber}] بنجاح`);
  };

  // Delete Document from Firestore & Local Storage
  const handleDeleteDocument = async (id: string) => {
    if (!isAdminAuthenticated) {
      setIsAdminModalOpen(true);
      showToast('يرجى تسجيل دخول المفوض لحذف المستندات');
      return;
    }
    if (window.confirm('هل أنت متأكد من حذف هذه الوثيقة من السجل؟')) {
      const updated = documents.filter((d) => d.id !== id);
      setDocuments(updated);
      persistChanges(updated, invoices, activities, settings, milestones);

      // Delete from Firebase Firestore
      try {
        await deleteDocumentFromFirestore(id);
      } catch (err) {
        console.error('Failed to delete document from Firebase:', err);
      }

      showToast('تم حذف الوثيقة من السجل بنجاح');
    }
  };

  // Save Invoice to Firestore & Local Storage
  const handleSaveInvoice = async (savedInv: FinanceInvoice) => {
    let updatedInvs: FinanceInvoice[];
    const exists = invoices.some((i) => i.id === savedInv.id);
    if (exists) {
      updatedInvs = invoices.map((i) => (i.id === savedInv.id ? savedInv : i));
    } else {
      updatedInvs = [savedInv, ...invoices];
    }
    setInvoices(updatedInvs);
    persistChanges(documents, updatedInvs, activities, settings, milestones);

    // Save directly to Firebase Firestore
    try {
      await saveInvoiceToFirestore(savedInv);
    } catch (err) {
      console.error('Failed to save invoice to Firebase:', err);
    }

    showToast(`تم حفظ الفاتورة [${savedInv.invoiceNumber}] في سجل المالية`);
  };

  // Delete Invoice from Firestore & Local Storage
  const handleDeleteInvoice = async (id: string) => {
    if (!isAdminAuthenticated) {
      setIsAdminModalOpen(true);
      showToast('يرجى تسجيل دخول المفوض لحذف الفواتير');
      return;
    }
    if (window.confirm('هل أنت متأكد من حذف هذا السند المالي؟')) {
      const updated = invoices.filter((i) => i.id !== id);
      setInvoices(updated);
      persistChanges(documents, updated, activities, settings, milestones);

      // Delete from Firebase Firestore
      try {
        await deleteInvoiceFromFirestore(id);
      } catch (err) {
        console.error('Failed to delete invoice from Firebase:', err);
      }

      showToast('تم حذف الفاتورة من السجل المالي');
    }
  };

  // Save Regional Activity to Firestore & Local Storage
  const handleSaveActivity = async (savedAct: RegionalActivity) => {
    let updatedActs: RegionalActivity[];
    const exists = activities.some((a) => a.id === savedAct.id);
    if (exists) {
      updatedActs = activities.map((a) => (a.id === savedAct.id ? savedAct : a));
    } else {
      updatedActs = [savedAct, ...activities];
    }
    setActivities(updatedActs);
    persistChanges(documents, invoices, updatedActs, settings, milestones);

    // Save directly to Firebase Firestore
    try {
      await saveActivityToFirestore(savedAct);
    } catch (err) {
      console.error('Failed to save activity to Firebase:', err);
    }

    showToast('تم حفظ ونشر النشاط الإقليمي بنجاح');
  };

  // Delete Regional Activity from Firestore & Local Storage
  const handleDeleteActivity = async (id: string) => {
    if (!isAdminAuthenticated) {
      setIsAdminModalOpen(true);
      showToast('يرجى تسجيل دخول المفوض لحذف الأنشطة');
      return;
    }
    if (window.confirm('هل أنت متأكد من حذف هذا النشاط؟')) {
      const updated = activities.filter((a) => a.id !== id);
      setActivities(updated);
      persistChanges(documents, invoices, updated, settings, milestones);

      // Delete from Firebase Firestore
      try {
        await deleteActivityFromFirestore(id);
      } catch (err) {
        console.error('Failed to delete activity from Firebase:', err);
      }

      showToast('تم حذف النشاط من لوحة الأخبار');
    }
  };

  // Update Settings in Firestore & Local Storage
  const handleUpdateSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    persistChanges(documents, invoices, activities, newSettings, milestones);

    try {
      await saveSettingsToFirestore(newSettings);
    } catch (err) {
      console.error('Failed to save settings to Firebase:', err);
    }

    showToast('تم تحديث بيانات الفرع والمفوض الرسمي بنجاح');
  };

  // Save Landing Page Configuration in Firestore
  const handleSaveLandingConfig = async (updatedConfig: LandingPageConfig): Promise<boolean> => {
    try {
      setLandingConfig(updatedConfig);
      await saveLandingConfigToFirestore(updatedConfig);
      showToast('تم حفظ جميع تعديلات الصفحة الرئيسية بنجاح!');
      return true;
    } catch (err) {
      console.error('Error saving landing config to Firebase:', err);
      showToast('خطأ في حفظ تعديلات الصفحة');
      return false;
    }
  };

  // Save Uploaded Logo & Sizing in Firestore Settings
  const handleSaveLogo = async (
    logoDataUrl: string | undefined, 
    logoSizePx?: number, 
    logoFrameStyle?: 'transparent' | 'white-card' | 'white-circle'
  ): Promise<boolean> => {
    try {
      const updatedSettings: AppSettings = { 
        ...settings, 
        customLogoUrl: logoDataUrl !== undefined ? logoDataUrl : settings.customLogoUrl,
        logoSizePx: logoSizePx !== undefined ? logoSizePx : (settings.logoSizePx || 52),
        logoFrameStyle: logoFrameStyle || settings.logoFrameStyle || 'transparent',
      };
      setSettings(updatedSettings);
      persistChanges(documents, invoices, activities, updatedSettings, milestones);
      await uploadLogoToFirestore(
        updatedSettings.customLogoUrl, 
        updatedSettings.logoSizePx, 
        updatedSettings.logoFrameStyle
      );
      showToast('تم حفظ وتطبيق إعدادات الشعار والحجم بنجاح!');
      return true;
    } catch (err) {
      console.error('Error saving logo:', err);
      showToast('خطأ في حفظ الشعار');
      return false;
    }
  };

  // Reset Landing Configuration to Defaults
  const handleResetLandingConfig = async () => {
    if (window.confirm('هل أنت متأكد من استعادة النصوص والإعدادات الافتراضية للصفحة الرئيسية؟')) {
      setLandingConfig(initialLandingConfig);
      await saveLandingConfigToFirestore(initialLandingConfig);
      showToast('تمت استعادة إعدادات الصفحة الرئيسية الافتراضية بنجاح');
    }
  };

  // Update Mosque Image in Firebase
  const handleUpdateMosqueImage = async (mosqueId: string, newImageUrl: string): Promise<boolean> => {
    try {
      setMosques(prev => prev.map(m => m.id === mosqueId ? { ...m, imageUrl: newImageUrl } : m));
      await updateMosqueImageInFirestore(mosqueId, newImageUrl);
      showToast('تم تحديث صورة المسجد وربطها بسحابة فايربيس بنجاح');
      return true;
    } catch (err) {
      console.error('Error updating mosque image in Firebase:', err);
      showToast('خطأ في تحديث صورة المسجد');
      return false;
    }
  };

  // Save / Upload Gallery Image to Firebase
  const handleSaveGalleryImage = async (image: GalleryImage): Promise<boolean> => {
    try {
      setGalleryImages(prev => {
        const exists = prev.some(img => img.id === image.id);
        if (exists) {
          return prev.map(img => img.id === image.id ? image : img);
        }
        return [image, ...prev];
      });
      await saveGalleryImageToFirestore(image);
      showToast('تم حفظ الصورة في مكتبة الوسائط وسحابة فايربيس بنجاح');
      return true;
    } catch (err) {
      console.error('Error saving gallery image to Firebase:', err);
      showToast('خطأ في حفظ الصورة');
      return false;
    }
  };

  // Delete Gallery Image from Firebase
  const handleDeleteGalleryImage = async (imageId: string): Promise<boolean> => {
    try {
      setGalleryImages(prev => prev.filter(img => img.id !== imageId));
      await deleteGalleryImageFromFirestore(imageId);
      showToast('تم حذف الصورة من مكتبة فايربيس');
      return true;
    } catch (err) {
      console.error('Error deleting gallery image from Firebase:', err);
      showToast('خطأ في حذف الصورة');
      return false;
    }
  };

  // Set Hero Image from Media Gallery
  const handleSetHeroImage = async (imageUrl: string): Promise<boolean> => {
    const updated = { ...landingConfig, heroImageUrl: imageUrl };
    return handleSaveLandingConfig(updated);
  };

  // Set Official Logo from Media Gallery
  const handleSetLogo = async (imageUrl: string): Promise<boolean> => {
    return handleSaveLogo(imageUrl);
  };

  // Admin Auth Handlers
  const handleAdminAuthenticate = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('wics_admin_auth', 'true');
    showToast('تم تفعيل صلاحيات المفوض الرسمي بنجاح');
  };

  const handleAdminLock = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('wics_admin_auth');
    setIsAdminModalOpen(false);
    showToast('تم قفل بوابة الإدارة');
  };

  // Export Full Database
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      organization: 'World Islamic Call Society - Sarajevo Branch',
      documents,
      invoices,
      activities,
      milestones,
      settings,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `WICS_Sarajevo_Database_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('تم تصدير نسخة احتياطية كاملة لقاعدة البيانات');
  };

  // Import Database
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.documents) setDocuments(imported.documents);
        if (imported.invoices) setInvoices(imported.invoices);
        if (imported.activities) setActivities(imported.activities);
        if (imported.settings) setSettings(imported.settings);
        if (imported.milestones) setMilestones(imported.milestones);
        persistChanges(
          imported.documents || documents,
          imported.invoices || invoices,
          imported.activities || activities,
          imported.settings || settings,
          imported.milestones || milestones
        );
        showToast('تمت استعادة قاعدة البيانات بنجاح!');
        setIsAdminModalOpen(false);
      } catch (err) {
        alert('خطأ في قراءة ملف النسخة الاحتياطية. يرجى التأكد من صحة الملف.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col selection:bg-emerald-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-stone-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminAuthenticated={isAdminAuthenticated}
        customLogoUrl={settings.customLogoUrl}
        logoSizePx={settings.logoSizePx || 52}
        logoFrameStyle={settings.logoFrameStyle || 'transparent'}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenMandateModal={() => setIsMandateModalOpen(true)}
        onOpenNewLetter={() => {
          setLetterToEdit(null);
          setIsLetterModalOpen(true);
        }}
        onOpenNewInvoice={() => {
          setInvoiceToEdit(null);
          setIsInvoiceModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      {activeTab === 'landing' ? (
        <main className="flex-1 w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
              <p className="text-xs text-stone-600 font-arabic font-semibold">
                جاري تحميل محتوى الموقع...
              </p>
            </div>
          ) : (
            <LandingPage
              activities={activities}
              settings={settings}
              landingConfig={landingConfig}
              mosques={mosques}
            />
          )}
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
              <p className="text-xs text-stone-600 font-arabic font-semibold">
                جاري تحميل قاعدة بيانات فرع سراييفو...
              </p>
            </div>
          ) : (
            <>
              {/* Tab 1: Dashboard & Roadmap */}
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  documents={documents}
                  invoices={invoices}
                  activities={activities}
                  milestones={milestones}
                  settings={settings}
                  onOpenMandateModal={() => setIsMandateModalOpen(true)}
                  onOpenNewLetter={() => {
                    setLetterToEdit(null);
                    setIsLetterModalOpen(true);
                  }}
                  onOpenNewInvoice={() => {
                    setInvoiceToEdit(null);
                    setIsInvoiceModalOpen(true);
                  }}
                  onViewDocument={(doc) => {
                    setLetterToEdit(doc);
                    setIsLetterModalOpen(true);
                  }}
                  onPrintDocument={(doc) => setPrintTarget({ type: 'document', doc })}
                  onViewInvoice={(inv) => {
                    setInvoiceToEdit(inv);
                    setIsInvoiceModalOpen(true);
                  }}
                  onPrintInvoice={(inv) => setPrintTarget({ type: 'invoice', inv })}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {/* Tab 2: Letters & Government Correspondence */}
              {activeTab === 'letters' && (
                <GovernmentLetters
                  documents={documents}
                  onOpenNewLetter={() => {
                    setLetterToEdit(null);
                    setIsLetterModalOpen(true);
                  }}
                  onEditDocument={(doc) => {
                    setLetterToEdit(doc);
                    setIsLetterModalOpen(true);
                  }}
                  onPrintDocument={(doc) => setPrintTarget({ type: 'document', doc })}
                  onDeleteDocument={handleDeleteDocument}
                />
              )}

              {/* Tab 3: Financial Invoices & Expenses */}
              {activeTab === 'finances' && (
                <InvoicesFinance
                  invoices={invoices}
                  onOpenNewInvoice={() => {
                    setInvoiceToEdit(null);
                    setIsInvoiceModalOpen(true);
                  }}
                  onEditInvoice={(inv) => {
                    setInvoiceToEdit(inv);
                    setIsInvoiceModalOpen(true);
                  }}
                  onPrintInvoice={(inv) => setPrintTarget({ type: 'invoice', inv })}
                  onDeleteInvoice={handleDeleteInvoice}
                />
              )}

              {/* Tab 4: Unified Archive & Database */}
              {activeTab === 'archive' && (
                <DocumentArchive
                  documents={documents}
                  invoices={invoices}
                  onPrintDocument={(doc) => setPrintTarget({ type: 'document', doc })}
                  onPrintInvoice={(inv) => setPrintTarget({ type: 'invoice', inv })}
                  onViewDocument={(doc) => {
                    setLetterToEdit(doc);
                    setIsLetterModalOpen(true);
                  }}
                  onViewInvoice={(inv) => {
                    setInvoiceToEdit(inv);
                    setIsInvoiceModalOpen(true);
                  }}
                  onExportAll={handleExportBackup}
                />
              )}

              {/* Tab 5: Regional Activities & News */}
              {activeTab === 'activities' && (
                <RegionalActivities
                  activities={activities}
                  onOpenNewActivity={() => {
                    setActivityToEdit(null);
                    setIsActivityModalOpen(true);
                  }}
                  onEditActivity={(act) => {
                    setActivityToEdit(act);
                    setIsActivityModalOpen(true);
                  }}
                  onDeleteActivity={handleDeleteActivity}
                />
              )}

              {/* Tab 6: Landing Page Content & Logo Editor */}
              {activeTab === 'landing-editor' && (
                <LandingEditor
                  config={landingConfig}
                  settings={settings}
                  onSaveConfig={handleSaveLandingConfig}
                  onSaveLogo={handleSaveLogo}
                  onResetDefault={handleResetLandingConfig}
                />
              )}

              {/* Tab 7: Media Gallery & Upload (Linked with Firebase) */}
              {activeTab === 'media-gallery' && (
                <MediaGallery
                  images={galleryImages}
                  mosques={mosques}
                  landingConfig={landingConfig}
                  settings={settings}
                  onUploadImage={handleSaveGalleryImage}
                  onDeleteImage={handleDeleteGalleryImage}
                  onSetHeroImage={handleSetHeroImage}
                  onSetLogoImage={handleSetLogo}
                  onUpdateMosqueImage={handleUpdateMosqueImage}
                  onShowToast={showToast}
                />
              )}
            </>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-slate-100 text-slate-600 text-xs py-10 border-t border-slate-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-right">
            <div className="font-arabic font-bold text-slate-900 text-sm">
              جمعية الدعوة الإسلامية العالمية • فرع البوسنة والهرسك - سراييفو
            </div>
            <div className="text-[11px] text-slate-500 font-sans">
              World Islamic Call Society (WICS) • Representation in Sarajevo, Bosnia & Herzegovina
            </div>
            <div className="text-[11px] text-slate-400 font-arabic pt-1">
              © {new Date().getFullYear()} جميع الحقوق محفوظة لجمعية الدعوة الإسلامية العالمية.
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-4 text-xs font-arabic text-slate-600">
              <a href="#hero" className="hover:text-blue-700 transition-colors">الرئيسية</a>
              <span>•</span>
              <a href="#mosques" className="hover:text-blue-700 transition-colors">مساجد البوسنة</a>
              <span>•</span>
              <a href="#news" className="hover:text-blue-700 transition-colors">الأخبار</a>
              <span>•</span>
              <a href="#contact" className="hover:text-blue-700 transition-colors">اتصل بنا</a>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <span>Sarajevo • sarajevo@wics.org</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      
      {/* 1. Mandate Paper Viewer */}
      {isMandateModalOpen && (
        <MandatePaperModal
          document={documents.find((d) => d.category === 'mandate') || documents[0]}
          settings={settings}
          onClose={() => setIsMandateModalOpen(false)}
          onPrint={() => {
            const mandateDoc = documents.find((d) => d.category === 'mandate') || documents[0];
            setIsMandateModalOpen(false);
            setPrintTarget({ type: 'document', doc: mandateDoc });
          }}
        />
      )}

      {/* 2. Letter Drafting & Translation Modal */}
      {isLetterModalOpen && (
        <LetterWriterModal
          documentToEdit={letterToEdit}
          settings={settings}
          onSave={handleSaveDocument}
          onClose={() => {
            setIsLetterModalOpen(false);
            setLetterToEdit(null);
          }}
          onPrintAfterSave={(doc) => {
            setIsLetterModalOpen(false);
            setLetterToEdit(null);
            setPrintTarget({ type: 'document', doc });
          }}
        />
      )}

      {/* 3. Invoice & Expense Modal */}
      {isInvoiceModalOpen && (
        <InvoiceModal
          invoiceToEdit={invoiceToEdit}
          settings={settings}
          onSave={handleSaveInvoice}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setInvoiceToEdit(null);
          }}
          onPrintAfterSave={(inv) => {
            setIsInvoiceModalOpen(false);
            setInvoiceToEdit(null);
            setPrintTarget({ type: 'invoice', inv });
          }}
        />
      )}

      {/* 4. Regional Activity Modal */}
      {isActivityModalOpen && (
        <ActivityModal
          activityToEdit={activityToEdit}
          onSave={handleSaveActivity}
          onClose={() => {
            setIsActivityModalOpen(false);
            setActivityToEdit(null);
          }}
        />
      )}

      {/* 5. Admin Lock & Settings Modal */}
      <AdminLockModal
        isOpen={isAdminModalOpen}
        isAdminAuthenticated={isAdminAuthenticated}
        settings={settings}
        onAuthenticate={handleAdminAuthenticate}
        onLock={handleAdminLock}
        onUpdateSettings={handleUpdateSettings}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* 6. A4 Printable Document Overlay */}
      {printTarget && (
        <PrintableDocument
          document={printTarget.doc}
          invoice={printTarget.inv}
          settings={settings}
          onClose={() => setPrintTarget(null)}
        />
      )}

    </div>
  );
}
