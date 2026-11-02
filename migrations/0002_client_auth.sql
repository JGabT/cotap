ALTER TABLE users ADD COLUMN password_hash TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email) WHERE email IS NOT NULL;

UPDATE users SET password_hash = 'pbkdf2$100000$x1_wnMzjfBA8vXGujBZ1FQ$8FYh6SkOlYt0f1Tsho-CvSkXOM2rJYkHb8h_Igo2PGw' WHERE id = 1;
UPDATE users SET password_hash = 'pbkdf2$100000$LZKi0wYPqrl6iSFeEv8RfA$i3aK4sPhX6ePiC4mSkK4k4K4o2EQD_xblQ45_MYHmCY' WHERE id = 2;
UPDATE users SET password_hash = 'pbkdf2$100000$yG8WRQC9hyeE0nZJ1dpiQg$UknfF_hr6a-KD88G-B0rqNi6_YfC4KLpUK-AvejiRto' WHERE id = 3;
UPDATE users SET password_hash = 'pbkdf2$100000$40sH2VNHoyBmf1m-GfprTw$_EPaPanCRdVY4BrPopcV_z3aBARxkGBElNkxRpPaSzs' WHERE id = 4;
UPDATE users SET password_hash = 'pbkdf2$100000$fBRD6vIRQOADhCUz2LpVcg$jg3W4CmNET_f5KBwOYt0LsQF8-7_esi9FdNLTWGUXBs' WHERE id = 5;
