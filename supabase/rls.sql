-- ============================================================
-- 스코프 매니저 RLS (Row Level Security) 정책
-- 규칙: 로그인한 유저는 자신의 데이터만 조회/생성/수정/삭제 가능
-- ============================================================

-- RLS 활성화
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests        ENABLE ROW LEVEL SECURITY;
ALTER TABLE scope_judgments ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- profiles
-- ============================================================
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);


-- ============================================================
-- projects
-- ============================================================
CREATE POLICY "projects_select" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "projects_insert" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "projects_delete" ON projects
  FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- contracts
-- ============================================================
CREATE POLICY "contracts_select" ON contracts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "contracts_insert" ON contracts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contracts_update" ON contracts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "contracts_delete" ON contracts
  FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- requests
-- ============================================================
CREATE POLICY "requests_select" ON requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "requests_insert" ON requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "requests_update" ON requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "requests_delete" ON requests
  FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- scope_judgments
-- AI 판단 결과는 수정/삭제 불가 (무결성 보호)
-- ============================================================
CREATE POLICY "scope_judgments_select" ON scope_judgments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "scope_judgments_insert" ON scope_judgments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
