export type DocumentCategory = 
  | 'mandate' 
  | 'government_letter' 
  | 'ministry_application' 
  | 'legal_notary' 
  | 'finance_invoice' 
  | 'hq_report';

export type DocumentStatus = 
  | 'draft' 
  | 'translated' 
  | 'submitted' 
  | 'approved' 
  | 'archived';

export interface OfficeDocument {
  id: string;
  refNumber: string;
  titleAr: string;
  titleBs: string;
  category: DocumentCategory;
  recipientAr?: string;
  recipientBs?: string;
  recipientOrg?: string; // e.g. "Ministarstvo pravde BiH"
  contentAr: string;
  contentBs: string;
  dateGregorian: string;
  dateHijri?: string;
  status: DocumentStatus;
  authorizedSignatoryAr: string;
  authorizedSignatoryBs: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  attachmentsCount?: number;
}

export interface InvoiceItem {
  id: string;
  descriptionAr: string;
  descriptionBs: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface FinanceInvoice {
  id: string;
  invoiceNumber: string;
  type: 'expense' | 'income' | 'budget_allocation';
  date: string;
  dueDate?: string;
  vendorNameAr: string;
  vendorNameBs: string;
  vendorTaxId?: string; // JIB/PIB in BiH
  category: 
    | 'legal_counsel' 
    | 'notary_court' 
    | 'translation_sworn' 
    | 'office_rent_deposit' 
    | 'government_fees' 
    | 'utilities_telecom' 
    | 'equipment_furniture' 
    | 'travel_hospitality' 
    | 'hq_remittance';
  currency: 'BAM' | 'EUR' | 'USD';
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number; // typically 17% in BiH or 0% for tax-exempt
  vatAmount: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'partially_paid';
  paymentMethod?: 'bank_transfer' | 'cash' | 'card';
  notesAr?: string;
  notesBs?: string;
  approvedByDirector: boolean;
  createdAt: string;
}

export interface RegionalActivity {
  id: string;
  titleAr: string;
  titleBs: string;
  date: string;
  location: string; // e.g. "Sarajevo", "Mostar", "Tuzla", "Zenica"
  category: 'humanitarian' | 'cultural' | 'dialogue' | 'educational' | 'diplomatic';
  summaryAr: string;
  summaryBs: string;
  detailsAr?: string;
  detailsBs?: string;
  imageUrl?: string;
  partnerOrganization?: string;
  published: boolean;
  createdAt: string;
}

export interface SetupMilestone {
  id: string;
  stepNumber: number;
  titleAr: string;
  titleBs: string;
  authority: string;
  status: 'completed' | 'in_progress' | 'pending';
  requiredDocsAr: string[];
  requiredDocsBs: string[];
  notesAr?: string;
  notesBs?: string;
}

export interface AppSettings {
  adminPin: string;
  directorNameAr: string;
  directorNameBs: string;
  directorTitleAr: string;
  directorTitleBs: string;
  sarajevoOfficeAddressAr: string;
  sarajevoOfficeAddressBs: string;
  contactEmail: string;
  contactPhone: string;
  hqEmail: string;
  currencyDefault: 'BAM' | 'EUR' | 'USD';
  customLogoUrl?: string;
  logoSizePx?: number;
  logoFrameStyle?: 'transparent' | 'white-card' | 'white-circle';
}

export interface StatItem {
  id: string;
  value: string;
  labelAr: string;
  labelBs: string;
}

export interface LandingPageConfig {
  topBadgeAr: string;
  topBadgeBs: string;
  orgNameAr: string;
  orgNameBs: string;
  subTitleAr: string;
  subTitleBs: string;
  heroDescriptionAr: string;
  heroDescriptionBs: string;
  heroImageUrl: string;
  heroImageCaptionAr: string;
  heroImageCaptionBs: string;
  showQuranVerse: boolean;
  quranVerseAr: string;
  quranVerseBs: string;
  quranCitationAr: string;
  quranCitationBs: string;
  stats: StatItem[];
  contactAddressAr: string;
  contactAddressBs: string;
  contactPhone: string;
  contactEmail: string;
  workingHoursWeekdays: string;
  workingHoursWeekendsAr: string;
  workingHoursWeekendsBs: string;
}

export interface BosnianMosque {
  id: string;
  nameAr: string;
  nameBs: string;
  cityAr: string;
  cityBs: string;
  yearBuilt: string;
  builderAr: string;
  builderBs: string;
  architectAr?: string;
  architectBs?: string;
  tagAr: string;
  tagBs: string;
  descriptionAr: string;
  descriptionBs: string;
  historicalSignificanceAr: string;
  historicalSignificanceBs: string;
  imageUrl: string;
  featuresAr: string[];
  featuresBs: string[];
}

export interface GalleryImage {
  id: string;
  titleAr: string;
  titleBs: string;
  category: 'mosque' | 'activity' | 'hero' | 'logo' | 'general';
  imageUrl: string;
  location?: string;
  descriptionAr?: string;
  descriptionBs?: string;
  tags?: string[];
  sizeKb?: number;
  uploadedAt: string;
  isBuiltIn?: boolean;
}

