# Changelog

## v1.0.0 (2026-06-27)

### Initial Release

#### Desktop App (Tauri + React + TypeScript)
- **Dashboard** — Ringkasan bisnis dengan chart revenue, status distribusi, top clients
- **Invoice Management** — Buat, edit, hapus invoice dengan 3 template (Minimalis, Profesional, Kreatif)
- **Invoice Editor** — Split view: form + live PDF preview, download PDF
- **Client Management** — CRUD klien dengan search
- **Recurring Invoice** — Template invoice berulang (bulanan/triwulan/tahunan)
- **Payment Reminder** — Notifikasi desktop untuk invoice jatuh tempo
- **Multi-Currency** — IDR, USD, EUR, SGD, MYR, JPY, GBP
- **Multi-Language** — Bahasa Indonesia + English
- **Import/Export** — CSV (clients), Excel (invoices)
- **Backup/Restore** — Local backup .sqlite + auto-backup mingguan
- **Cloud Sync** — Sinkronisasi ke Supabase (clients, invoices)
- **License System** — Validasi license key ke Supabase
- **Dark Mode** — System/Light/Dark theme toggle

#### Landing Page (Next.js)
- Hero section dengan CTA download
- Features, Templates preview, Pricing, FAQ
- Terms of Service dan Privacy Policy pages

#### Admin Panel (Next.js)
- Dashboard dengan statistik
- User management
- License management
- Broadcast messaging

#### Tech Stack
- Tauri 2.0 (Rust backend)
- React 19 + TypeScript + Vite
- shadcn/ui + Tailwind CSS 4
- SQLite (local) + Supabase (cloud)
- Zustand (state management)
- @react-pdf/renderer (PDF generation)
- Recharts (dashboard charts)
- i18next (internationalization)