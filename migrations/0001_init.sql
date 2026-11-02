PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  handle TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'CoTap member',
  email TEXT,
  phone TEXT,
  address TEXT,
  plan TEXT NOT NULL DEFAULT 'basic' CHECK (plan IN ('basic', 'pro', 'team')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  plan TEXT NOT NULL,
  delivery TEXT NOT NULL,
  shipping INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  payment_method TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_links_user ON links(user_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_links_user_visible ON links(user_id, visible);
CREATE INDEX IF NOT EXISTS idx_users_handle ON users(handle);
CREATE INDEX IF NOT EXISTS idx_orders_handle ON orders(handle);

INSERT OR IGNORE INTO users (id, name, handle, role, email, phone, address, plan) VALUES
  (1, 'Alexandra Putri', 'alexandra', 'Product Designer', 'alexandra@studio-nara.com', '+63 917 555 0101', 'Makati, Metro Manila', 'pro'),
  (2, 'Rizky Pratama', 'rizky', 'Brand Strategist', 'rizky@rizky.design', '+63 917 555 0102', 'Quezon City, Metro Manila', 'basic'),
  (3, 'Sarah Lim', 'sarah', 'Creative Director', 'sarah@sarahlim.co', '+63 917 555 0103', 'Cebu City, Cebu', 'pro'),
  (4, 'Dimas Aryo', 'dimas', 'Software Engineer', 'dimas@dimas.dev', '+63 917 555 0104', 'Davao City, Davao del Sur', 'basic'),
  (5, 'Maria Santos', 'mariasantos', 'Founder & CEO', 'maria@mariasantos.ph', '+63 917 555 0105', 'Pasig, Metro Manila', 'team');

INSERT OR IGNORE INTO links (id, user_id, label, url, sort_order) VALUES
  (1, 1, 'Portfolio', 'https://studio-nara.com', 0),
  (2, 1, 'LinkedIn', 'https://linkedin.com/in/alexandrap', 1),
  (3, 1, 'GitHub', 'https://github.com/alexbuilds', 2),
  (4, 2, 'Portfolio', 'https://rizky.design', 0),
  (5, 2, 'LinkedIn', 'https://linkedin.com/in/rizkypratama', 1),
  (6, 3, 'Website', 'https://sarahlim.co', 0),
  (7, 3, 'LinkedIn', 'https://linkedin.com/in/sarahlim', 1),
  (8, 4, 'GitHub', 'https://github.com/dimasaryo', 0),
  (9, 4, 'LinkedIn', 'https://linkedin.com/in/dimasaryo', 1),
  (10, 5, 'Website', 'https://mariasantos.ph', 0),
  (11, 5, 'LinkedIn', 'https://linkedin.com/in/mariasantos', 1),
  (12, 5, 'Instagram', 'https://instagram.com/mariasantos', 2);
