export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

export interface AdminStats {
  totalUsers: number;
  totalInvoices: number;
  totalRevenue: number;
  activeLicenses: number;
}

export interface AdminLicense {
  id: string;
  key: string;
  user_id: string | null;
  is_active: boolean;
  activated_at: string | null;
  created_at: string;
}

export interface AdminBroadcast {
  id: string;
  message: string;
  sent_at: string;
}

export interface AdminUserData {
  id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  license_type: string;
  invoice_count_this_month: number;
  created_at: string;
}
