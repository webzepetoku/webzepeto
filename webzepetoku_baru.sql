PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "members" VALUES(1,'admin_zepeto','admin123','admin','2026-02-17 00:28:19');
INSERT INTO "members" VALUES(2,'member01','member123','member','2026-02-17 00:28:19');
CREATE TABLE zepeto_accounts (
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
INSERT INTO "zepeto_accounts" VALUES(6,2,'Zepeto Studio API','jwt-mode',NULL,'{"type":"openapi_jwt","access_key":"CpFYXsUU2zasTep1S5wktWTwURYDgR3Tp5zut27gPykB","secret_key":"MlxFrG8y4XqlUfQpdGDTsTDzt8LTRAIBTWEMMQHP1sRJrPhHsI0h1YTO7IM93Davez3+pjh57zMpnkEIV+OvoQ"}','connected','2026-02-17 09:41:16');
CREATE TABLE user_configs (
    member_id INTEGER PRIMARY KEY,
    service_account_json TEXT, -- PENGGANTI GitHub Token
    fbx_root_folder_id TEXT,   -- Folder Input (TETAP)
    zepeto_root_folder_id TEXT,-- Folder Output (TETAP)
    FOREIGN KEY (member_id) REFERENCES members(id)
);
INSERT INTO "user_configs" VALUES(2,'{}','FOLDER_INPUT_ID_DUMMY','FOLDER_OUTPUT_ID_DUMMY');
CREATE TABLE upload_queue (
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
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" VALUES('members',2);
INSERT INTO "sqlite_sequence" VALUES('zepeto_accounts',6);
