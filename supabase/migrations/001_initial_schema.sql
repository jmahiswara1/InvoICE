-- ========================================
-- Invoice App — Supabase Schema
-- Jalankan di Supabase SQL Editor
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- USERS
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  business_name TEXT,
  address TEXT,
  phone TEXT,
  currency TEXT DEFAULT 'IDR',
  language TEXT DEFAULT 'id',
  tax_rate REAL DEFAULT 11,
  invoice_prefix TEXT DEFAULT 'INV',
  invoice_format TEXT DEFAULT '{prefix}/{code}/{year}/{seq}',
  license_type TEXT DEFAULT 'free',
  license_key TEXT,
  license_activated_at TIMESTAMPTZ,
  invoice_count_this_month INTEGER DEFAULT 0,
  invoice_month_reset DATE,
  stripe_customer_id TEXT,
  synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================
-- CLIENTS
-- ========================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  local_id INTEGER,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  notes TEXT,
  deleted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_local_id ON clients(local_id);
CREATE INDEX IF NOT EXISTS idx_clients_updated_at ON clients(updated_at);

-- ========================================
-- INVOICES
-- ========================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  local_id INTEGER,
  client_local_id INTEGER,
  invoice_number TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  template TEXT DEFAULT 'minimalis',
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  currency TEXT DEFAULT 'IDR',
  exchange_rate REAL DEFAULT 1,
  subtotal REAL DEFAULT 0,
  discount_type TEXT DEFAULT 'none',
  discount_value REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  tax_enabled INTEGER DEFAULT 1,
  tax_rate REAL DEFAULT 11,
  tax_amount REAL DEFAULT 0,
  shipping_cost REAL DEFAULT 0,
  total REAL DEFAULT 0,
  notes TEXT,
  terms TEXT,
  is_recurring INTEGER DEFAULT 0,
  recurring_interval TEXT,
  recurring_next_date DATE,
  paid_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_local_id ON invoices(local_id);
CREATE INDEX IF NOT EXISTS idx_invoices_updated_at ON invoices(updated_at);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- ========================================
-- INVOICE ITEMS
-- ========================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_local_id INTEGER,
  local_id INTEGER,
  description TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL,
  amount REAL NOT NULL,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  synced_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_local_id ON invoice_items(invoice_local_id);

-- ========================================
-- LICENSES
-- ========================================
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(key);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Users: can read/update own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Clients: can CRUD own data
CREATE POLICY "Users can view own clients" ON clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON clients
  FOR DELETE USING (auth.uid() = user_id);

-- Invoices: can CRUD own data
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON invoices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices" ON invoices
  FOR DELETE USING (auth.uid() = user_id);

-- Invoice Items: can CRUD via parent invoice
CREATE POLICY "Users can view own invoice items" ON invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.local_id = invoice_items.invoice_local_id 
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own invoice items" ON invoice_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.local_id = invoice_items.invoice_local_id 
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own invoice items" ON invoice_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.local_id = invoice_items.invoice_local_id 
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own invoice items" ON invoice_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.local_id = invoice_items.invoice_local_id 
      AND invoices.user_id = auth.uid()
    )
  );

-- Licenses: anyone can read (for validation), only service role can insert/update
CREATE POLICY "Anyone can view licenses" ON licenses
  FOR SELECT USING (true);

-- ========================================
-- SAMPLE LICENSE KEYS (for testing)
-- ========================================
INSERT INTO licenses (key, is_active) VALUES
  ('TEST-LICENSE-001', true),
  ('TEST-LICENSE-002', true),
  ('TEST-LICENSE-003', true)
ON CONFLICT (key) DO NOTHING;