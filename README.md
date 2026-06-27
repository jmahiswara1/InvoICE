# InvoICE

Aplikasi invoice offline-first untuk UMKM Indonesia.

## Download

[Download untuk Windows](https://github.com/jmahiswara1/InvoICE/releases/download/v1.0.0/InvoICE_1.0.0_x64_en-US.msi)

## Fitur

- 3 template invoice (Minimalis, Profesional, Kreatif)
- Download PDF
- Kelola klien
- Multi-currency (IDR, USD, EUR, dll)
- Mode gelap & terang
- Sinkronisasi antar perangkat
- Impor/ekspor CSV & Excel
- Backup lokal & cloud

## Tech Stack

- Tauri 2.0 (Rust backend)
- React 19 + TypeScript + Vite
- shadcn/ui + Tailwind CSS 4
- SQLite (local) + Supabase (cloud)

## Development

```bash
# Landing page
cd landing && pnpm dev

# Desktop app
cd desktop && pnpm tauri dev

# Admin panel
cd admin && pnpm dev
```

## License

Proprietary. See [LICENSE.md](LICENSE.md).