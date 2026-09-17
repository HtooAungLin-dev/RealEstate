export type TransactionType = 'sale' | 'rent' | 'all';

export type PropertyCategory = 'all' | 'condo' | 'hdb' | 'landed' | 'commercial';

export type TenureType = 'any' | 'freehold' | '99-year' | '999-year';

export type FurnishingType = 'any' | 'fully' | 'partially' | 'unfurnished';

export interface Agent {
  id: string;
  name: string;
  agency: string;
  ceaRegNo: string;
  phone: string;
  whatsapp: string;
  email: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  responseTime: string;
  experienceYears: number;
}

export interface Property {
  id: string;
  title: string;
  project: string;
  transactionType: 'sale' | 'rent';
  category: 'condo' | 'hdb' | 'landed' | 'commercial';
  price: number;
  formattedPrice: string;
  rentPerMonth?: number;
  pricePerSqft: number;
  bedrooms: number;
  bathrooms: number;
  floorAreaSqft: number;
  floorAreaSqm: number;
  district: string;
  districtName: string;
  address: string;
  postalCode: string;
  lat: number;
  lng: number;
  mrtStation: string;
  mrtDistanceMeters: number;
  mrtWalkMinutes: number;
  mrtLines: ('NSL' | 'EWL' | 'CCL' | 'DTL' | 'TEL' | 'NEL')[];
  tenure: 'Freehold' | '99-year Leasehold' | '999-year Leasehold';
  topYear: number;
  furnishing: 'Fully Furnished' | 'Partially Furnished' | 'Unfurnished';
  facing: string;
  floorLevel: 'Ground' | 'Low' | 'Mid' | 'High' | 'Penthouse';
  images: string[];
  description: string;
  features: string[];
  nearbySchools: string[];
  verifiedListing: boolean;
  virtualTourAvailable: boolean;
  developer?: string;
  maintenanceFeeMonthly?: number;
  agent: Agent;
  listedDate: string;
}

export interface FilterState {
  transactionType: TransactionType;
  category: PropertyCategory;
  keyword: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string; // 'all', 'studio', '1', '2', '3', '4', '5'
  bathrooms: string; // 'all', '1', '2', '3', '4'
  minSize: number;
  maxSize: number;
  tenure: TenureType;
  furnishing: FurnishingType;
  mrtMaxWalkMin: number;
  mrtLine: string; // 'all', 'NSL', 'EWL', 'CCL', 'DTL', 'TEL', 'NEL'
  district: string; // 'all', 'D01', 'D09', etc.
  verifiedOnly: boolean;
  virtualTourOnly: boolean;
  sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'psf_asc' | 'newest' | 'size_desc';
}

export interface SavedSearch {
  id: string;
  title: string;
  filters: Partial<FilterState>;
  frequency: 'instant' | 'daily' | 'weekly';
  createdAt: string;
  matchCount?: number;
  active: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  propertyId?: string;
  propertyTitle?: string;
  agentId?: string;
  suggestedViewingSlots?: string[];
}

export interface Conversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyPrice: string;
  agent: Agent;
  messages: ChatMessage[];
  lastUpdated: string;
  unreadCount: number;
}

export type SupportedLanguage = 'en' | 'zh' | 'ms' | 'ta';
