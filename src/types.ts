export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profilePhotoUrl?: string;
  avatarId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bio?: string;
  profilePhotoUrl?: string;
  avatarId?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export enum ChallengeCategory {
  FITNESS = 'FITNESS',
  MINDFULNESS = 'MINDFULNESS',
  PRODUCTIVITY = 'PRODUCTIVITY',
  LIFESTYLE = 'LIFESTYLE',
  HEALTH = 'HEALTH',
  CODING = 'CODING',
  READING = 'READING',
  FINANCE = 'FINANCE',
  LEARNING = 'LEARNING',
  WRITING = 'WRITING',
  CREATIVITY = 'CREATIVITY'
}

export interface Challenge {
  id: number;
  name: string;
  description: string;
  category: ChallengeCategory;
  imageUrl?: string;
  rules: string;
  durationDays: number;
  entryFee: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  participantsCount?: number;
  isJoined?: boolean;
  // Campos de ubicación para el formulario de unirse
  location?: {
    latitude: number;
    longitude: number;
    locationName: string;
    toleranceRadius: number;
  };
}

export interface ChallengeCreation {
  name: string;
  description: string;
  category: ChallengeCategory;
  imageUrl?: string;
  rules: string;
  durationDays: number;
  entryFee: number;
  startDate: string;
  endDate: string;
  payment: PaymentData;
  location: LocationData;
}

export interface ChallengeJoin {
  payment: PaymentData;
  location: LocationData;
}

export interface ChallengeParticipant {
  id: number;
  name: string; // Cambiado de firstName + lastName a name
  email: string;
  joinedAt?: string;
  // Campos opcionales que pueden no estar en la respuesta del backend
  profilePhotoUrl?: string;
  avatarId?: string;
  firstName?: string; // Mantener para compatibilidad
  lastName?: string;  // Mantener para compatibilidad
}

export interface Payment {
  id: number;
  challengeId?: number;
  amount: number;
  currency: string;
  paymentMethodId: string;
  cardLast4: string;
  cardBrand: string;
  status: PaymentStatus;
  stripePaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface PaymentData {
  challengeId?: number;
  amount: number;
  currency: string;
  paymentMethodId: string;
  cardLast4: string;
  cardBrand: string;
}

export interface Location {
  id: number;
  challengeId?: number;
  latitude: number;
  longitude: number;
  locationName: string;
  toleranceRadius: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocationData {
  challengeId?: number;
  latitude: number;
  longitude: number;
  locationName: string;
  toleranceRadius: number;
}

export interface LocationVerification {
  challengeId: number;
  currentLatitude: number;
  currentLongitude: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserRegistration) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export interface ChallengeState {
  challenges: Challenge[];
  featuredChallenges: Challenge[];
  popularChallenges: Challenge[];
  currentChallenge: Challenge | null;
  loading: boolean;
  error: string | null;
}

export interface ChallengeContextType extends ChallengeState {
  fetchChallenges: () => Promise<void>;
  fetchFeaturedChallenges: () => Promise<void>;
  fetchPopularChallenges: () => Promise<void>;
  fetchChallengeById: (id: number) => Promise<void>;
  createChallenge: (challengeData: ChallengeCreation) => Promise<void>;
  joinChallenge: (id: number, joinData: ChallengeJoin) => Promise<void>;
  clearError: () => void;
}

export interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;
}

export interface PaymentContextType extends PaymentState {
  fetchPayments: () => Promise<void>;
  processPayment: (paymentData: PaymentData) => Promise<void>;
  getPaymentStatus: (challengeId: number) => Promise<PaymentStatus>;
  clearError: () => void;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'date';
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export interface FormState {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

export interface ChallengeFilters {
  category?: ChallengeCategory;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  search?: string;
  featured?: boolean;
  popular?: boolean;
}

export interface MapLocation {
  lat: number;
  lng: number;
  name: string;
  radius?: number;
}

export interface MapProps {
  center: MapLocation;
  markers?: MapLocation[];
  onLocationSelect?: (location: MapLocation) => void;
  className?: string;
}

// ===== EVIDENCE TYPES =====
export interface Evidence {
  id: number;
  challengeId: number;
  userId: number;
  imageUrl: string;
  description?: string;
  aiValidated: boolean;
  locationValid: boolean;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitEvidenceRequest {
  challengeId: number;
  imageUrl: string;
  description?: string;
  latitude: number;
  longitude: number;
}

export interface EvidenceResponse {
  id: number;
  challengeId: number;
  userId: number;
  imageUrl: string;
  description?: string;
  aiValidated: boolean;
  locationValid: boolean;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceStats {
  totalEvidences: number;
  aiValidated: number;
  locationValid: number;
  bothValid: number;
  aiSuccessRate: number;
  locationSuccessRate: number;
  overallSuccessRate: number;
}

export interface DailySubmissionStatus {
  challengeId: number;
  hasSubmittedToday: boolean;
  canSubmit: boolean;
  message: string;
  submissionWindow: string;
}

export interface EvidenceValidation {
  aiValidated: boolean;
  locationValid: boolean;
  fullyValid: boolean;
}

export interface SubmitEvidenceResponse {
  success: boolean;
  message: string;
  status: 'APPROVED' | 'REJECTED';
  evidence: EvidenceResponse;
  validation: EvidenceValidation;
  nextSubmission: string;
}

export interface EvidenceStatsResponse {
  userId: number;
  userName: string;
  statistics: {
    totalEvidences: number;
    aiValidated: number;
    locationValid: number;
    bothValid: number;
    successRates: {
      ai: number;
      location: number;
      overall: number;
    };
  };
  interpretation: {
    ai: string;
    location: string;
    overall: string;
  };
} 