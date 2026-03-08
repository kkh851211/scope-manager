-- 1. projects 테이블 보완
ALTER TABLE IF EXISTS projects 
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS end_date date,
ADD COLUMN IF NOT EXISTS contract_amount bigint,
ADD COLUMN IF NOT EXISTS ai_estimated_amount bigint,
ADD COLUMN IF NOT EXISTS ai_estimated_days integer;

-- 2. requests 테이블 보완
ALTER TABLE IF EXISTS requests
ADD COLUMN IF NOT EXISTS channel text,
ADD COLUMN IF NOT EXISTS requested_at date,
ADD COLUMN IF NOT EXISTS is_overridden boolean DEFAULT false;

-- 3. contract_features 테이블 신규 생성
CREATE TABLE IF NOT EXISTS contract_features (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id),
    feature_name text NOT NULL,
    detail_work text,
    estimated_days integer,
    daily_rate bigint,
    amount bigint,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- contract_features RLS 설정
ALTER TABLE contract_features ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contract_features' AND policyname = 'Users can manage their own contract features') THEN
        CREATE POLICY "Users can manage their own contract features" ON contract_features
            FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 4. onboarding_surveys 테이블 신규 생성
CREATE TABLE IF NOT EXISTS onboarding_surveys (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) UNIQUE,
    agency_size text,
    has_given_up_billing text,
    created_at timestamptz DEFAULT now()
);

-- onboarding_surveys RLS 설정
ALTER TABLE onboarding_surveys ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'onboarding_surveys' AND policyname = 'Users can manage their own onboarding surveys') THEN
        CREATE POLICY "Users can manage their own onboarding surveys" ON onboarding_surveys
            FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
