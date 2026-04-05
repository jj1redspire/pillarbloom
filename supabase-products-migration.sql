-- PillarBloom Products Migration
-- Run this in Supabase Dashboard → SQL Editor AFTER the initial schema

-- ============================================================
-- UPDATE PROFILES — add product usage tracking + new plan tiers
-- ============================================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS products_used_this_month INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS products_reset_date TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS repurposes_reset_date TIMESTAMPTZ DEFAULT NOW();

-- Rename pieces_used_this_month to repurposes_used_this_month (add alias column)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS repurposes_used_this_month INTEGER DEFAULT 0;

-- Sync existing data
UPDATE profiles SET repurposes_used_this_month = COALESCE(pieces_used_this_month, 0);

-- Update plan constraint to include new tiers
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free', 'trial', 'starter', 'pro', 'creator', 'agency', 'expired'));

-- ============================================================
-- DIGITAL PRODUCT PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS digital_product_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  source_content TEXT NOT NULL,
  selected_types JSONB DEFAULT '[]',
  status TEXT DEFAULT 'generating' CHECK (status IN ('generating', 'complete', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE digital_product_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own digital product projects"
  ON digital_product_projects FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- DIGITAL PRODUCT OUTPUTS
-- ============================================================
CREATE TABLE IF NOT EXISTS digital_product_outputs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES digital_product_projects(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'ebook', 'mini_course', 'email_course',
    'workbook', 'checklist', 'product_description'
  )),
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE digital_product_outputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own digital product outputs"
  ON digital_product_outputs FOR ALL
  USING (
    auth.uid() = (
      SELECT user_id FROM digital_product_projects WHERE id = project_id
    )
  );
