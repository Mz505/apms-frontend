export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Pharmacist';
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Medicine {
  _id: string;
  name: string;
  barcode?: string;
  category: 'Antibiotics' | 'Painkillers' | 'Supplements' | 'Vaccines' | 'Antiseptics' | 'Cardiovascular' | 'Respiratory' | 'Digestive' | 'Neurological' | 'Other';
  quantity: number;
  minQuantity: number;
  price: number;
  expiryDate: Date;
  supplier?: string;
  batchNumber?: string;
  description?: string;
  isActive: boolean;
  createdBy: User;
  updatedBy?: User;
  createdAt: Date;
  updatedAt: Date;
  isLowStock: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;

  // ✅ Add these two fields:
  initialStock: number;
  stockOut?: number; // optional because it's computed in frontend
}

export interface Issuance {
  _id: string;
  medicineId: Medicine;
  issuedTo: 'GIZ Guest' | 'AZI Guest' | 'Employee';
  recipientName: string;
  recipientID: string;
  quantityIssued: number;
  prescribedBy: string;
  notes?: string;
  issuedBy: User;
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  _id: string;
  actionType: 'Add' | 'Update' | 'Delete' | 'Issue' | 'Login' | 'Logout' | 'Stock In' | 'Stock Out';
  entityType: 'Medicine' | 'User' | 'Issuance' | 'System';
  entityId: string;
  performedBy: User;
  description: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface Alert {
  _id: string;
  type: 'user_added' | 'stock_low' | 'medicine_expiring' | 'medicine_expired' | 'stock_entry' | 'medicine_issued' | 'user_deleted' | 'medicine_added' | 'system';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  entityType: 'User' | 'Medicine' | 'Issuance' | 'System';
  entityId: string;
  triggeredBy: User;
  isRead: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalMedicines: number;
  totalUsers: number;
  lowStockMedicines: number;
  expiringMedicines: number;
  todayIssuances: number;
  monthlyIssuances: number;
  totalStockValue: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}