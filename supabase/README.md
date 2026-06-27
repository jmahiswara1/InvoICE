# Supabase Setup

## Cara Setup

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Buka **SQL Editor** (sidebar kiri)
4. Copy isi file `migrations/001_initial_schema.sql`
5. Paste ke SQL Editor
6. Klik **Run**

## Tabel yang Dibuat

| Tabel | Fungsi |
|---|---|
| `users` | User profiles + license info |
| `clients` | Client data (sync dari desktop) |
| `invoices` | Invoice data (sync dari desktop) |
| `invoice_items` | Invoice line items |
| `licenses` | License keys untuk validasi |

## Test License Keys

Untuk testing, ada 3 license keys yang sudah di-insert:

- `TEST-LICENSE-001`
- `TEST-LICENSE-002`
- `TEST-LICENSE-003`

## Environment Variables

File `.env` di `desktop/` sudah dikonfigurasi dengan:

```
VITE_SUPABASE_URL=https://afaatvuxoewaeijjrost.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Row Level Security (RLS)

Semua tabel sudah dikonfigurasi dengan RLS:
- Users hanya bisa akses data sendiri
- License bisa dibaca oleh semua orang (untuk validasi)
- Invoice items terkait dengan parent invoice