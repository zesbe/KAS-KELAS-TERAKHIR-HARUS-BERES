-- ================================================================
-- ROLE MANAGEMENT SETUP FOR SUPABASE
-- Sistem Kas Kelas - Role-based Access Control
-- ================================================================

-- 1. CREATE ENUM FOR ROLES
-- ================================================================
CREATE TYPE user_role AS ENUM (
  'admin',
  'bendahara', 
  'ketua_kelas',
  'wali_kelas',
  'viewer'
);

-- 2. CREATE USER PROFILES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE ROLE PERMISSIONS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role user_role NOT NULL,
  permission TEXT NOT NULL,
  resource TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, permission, resource)
);

-- 4. INSERT DEFAULT ROLE PERMISSIONS
-- ================================================================
INSERT INTO role_permissions (role, permission, resource) VALUES
-- Admin permissions (full access)
('admin', 'create', 'all'),
('admin', 'read', 'all'),
('admin', 'update', 'all'),
('admin', 'delete', 'all'),
('admin', 'manage_users', 'all'),
('admin', 'manage_settings', 'all'),
('admin', 'export_data', 'all'),

-- Bendahara permissions
('bendahara', 'create', 'transactions'),
('bendahara', 'read', 'transactions'),
('bendahara', 'update', 'transactions'),
('bendahara', 'delete', 'transactions'),
('bendahara', 'create', 'expenses'),
('bendahara', 'read', 'expenses'),
('bendahara', 'update', 'expenses'),
('bendahara', 'delete', 'expenses'),
('bendahara', 'create', 'payment_links'),
('bendahara', 'read', 'payment_links'),
('bendahara', 'update', 'payment_links'),
('bendahara', 'delete', 'payment_links'),
('bendahara', 'read', 'reports'),
('bendahara', 'export_data', 'reports'),

-- Ketua Kelas permissions
('ketua_kelas', 'create', 'students'),
('ketua_kelas', 'read', 'students'),
('ketua_kelas', 'update', 'students'),
('ketua_kelas', 'read', 'transactions'),
('ketua_kelas', 'read', 'reports'),

-- Wali Kelas permissions
('wali_kelas', 'read', 'all'),
('wali_kelas', 'export_data', 'reports'),

-- Viewer permissions
('viewer', 'read', 'basic');

-- 5. UPDATE EXISTING TABLES WITH USER TRACKING
-- ================================================================
-- Add created_by dan updated_by columns to existing tables
ALTER TABLE students ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE students ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

ALTER TABLE expenses ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

ALTER TABLE payment_links ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE payment_links ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- 6. CREATE FUNCTIONS FOR USER MANAGEMENT
-- ================================================================

-- Function to create user profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'viewer'  -- Default role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger untuk auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update last_active timestamp
CREATE OR REPLACE FUNCTION public.update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET last_active = NOW() 
  WHERE id = auth.uid();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user permissions
CREATE OR REPLACE FUNCTION public.user_has_permission(
  user_id UUID,
  required_permission TEXT,
  resource_name TEXT DEFAULT 'all'
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_val user_role;
BEGIN
  -- Get user role
  SELECT role INTO user_role_val
  FROM user_profiles
  WHERE id = user_id AND status = 'active';
  
  -- Admin has all permissions
  IF user_role_val = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Check specific permission
  RETURN EXISTS (
    SELECT 1 FROM role_permissions
    WHERE role = user_role_val
    AND permission = required_permission
    AND (resource = resource_name OR resource = 'all')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS user_role AS $$
DECLARE
  user_role_val user_role;
BEGIN
  SELECT role INTO user_role_val
  FROM user_profiles
  WHERE id = user_id AND status = 'active';
  
  RETURN COALESCE(user_role_val, 'viewer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_links ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (get_user_role() = 'admin');

CREATE POLICY "Admins can manage all profiles"
  ON user_profiles FOR ALL
  USING (get_user_role() = 'admin');

-- Students Table Policies
CREATE POLICY "Admin and Ketua Kelas can manage students"
  ON students FOR ALL
  USING (get_user_role() IN ('admin', 'ketua_kelas'));

CREATE POLICY "Others can read students"
  ON students FOR SELECT
  USING (user_has_permission(auth.uid(), 'read', 'students') OR user_has_permission(auth.uid(), 'read', 'all'));

-- Transactions Table Policies
CREATE POLICY "Admin and Bendahara can manage transactions"
  ON transactions FOR ALL
  USING (get_user_role() IN ('admin', 'bendahara'));

CREATE POLICY "Others can read transactions"
  ON transactions FOR SELECT
  USING (user_has_permission(auth.uid(), 'read', 'transactions') OR user_has_permission(auth.uid(), 'read', 'all'));

-- Expenses Table Policies
CREATE POLICY "Admin and Bendahara can manage expenses"
  ON expenses FOR ALL
  USING (get_user_role() IN ('admin', 'bendahara'));

CREATE POLICY "Others can read expenses"
  ON expenses FOR SELECT
  USING (user_has_permission(auth.uid(), 'read', 'expenses') OR user_has_permission(auth.uid(), 'read', 'all'));

-- Payment Links Table Policies
CREATE POLICY "Admin and Bendahara can manage payment links"
  ON payment_links FOR ALL
  USING (get_user_role() IN ('admin', 'bendahara'));

CREATE POLICY "Others can read payment links"
  ON payment_links FOR SELECT
  USING (user_has_permission(auth.uid(), 'read', 'payment_links') OR user_has_permission(auth.uid(), 'read', 'all'));

-- 8. CREATE ADMIN USER FUNCTION
-- ================================================================
CREATE OR REPLACE FUNCTION public.create_admin_user(
  admin_email TEXT,
  admin_password TEXT,
  admin_name TEXT
)
RETURNS TEXT AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert into auth.users (this is for development only)
  -- In production, use Supabase Auth API
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', admin_name),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Update profile to admin role
  UPDATE user_profiles 
  SET role = 'admin', full_name = admin_name
  WHERE id = new_user_id;

  RETURN 'Admin user created successfully with ID: ' || new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. SAMPLE DATA - USERS
-- ================================================================
-- Note: In production, create users through Supabase Auth UI or API
-- This is just for development/testing

-- Create sample admin user (use this only in development)
-- SELECT create_admin_user('yudi@alhusna.edu', 'admin123', 'Yudi Haryanto');

-- 10. HELPER VIEWS
-- ================================================================

-- View for user management
CREATE OR REPLACE VIEW user_management AS
SELECT 
  up.id,
  up.email,
  up.full_name,
  up.role,
  up.status,
  up.phone,
  up.created_at,
  up.updated_at,
  up.last_active,
  au.last_sign_in_at,
  au.email_confirmed_at
FROM user_profiles up
LEFT JOIN auth.users au ON up.id = au.id;

-- View for role permissions
CREATE OR REPLACE VIEW role_permissions_view AS
SELECT 
  role,
  array_agg(permission || CASE WHEN resource != 'all' THEN ':' || resource ELSE '' END) as permissions
FROM role_permissions
GROUP BY role;

-- 11. UTILITY FUNCTIONS
-- ================================================================

-- Function to change user role (admin only)
CREATE OR REPLACE FUNCTION public.change_user_role(
  target_user_id UUID,
  new_role user_role
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user is admin
  IF get_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: Only admin can change user roles';
  END IF;

  UPDATE user_profiles 
  SET role = new_role, updated_at = NOW()
  WHERE id = target_user_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle user status
CREATE OR REPLACE FUNCTION public.toggle_user_status(
  target_user_id UUID
)
RETURNS TEXT AS $$
DECLARE
  current_status TEXT;
  new_status TEXT;
BEGIN
  -- Check if current user is admin
  IF get_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: Only admin can change user status';
  END IF;

  SELECT status INTO current_status
  FROM user_profiles
  WHERE id = target_user_id;

  new_status := CASE WHEN current_status = 'active' THEN 'inactive' ELSE 'active' END;

  UPDATE user_profiles 
  SET status = new_status, updated_at = NOW()
  WHERE id = target_user_id;

  RETURN 'User status changed to: ' || new_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- DEPLOYMENT INSTRUCTIONS
-- ================================================================

/*
1. Jalankan script SQL ini di Supabase SQL Editor
2. Pastikan semua tabel sudah ada sebelumnya (students, transactions, etc.)
3. Untuk membuat admin user pertama, gunakan Supabase Auth UI atau API
4. Setelah user terdaftar, update role menjadi admin:
   UPDATE user_profiles SET role = 'admin' WHERE email = 'yudi@alhusna.edu';
5. Test dengan login dan cek permissions
*/

-- ================================================================
-- TESTING QUERIES
-- ================================================================

-- Check user permissions
-- SELECT user_has_permission(auth.uid(), 'read', 'students');
-- SELECT get_user_role();

-- View all users and roles
-- SELECT * FROM user_management;

-- View role permissions
-- SELECT * FROM role_permissions_view;

-- Change user role (admin only)
-- SELECT change_user_role('user-uuid-here', 'bendahara');

-- Toggle user status
-- SELECT toggle_user_status('user-uuid-here');
