use tauri_plugin_sql::{Migration, MigrationKind};

mod commands;

fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_users_table",
            sql: "CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
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
                synced_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_clients_table",
            sql: "CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT REFERENCES users(id),
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                address TEXT,
                city TEXT,
                postal_code TEXT,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_invoices_table",
            sql: "CREATE TABLE IF NOT EXISTS invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT REFERENCES users(id),
                client_id INTEGER REFERENCES clients(id),
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
                paid_at DATETIME,
                sent_at DATETIME,
                cloud_id TEXT,
                synced_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create_invoice_items_table",
            sql: "CREATE TABLE IF NOT EXISTS invoice_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
                description TEXT NOT NULL,
                quantity REAL NOT NULL DEFAULT 1,
                unit_price REAL NOT NULL,
                amount REAL NOT NULL,
                sort_order INTEGER DEFAULT 0
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "create_recurring_templates_table",
            sql: "CREATE TABLE IF NOT EXISTS recurring_templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT REFERENCES users(id),
                name TEXT NOT NULL,
                client_id INTEGER REFERENCES clients(id),
                template TEXT DEFAULT 'minimalis',
                interval TEXT NOT NULL,
                next_generate_date DATE,
                currency TEXT DEFAULT 'IDR',
                tax_enabled INTEGER DEFAULT 1,
                tax_rate REAL DEFAULT 11,
                notes TEXT,
                terms TEXT,
                is_active INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "create_recurring_template_items_table",
            sql: "CREATE TABLE IF NOT EXISTS recurring_template_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                template_id INTEGER REFERENCES recurring_templates(id) ON DELETE CASCADE,
                description TEXT NOT NULL,
                quantity REAL NOT NULL DEFAULT 1,
                unit_price REAL NOT NULL,
                sort_order INTEGER DEFAULT 0
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "create_reminders_table",
            sql: "CREATE TABLE IF NOT EXISTS reminders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
                remind_date DATE NOT NULL,
                message TEXT,
                is_sent INTEGER DEFAULT 0,
                sent_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            kind: MigrationKind::Up,
        },
    ]
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = get_migrations();

    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:invoice.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
