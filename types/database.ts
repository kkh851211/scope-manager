export type ProjectStatus = "active" | "completed" | "paused";
export type RequestStatus = "pending" | "in_scope" | "out_of_scope" | "needs_review";
export type ChannelType = "kakao" | "email" | "phone" | "meeting" | "other";

export interface Project {
  id: string;
  user_id: string;
  name: string;
  client_name: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  contract_amount: number | null;
  ai_estimated_amount: number | null;
  ai_estimated_days: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectInsert {
  user_id: string;
  name: string;
  client_name: string;
  description?: string | null;
  status?: ProjectStatus;
  start_date?: string | null;
  end_date?: string | null;
  contract_amount?: number | null;
  ai_estimated_amount?: number | null;
  ai_estimated_days?: number | null;
}

export interface ProjectUpdate {
  name?: string;
  client_name?: string;
  description?: string | null;
  status?: ProjectStatus;
  start_date?: string | null;
  end_date?: string | null;
  contract_amount?: number | null;
  ai_estimated_amount?: number | null;
  ai_estimated_days?: number | null;
  updated_at?: string;
}

export interface ContractFeature {
  id: string;
  project_id: string;
  user_id: string;
  feature_name: string;
  detail_work: string | null;
  estimated_days: number | null;
  daily_rate: number | null;
  amount: number | null;
  sort_order: number;
  created_at: string;
}

export interface ContractFeatureInsert {
  project_id: string;
  user_id: string;
  feature_name: string;
  detail_work?: string | null;
  estimated_days?: number | null;
  daily_rate?: number | null;
  amount?: number | null;
  sort_order?: number;
}

export interface Request {
  id: string;
  project_id: string;
  user_id: string;
  title: string | null;
  content: string;
  requester_name: string | null;
  status: RequestStatus;
  channel: ChannelType | null;
  requested_at: string | null;
  is_overridden: boolean;
  created_at: string;
  updated_at: string;
}

export interface RequestInsert {
  project_id: string;
  user_id: string;
  title?: string | null;
  content: string;
  requester_name?: string | null;
  status?: RequestStatus;
  channel?: ChannelType | null;
  requested_at?: string | null;
  is_overridden?: boolean;
}

export interface ScopeJudgment {
  id: string;
  request_id: string;
  user_id: string;
  result: string;
  reasoning: string | null;
  confidence_score: number | null;
  recommendation: string | null;
  model_used: string | null;
  created_at: string;
  updated_at: string;
}

export interface OnboardingSurvey {
  id: string;
  user_id: string;
  agency_size: string | null;
  has_given_up_billing: string | null;
  created_at: string;
}

export interface OnboardingSurveyInsert {
  user_id: string;
  agency_size: string | null;
  has_given_up_billing: string | null;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}
