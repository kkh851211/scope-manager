// ============================================================
// 스코프 매니저 Database 타입 정의
// supabase/schema.sql 기반
// ============================================================

// ── 공통 ────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]


// ── 테이블 Row 타입 ─────────────────────────────────────────

export interface Profile {
  id: string
  email: string
  full_name: string | null
  company_name: string | null       // 웹 에이전시 회사명
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string                      // 프로젝트 이름
  client_name: string               // 클라이언트(고객사) 이름
  description: string | null
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export interface Contract {
  id: string
  project_id: string
  user_id: string
  title: string                     // 계약 제목
  content: string                   // 계약 범위 전문
  start_date: string | null         // 계약 시작일 (YYYY-MM-DD)
  end_date: string | null           // 계약 종료일 (YYYY-MM-DD)
  created_at: string
  updated_at: string
}

export interface Request {
  id: string
  project_id: string
  user_id: string
  title: string                     // 요청 제목
  content: string                   // 요청 내용 상세
  requester_name: string | null     // 클라이언트 담당자 이름
  status: RequestStatus
  created_at: string
  updated_at: string
}

export interface ScopeJudgment {
  id: string
  request_id: string
  user_id: string
  result: JudgmentResult
  reasoning: string                 // AI 판단 근거
  confidence_score: number | null   // 확신도 (0~100)
  recommendation: string | null     // 권장 대응 방안
  model_used: string                // 사용된 AI 모델
  created_at: string
  updated_at: string
}


// ── Enum 타입 ───────────────────────────────────────────────

export type ProjectStatus = 'active' | 'completed' | 'paused'

export type RequestStatus = 'pending' | 'judged'

export type JudgmentResult = 'in_scope' | 'out_of_scope' | 'unclear'


// ── Insert 타입 (생성 시 사용) ──────────────────────────────

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  status?: ProjectStatus
}

export type ContractInsert = Omit<Contract, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
}

export type RequestInsert = Omit<Request, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  status?: RequestStatus
}

export type ScopeJudgmentInsert = Omit<ScopeJudgment, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  model_used?: string
}


// ── Update 타입 (수정 시 사용) ──────────────────────────────

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>

export type ProjectUpdate = Partial<Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>>

export type ContractUpdate = Partial<Omit<Contract, 'id' | 'user_id' | 'project_id' | 'created_at' | 'updated_at'>>

export type RequestUpdate = Partial<Omit<Request, 'id' | 'user_id' | 'project_id' | 'created_at' | 'updated_at'>>

// scope_judgments는 수정 불가 (RLS 정책)


// ── Join 타입 (조회 시 관계 데이터 포함) ───────────────────

export interface RequestWithJudgment extends Request {
  scope_judgments: ScopeJudgment | null
}

export interface ProjectWithContracts extends Project {
  contracts: Contract[]
}

export interface ProjectWithRequests extends Project {
  requests: RequestWithJudgment[]
}

export interface ProjectDetail extends Project {
  contracts: Contract[]
  requests: RequestWithJudgment[]
}


// ── Supabase Database 타입 (제네릭용) ──────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      projects: {
        Row: Project
        Insert: ProjectInsert
        Update: ProjectUpdate
      }
      contracts: {
        Row: Contract
        Insert: ContractInsert
        Update: ContractUpdate
      }
      requests: {
        Row: Request
        Insert: RequestInsert
        Update: RequestUpdate
      }
      scope_judgments: {
        Row: ScopeJudgment
        Insert: ScopeJudgmentInsert
        Update: never                // 수정 불가
      }
    }
  }
}
