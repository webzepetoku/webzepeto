-- 1. SEED DATA MEMBERS (User Login)
-- Gunakan password yang mudah diingat dulu, nanti bisa diganti di Settings.
INSERT INTO members (username, password, role) VALUES 
('admin_zepeto', 'admin123', 'admin'),
('member01', 'member123', 'member');

-- 2. SEED DATA USER CONFIGS (Gudang API Member)
-- Kita siapkan slot config untuk member01 agar dia tidak error saat upload.
-- Kamu harus mengupdate 'isi_json_di_sini' nanti lewat Dashboard Settings.
INSERT INTO user_configs (member_id, service_account_json, fbx_root_folder_id, zepeto_root_folder_id) 
VALUES (2, '{}', 'FOLDER_INPUT_ID_DUMMY', 'FOLDER_OUTPUT_ID_DUMMY');

-- 3. SEED DATA ZEPETO ACCOUNTS (Contoh Akun Zepeto Member)
-- Agar di halaman accounts.html langsung muncul contoh akun.
INSERT INTO zepeto_accounts (member_id, zepeto_id, status, cookie_string) 
VALUES (2, 'knqjaya_store', 'active', 'session_id=example_cookie_123');