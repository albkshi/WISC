import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { OfficeDocument, FinanceInvoice, RegionalActivity, AppSettings, LandingPageConfig, BosnianMosque, GalleryImage } from './types';
import {
  initialDocuments,
  initialInvoices,
  initialActivities,
  initialSettings,
  initialLandingConfig,
  initialGalleryImages,
} from './initial-data';
import { historicBosnianMosques } from './mosques-data';

// Export configuration check
export const isFirebaseConfigured = Boolean(firebaseConfig && firebaseConfig.projectId);

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
});

// Initialize Firestore with specific database ID from config
export const db: Firestore = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// -------------------------------------------------------------
// SETTINGS
// -------------------------------------------------------------
export async function getSettingsFromFirestore(): Promise<AppSettings | null> {
  try {
    const docRef = doc(db, 'settings', 'app_settings');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as AppSettings;
    }
  } catch (error) {
    console.warn('[Firebase] Could not fetch settings from Firestore:', error);
  }
  return null;
}

export async function saveSettingsToFirestore(settings: AppSettings): Promise<boolean> {
  try {
    const docRef = doc(db, 'settings', 'app_settings');
    await setDoc(docRef, settings, { merge: true });
    return true;
  } catch (error) {
    console.error('[Firebase] Failed to save settings:', error);
    return false;
  }
}

// -------------------------------------------------------------
// LANDING PAGE & HERO CONFIG
// -------------------------------------------------------------
export async function getLandingConfigFromFirestore(): Promise<LandingPageConfig | null> {
  try {
    const docRef = doc(db, 'landing_config', 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as LandingPageConfig;
    }
  } catch (error) {
    console.warn('[Firebase] Could not fetch landing config from Firestore:', error);
  }
  return null;
}

export async function saveLandingConfigToFirestore(config: LandingPageConfig): Promise<boolean> {
  try {
    const docRef = doc(db, 'landing_config', 'main');
    await setDoc(docRef, config, { merge: true });
    return true;
  } catch (error) {
    console.error('[Firebase] Failed to save landing config:', error);
    return false;
  }
}

// -------------------------------------------------------------
// DOCUMENTS (LETTERS, MANDATE, ARCHIVE)
// -------------------------------------------------------------
export async function getDocumentsFromFirestore(): Promise<OfficeDocument[] | null> {
  try {
    const colRef = collection(db, 'documents');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const docs: OfficeDocument[] = [];
      snap.forEach((d) => {
        docs.push(d.data() as OfficeDocument);
      });
      return docs;
    }
  } catch (error) {
    console.warn('[Firebase] Could not fetch documents:', error);
  }
  return null;
}

export async function saveDocumentToFirestore(docData: OfficeDocument): Promise<boolean> {
  try {
    const docRef = doc(db, 'documents', docData.id);
    await setDoc(docRef, docData, { merge: true });
    return true;
  } catch (error) {
    console.error('[Firebase] Failed to save document:', error);
    return false;
  }
}

export async function deleteDocumentFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'documents', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('[Firebase] Failed to delete document:', error);
    return false;
  }
}

// -------------------------------------------------------------
// INVOICES & FINANCE
// -------------------------------------------------------------
export async function getInvoicesFromFirestore(): Promise<FinanceInvoice[] | null> {
  try {
    const colRef = collection(db, 'invoices');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const invs: FinanceInvoice[] = [];
      snap.forEach((d) => {
        invs.push(d.data() as FinanceInvoice);
      });
      return invs;
    }
  } catch (error) {
    console.warn('[Firebase] Could not fetch invoices:', error);
  }
  return null;
}

export async function saveInvoiceToFirestore(invoice: FinanceInvoice): Promise<boolean> {
  try {
    const docRef = doc(db, 'invoices', invoice.id);
    await setDoc(docRef, invoice, { merge: true });
    return true;
  } catch (error) {
    console.error('[Firebase] Failed to save invoice:', error);
    return false;
  }
}

export async function deleteInvoiceFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'invoices', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('[Firebase] Failed to delete invoice:', error);
    return false;
  }
}

// -------------------------------------------------------------
// REGIONAL ACTIVITIES & NEWS
// -------------------------------------------------------------
export async function getActivitiesFromFirestore(): Promise<RegionalActivity[] | null> {
  try {
    const colRef = collection(db, 'activities');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const acts: RegionalActivity[] = [];
      snap.forEach((d) => {
        acts.push(d.data() as RegionalActivity);
      });
      return acts;
    }
  } catch (error) {
    console.warn('[Firebase] Could not fetch activities:', error);
  }
  return null;
}

export async function saveActivityToFirestore(activity: RegionalActivity): Promise<boolean> {
  try {
    const docRef = doc(db, 'activities', activity.id);
    await setDoc(docRef, activity, { merge: true });
    return true;
  } catch (error) {
    console.error('[Firebase] Failed to save activity:', error);
    return false;
  }
}

export async function deleteActivityFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'activities', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('[Firebase] Failed to delete activity:', error);
    return false;
  }
}

// -------------------------------------------------------------
// LOGO UPLOAD HELPER
// -------------------------------------------------------------
export async function uploadLogoToFirestore(
  logoDataUrl: string | undefined,
  logoSizePx?: number,
  logoFrameStyle?: 'transparent' | 'white-card' | 'white-circle'
): Promise<boolean> {
  try {
    const docRef = doc(db, 'settings', 'app_settings');
    const updatePayload: Record<string, any> = { customLogoUrl: logoDataUrl || '' };
    if (logoSizePx !== undefined) updatePayload.logoSizePx = logoSizePx;
    if (logoFrameStyle !== undefined) updatePayload.logoFrameStyle = logoFrameStyle;
    await setDoc(docRef, updatePayload, { merge: true });
    return true;
  } catch (error) {
    console.error('[Firebase] Failed to upload logo:', error);
    return false;
  }
}

// -------------------------------------------------------------
// HISTORIC BOSNIAN MOSQUES (Firestore Collection)
// -------------------------------------------------------------
export async function getMosquesFromFirestore(): Promise<BosnianMosque[] | null> {
  try {
    const colRef = collection(db, 'mosques');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const mosques: BosnianMosque[] = [];
      snap.forEach((d) => {
        mosques.push(d.data() as BosnianMosque);
      });
      return mosques;
    }
  } catch (error) {
    console.warn('[Firebase] Could not fetch mosques from Firestore:', error);
  }
  return null;
}

export async function saveMosqueToFirestore(mosque: BosnianMosque): Promise<boolean> {
  try {
    const docRef = doc(db, 'mosques', mosque.id);
    await setDoc(docRef, mosque, { merge: true });
    return true;
  } catch (error) {
    console.error('[Firebase] Failed to save mosque:', error);
    return false;
  }
}

export async function updateMosqueImageInFirestore(mosqueId: string, imageUrl: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'mosques', mosqueId);
    await setDoc(docRef, { imageUrl }, { merge: true });
    return true;
  } catch (error) {
    console.error('[Firebase] Failed to update mosque image:', error);
    return false;
  }
}

// -------------------------------------------------------------
// GALLERY & MEDIA ASSETS (Firestore Collection)
// -------------------------------------------------------------
export async function getGalleryImagesFromFirestore(): Promise<GalleryImage[] | null> {
  try {
    const colRef = collection(db, 'gallery_images');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const images: GalleryImage[] = [];
      snap.forEach((d) => {
        images.push(d.data() as GalleryImage);
      });
      // Sort newest first
      return images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    }
  } catch (error) {
    console.warn('[Firebase] Could not fetch gallery images from Firestore:', error);
  }
  return null;
}

export async function saveGalleryImageToFirestore(image: GalleryImage): Promise<boolean> {
  try {
    const docRef = doc(db, 'gallery_images', image.id);
    await setDoc(docRef, image, { merge: true });
    return true;
  } catch (error) {
    console.error('[Firebase] Failed to save gallery image:', error);
    return false;
  }
}

export async function deleteGalleryImageFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'gallery_images', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('[Firebase] Failed to delete gallery image:', error);
    return false;
  }
}

// -------------------------------------------------------------
// SEEDING HELPER (Uploads initial data to Firestore if empty)
// -------------------------------------------------------------
export async function seedFirestoreIfEmpty(
  docsToSeed: OfficeDocument[] = initialDocuments,
  invsToSeed: FinanceInvoice[] = initialInvoices,
  actsToSeed: RegionalActivity[] = initialActivities,
  settsToSeed: AppSettings = initialSettings,
  landingToSeed: LandingPageConfig = initialLandingConfig,
  mosquesToSeed: BosnianMosque[] = historicBosnianMosques,
  galleryToSeed: GalleryImage[] = initialGalleryImages
): Promise<void> {
  try {
    const docs = await getDocumentsFromFirestore();
    if (!docs || docs.length === 0) {
      for (const d of docsToSeed) {
        await saveDocumentToFirestore(d);
      }
    }

    const invs = await getInvoicesFromFirestore();
    if (!invs || invs.length === 0) {
      for (const inv of invsToSeed) {
        await saveInvoiceToFirestore(inv);
      }
    }

    const acts = await getActivitiesFromFirestore();
    if (!acts || acts.length === 0) {
      for (const act of actsToSeed) {
        await saveActivityToFirestore(act);
      }
    }

    const s = await getSettingsFromFirestore();
    if (!s) {
      await saveSettingsToFirestore(settsToSeed);
    }

    const l = await getLandingConfigFromFirestore();
    if (!l) {
      await saveLandingConfigToFirestore(landingToSeed);
    }

    const m = await getMosquesFromFirestore();
    if (!m || m.length === 0) {
      for (const mosque of mosquesToSeed) {
        await saveMosqueToFirestore(mosque);
      }
    }

    const g = await getGalleryImagesFromFirestore();
    if (!g || g.length === 0) {
      for (const img of galleryToSeed) {
        await saveGalleryImageToFirestore(img);
      }
    }
  } catch (err) {
    console.warn('[Firebase] Seed check failed or completed with notices:', err);
  }
}


