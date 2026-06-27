-- Verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'clients', 'invoices', 'invoice_items', 'licenses');

-- Check if RLS is disabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'clients', 'invoices', 'invoice_items', 'licenses');

-- Check license keys
SELECT * FROM licenses;