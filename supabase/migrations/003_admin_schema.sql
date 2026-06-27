-- ========================================
-- Admin Panel Schema
-- Jalankan di Supabase SQL Editor
-- ========================================

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Broadcast messages table
CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  sent_by UUID REFERENCES admin_users(id)
);

-- Insert default admin user
-- Password: admin123 (change in production!)
INSERT INTO admin_users (email, password_hash, name) 
VALUES ('admin@invoice.com', 'admin123', 'Admin')
ON CONFLICT (email) DO NOTHING;