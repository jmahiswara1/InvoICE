-- Pastikan tabel ada
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Insert/update admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, name) 
VALUES ('admin@invoice.com', 'admin123', 'Admin')
ON CONFLICT (email) DO UPDATE SET password_hash = 'admin123';

-- Verify
SELECT * FROM admin_users;