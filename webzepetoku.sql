-- 1. MEMBERS (TETAP SAMA)
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. ZEPETO ACCOUNTS (KEMBALI KE ASAL - SESUAI PERMINTAAN)
-- Token & Cookie wajib ada untuk login session Zepeto
CREATE TABLE IF NOT EXISTS zepeto_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER,
    zepeto_id TEXT NOT NULL,
    jwt_token TEXT,          -- TETAP ADA
    refresh_token TEXT,      -- TETAP ADA
    cookie_string TEXT,      -- TETAP ADA
    status TEXT DEFAULT 'active',
    last_sync DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id)
);

-- 3. USER API CONFIGS (INI SATU-SATUNYA YANG BERUBAH)
-- GitHub Token DIBUANG -> Diganti Service Account JSON (Untuk Drive & HF)
CREATE TABLE IF NOT EXISTS user_configs (
    member_id INTEGER PRIMARY KEY,
    service_account_json TEXT, -- PENGGANTI GitHub Token
    fbx_root_folder_id TEXT,   -- Folder Input (TETAP)
    zepeto_root_folder_id TEXT,-- Folder Output (TETAP)
    FOREIGN KEY (member_id) REFERENCES members(id)
);

-- 4. UPLOAD QUEUE (MODIFIKASI DIKIT UNTUK HF)
-- Menggunakan struktur asli Anda, tambah kolom tracking transaksi HF
CREATE TABLE IF NOT EXISTS upload_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_uuid TEXT UNIQUE, -- ID Unik Transaksi (PENTING untuk HF)
    member_id INTEGER,
    zepeto_account_id INTEGER,    -- Relasi ke akun Zepeto yang dipilih
    zepeto_id TEXT,               
    filename TEXT,
    fbx_drive_id TEXT,            -- ID File Input
    zepeto_drive_id TEXT,         -- ID File Output (Diisi setelah HF selesai)
    status TEXT DEFAULT 'waiting', 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (zepeto_account_id) REFERENCES zepeto_accounts(id)
);