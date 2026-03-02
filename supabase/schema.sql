-- ============================================================
-- 스코프 매니저 DB 스키마
-- ============================================================

-- updated_at 자동 갱신 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- 1. profiles (유저 프로필)
-- auth.users와 1:1 연동
-- ============================================================
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  company_name TEXT,                          -- 웹 에이전시 회사명
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 신규 유저 가입 시 profiles 자동 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 2. projects (프로젝트)
-- PM이 관리하는 클라이언트 프로젝트 단위
-- ============================================================
CREATE TABLE projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,                -- 프로젝트 이름
  client_name  TEXT NOT NULL,               -- 클라이언트(고객사) 이름
  description  TEXT,                        -- 프로젝트 설명
  status       TEXT NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active', 'completed', 'paused')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 3. contracts (계약 범위)
-- 프로젝트별 계약서 또는 SOW(작업 범위 기술서) 내용
-- ============================================================
CREATE TABLE contracts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,                -- 계약 제목 (예: "1차 계약서")
  content     TEXT NOT NULL,               -- 계약 범위 전문 (AI 판단 기준 텍스트)
  start_date  DATE,                        -- 계약 시작일
  end_date    DATE,                        -- 계약 종료일
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 4. requests (클라이언트 요청)
-- 클라이언트가 PM에게 전달한 추가 요청 사항
-- ============================================================
CREATE TABLE requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,           -- 요청 제목
  content         TEXT NOT NULL,           -- 요청 내용 상세
  requester_name  TEXT,                    -- 요청자 이름 (클라이언트 담당자)
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'judged')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 5. scope_judgments (AI 판단 결과)
-- Claude API가 요청을 분석한 결과 저장
-- ============================================================
CREATE TABLE scope_judgments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id        UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  result            TEXT NOT NULL
                      CHECK (result IN ('in_scope', 'out_of_scope', 'unclear')),
                                           -- in_scope: 계약 범위 내
                                           -- out_of_scope: 범위 외 (추가 비용 필요)
                                           -- unclear: 추가 확인 필요
  reasoning         TEXT NOT NULL,         -- AI 판단 근거 (상세 설명)
  confidence_score  INTEGER
                      CHECK (confidence_score BETWEEN 0 AND 100),
                                           -- 확신도 (0~100)
  recommendation    TEXT,                  -- 권장 대응 방안 (PM에게 제안)
  model_used        TEXT DEFAULT 'claude-sonnet-4-20250514',
                                           -- 판단에 사용된 AI 모델
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_scope_judgments_updated_at
  BEFORE UPDATE ON scope_judgments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 인덱스 (조회 성능 최적화)
-- ============================================================
CREATE INDEX idx_projects_user_id       ON projects(user_id);
CREATE INDEX idx_contracts_project_id   ON contracts(project_id);
CREATE INDEX idx_contracts_user_id      ON contracts(user_id);
CREATE INDEX idx_requests_project_id    ON requests(project_id);
CREATE INDEX idx_requests_user_id       ON requests(user_id);
CREATE INDEX idx_requests_status        ON requests(status);
CREATE INDEX idx_scope_judgments_request_id ON scope_judgments(request_id);
CREATE INDEX idx_scope_judgments_user_id    ON scope_judgments(user_id);


-- ============================================================
-- RLS (Row Level Security) 정책
-- 각 유저는 본인 데이터만 접근 가능
-- ============================================================

-- RLS 활성화
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE scope_judgments ENABLE ROW LEVEL SECURITY;


-- ── profiles ──────────────────────────────────────────────
-- 본인 프로필만 조회/수정 가능
CREATE POLICY "본인 프로필 조회"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "본인 프로필 수정"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);


-- ── projects ──────────────────────────────────────────────
-- 본인 프로젝트만 CRUD 가능
CREATE POLICY "본인 프로젝트 조회"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "본인 프로젝트 생성"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 프로젝트 수정"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "본인 프로젝트 삭제"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);


-- ── contracts ─────────────────────────────────────────────
-- 본인 계약 범위만 CRUD 가능
CREATE POLICY "본인 계약 조회"
  ON contracts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "본인 계약 생성"
  ON contracts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 계약 수정"
  ON contracts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "본인 계약 삭제"
  ON contracts FOR DELETE
  USING (auth.uid() = user_id);


-- ── requests ──────────────────────────────────────────────
-- 본인 요청만 CRUD 가능
CREATE POLICY "본인 요청 조회"
  ON requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "본인 요청 생성"
  ON requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 요청 수정"
  ON requests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "본인 요청 삭제"
  ON requests FOR DELETE
  USING (auth.uid() = user_id);


-- ── scope_judgments ───────────────────────────────────────
-- 본인 판단 결과만 조회/생성 가능 (수정/삭제 불가 - AI 결과 무결성 유지)
CREATE POLICY "본인 판단 결과 조회"
  ON scope_judgments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "본인 판단 결과 생성"
  ON scope_judgments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
