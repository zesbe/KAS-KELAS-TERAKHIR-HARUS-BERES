-- =========================================
-- SCHEMA SQL UNTUK SUPABASE POSTGRESQL
-- Sistem Manajemen Kas Kelas 1B SD Islam Al Husna
-- =========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- TABLE: students
-- Menyimpan data siswa kelas 1B
-- =========================================
CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_students_name ON students(name);
CREATE INDEX idx_students_nickname ON students(nickname);
CREATE INDEX idx_students_phone ON students(phone);

-- =========================================
-- TABLE: transactions
-- Menyimpan semua transaksi kas (pemasukan)
-- =========================================
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'income' CHECK (type IN ('income', 'expense')),
    amount INTEGER NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    payment_method VARCHAR(50),
    order_id VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_transactions_student_id ON transactions(student_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_order_id ON transactions(order_id);

-- =========================================
-- TABLE: expenses
-- Menyimpan data pengeluaran kelas
-- =========================================
CREATE TABLE expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category VARCHAR(50) NOT NULL CHECK (category IN ('kegiatan', 'perlengkapan', 'konsumsi', 'transport', 'lainnya')),
    amount INTEGER NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by VARCHAR(255),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_created_at ON expenses(created_at);

-- =========================================
-- TABLE: payment_links
-- Menyimpan link pembayaran yang di-generate
-- =========================================
CREATE TABLE payment_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    order_id VARCHAR(100) UNIQUE NOT NULL,
    payment_url TEXT NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),
    payment_method VARCHAR(50),
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_payment_links_student_id ON payment_links(student_id);
CREATE INDEX idx_payment_links_order_id ON payment_links(order_id);
CREATE INDEX idx_payment_links_status ON payment_links(status);
CREATE INDEX idx_payment_links_created_at ON payment_links(created_at);

-- =========================================
-- TABLE: campaigns
-- Menyimpan data campaign pesan WhatsApp
-- =========================================
CREATE TABLE campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target VARCHAR(20) NOT NULL CHECK (target IN ('all', 'paid', 'unpaid', 'selected')),
    recipients UUID[], -- Array of student IDs
    delay_minutes INTEGER DEFAULT 1 CHECK (delay_minutes >= 0),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'failed', 'cancelled')),
    results JSONB, -- Store sending results
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_target ON campaigns(target);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX idx_campaigns_scheduled_at ON campaigns(scheduled_at);

-- =========================================
-- TABLE: webhook_logs
-- Menyimpan log webhook dari payment gateway
-- =========================================
CREATE TABLE webhook_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source VARCHAR(50) NOT NULL, -- 'pakasir', 'starsender', etc
    event_type VARCHAR(50) NOT NULL,
    order_id VARCHAR(100),
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_webhook_logs_source ON webhook_logs(source);
CREATE INDEX idx_webhook_logs_order_id ON webhook_logs(order_id);
CREATE INDEX idx_webhook_logs_processed ON webhook_logs(processed);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at);

-- =========================================
-- TABLE: financial_summary
-- View untuk summary keuangan
-- =========================================
CREATE VIEW financial_summary AS
SELECT 
    COALESCE(income.total_income, 0) as total_income,
    COALESCE(expenses.total_expenses, 0) as total_expenses,
    COALESCE(income.total_income, 0) - COALESCE(expenses.total_expenses, 0) as current_balance,
    income.transaction_count,
    expenses.expense_count
FROM 
    (SELECT 
        SUM(amount) as total_income,
        COUNT(*) as transaction_count
     FROM transactions 
     WHERE type = 'income' AND status = 'completed'
    ) income
CROSS JOIN
    (SELECT 
        SUM(amount) as total_expenses,
        COUNT(*) as expense_count
     FROM expenses 
     WHERE status = 'approved'
    ) expenses;

-- =========================================
-- TABLE: student_payment_status
-- View untuk status pembayaran per siswa
-- =========================================
CREATE VIEW student_payment_status AS
SELECT 
    s.id,
    s.name,
    s.nickname,
    s.phone,
    COALESCE(t.total_paid, 0) as total_paid,
    COALESCE(t.payment_count, 0) as payment_count,
    CASE 
        WHEN t.total_paid > 0 THEN 'paid'
        ELSE 'unpaid'
    END as payment_status,
    t.last_payment_date
FROM students s
LEFT JOIN (
    SELECT 
        student_id,
        SUM(amount) as total_paid,
        COUNT(*) as payment_count,
        MAX(created_at) as last_payment_date
    FROM transactions 
    WHERE type = 'income' AND status = 'completed'
    GROUP BY student_id
) t ON s.id = t.student_id
ORDER BY s.name;

-- =========================================
-- FUNCTIONS & TRIGGERS
-- =========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at 
    BEFORE UPDATE ON expenses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_links_updated_at 
    BEFORE UPDATE ON payment_links 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at 
    BEFORE UPDATE ON campaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create transaction when payment is completed
CREATE OR REPLACE FUNCTION create_transaction_from_payment()
RETURNS TRIGGER AS $$
BEGIN
    -- If payment status changed to completed, create transaction
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO transactions (
            student_id,
            type,
            amount,
            description,
            payment_method,
            order_id,
            status,
            created_at
        ) VALUES (
            NEW.student_id,
            'income',
            NEW.amount,
            NEW.description,
            NEW.payment_method,
            NEW.order_id,
            'completed',
            NEW.completed_at
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for auto-creating transactions from payments
CREATE TRIGGER auto_create_transaction_from_payment
    AFTER UPDATE ON payment_links
    FOR EACH ROW EXECUTE FUNCTION create_transaction_from_payment();

-- =========================================
-- ROW LEVEL SECURITY (RLS)
-- Uncomment jika menggunakan authentication
-- =========================================

-- Enable RLS for all tables
-- ALTER TABLE students ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payment_links ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on your auth requirements)
-- CREATE POLICY "Allow all operations for authenticated users" ON students
--     FOR ALL USING (auth.role() = 'authenticated');

-- CREATE POLICY "Allow all operations for authenticated users" ON transactions
--     FOR ALL USING (auth.role() = 'authenticated');

-- CREATE POLICY "Allow all operations for authenticated users" ON expenses
--     FOR ALL USING (auth.role() = 'authenticated');

-- CREATE POLICY "Allow all operations for authenticated users" ON payment_links
--     FOR ALL USING (auth.role() = 'authenticated');

-- CREATE POLICY "Allow all operations for authenticated users" ON campaigns
--     FOR ALL USING (auth.role() = 'authenticated');

-- CREATE POLICY "Allow all operations for authenticated users" ON webhook_logs
--     FOR ALL USING (auth.role() = 'authenticated');

-- =========================================
-- SAMPLE DATA INSERT
-- Data siswa kelas 1B SD Islam Al Husna
-- =========================================

INSERT INTO students (name, nickname, phone) VALUES
('Aqilnafi Segara', 'Nafi', '+62 856-2468-7313'),
('Arkaan Jawara Bayanaka', 'Arkaan', '+62 821-1475-9339'),
('Athafariz Zehan Sasongko', 'Atha', '+62 812-9670-7505'),
('Azma Raudhatul Jannah', 'Azma', '+62 856-8500-062'),
('Dizya Nayara Khanza Pujiarto', 'Dizya', '+62 812-8147-6276'),
('Elvano Devika Putra', 'Elvano', '+62 812-9585-0096'),
('Khalifa Adzkayra Marissa', 'Marissa', '+62 877-4168-6950'),
('Khalisa Adiba Nuha', 'Adiba', '+62 813-2877-9423'),
('Kirana Febriana Hakim', 'Kirana', '+62 812-9759-7757'),
('M. Abil Shidiq Arsalaan', 'Abil', '+62 812-1172-3429'),
('Mikhayla Putri Mahfud', 'Mikha', '+62 813-8241-6552'),
('Radeva Zehan Elfathan', 'Radeva', '+62 811-9403-103'),
('Sekar Hanun Ayudia', 'Sekar', '+62 812-2595-0048'),
('Shahia Fitri Kalita', 'Shahia', '+62 858-8163-6149'),
('Sheila Hapsari Paramita', 'Sheila', '+62 822-6021-8027'),
('Tedra Sagara Drew Permana', 'Saga', '+62 877-8539-3962'),
('Tiara Shanum Wicaksono', 'Shanum', '+62 857-1663-5953'),
('Yumna Rizqy Humaira', 'Una', '+62 813-1007-5190'),
('Zaidan Mufid', 'Zaidan', '+62 813-1684-0991'),
('Zanna Kirania Simanjuntak', 'Nia', '+62 812-9076-6367');

-- =========================================
-- USEFUL QUERIES
-- Query yang berguna untuk analisis
-- =========================================

-- Query untuk menampilkan summary keuangan
-- SELECT * FROM financial_summary;

-- Query untuk menampilkan status pembayaran siswa
-- SELECT * FROM student_payment_status;

-- Query untuk menampilkan transaksi bulanan
-- SELECT 
--     DATE_TRUNC('month', created_at) as month,
--     SUM(amount) as total_amount,
--     COUNT(*) as transaction_count
-- FROM transactions 
-- WHERE type = 'income' AND status = 'completed'
-- GROUP BY DATE_TRUNC('month', created_at)
-- ORDER BY month DESC;

-- Query untuk menampilkan pengeluaran per kategori
-- SELECT 
--     category,
--     SUM(amount) as total_amount,
--     COUNT(*) as expense_count
-- FROM expenses 
-- WHERE status = 'approved'
-- GROUP BY category
-- ORDER BY total_amount DESC;

-- Query untuk campaign performance
-- SELECT 
--     title,
--     status,
--     array_length(recipients, 1) as recipient_count,
--     created_at
-- FROM campaigns
-- ORDER BY created_at DESC;

-- =========================================
-- PERFORMANCE OPTIMIZATIONS
-- =========================================

-- Analyze tables for query optimization
-- ANALYZE students;
-- ANALYZE transactions;
-- ANALYZE expenses;
-- ANALYZE payment_links;
-- ANALYZE campaigns;
-- ANALYZE webhook_logs;

-- =========================================
-- BACKUP COMMANDS
-- Perintah untuk backup database
-- =========================================

-- Backup semua data:
-- pg_dump -h your-host -p 5432 -U postgres your-database > backup.sql

-- Restore dari backup:
-- psql -h your-host -p 5432 -U postgres your-database < backup.sql

-- Export ke CSV:
-- COPY students TO '/path/to/students.csv' WITH CSV HEADER;
-- COPY transactions TO '/path/to/transactions.csv' WITH CSV HEADER;

-- =========================================
-- MAINTENANCE QUERIES
-- =========================================

-- Cleanup expired payment links
-- UPDATE payment_links 
-- SET status = 'expired' 
-- WHERE status = 'pending' 
-- AND expires_at < NOW();

-- Delete old webhook logs (older than 3 months)
-- DELETE FROM webhook_logs 
-- WHERE created_at < NOW() - INTERVAL '3 months';

-- =========================================
-- END OF SCHEMA
-- =========================================

-- Schema created successfully!
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Configure RLS policies based on your auth requirements
-- 3. Set up webhook endpoints for payment gateway
-- 4. Test the application with sample data
