const API_BASE_URL = "http://localhost:8000";

export interface HealthStatus {
  status: string;
  uptime: string;
  model_loaded: boolean;
  api_version: string;
}

export interface Stats {
  total_predictions: number;
  avg_response_time_ms: number;
  accuracy: number;
}

export interface PredictionDataPoint {
  date: string;
  count: number;
}

export interface RequestStats {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
}

export interface ContactRequest {
  id: number;
  name: string;
  email: string;
  message: string;
  submitted_at: string;
}

export interface DatasetRequest {
  id: number;
  institution_name: string;
  email: string;
  dataset_type: string;
  purpose: string;
  submitted_at: string;
}

export interface NanoparticleType {
  type: string;
  count: number;
}

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error("Failed to fetch health status");
  return res.json();
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchPredictionsOverTime(): Promise<PredictionDataPoint[]> {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/predictions-over-time`);
  if (!res.ok) throw new Error("Failed to fetch predictions over time");
  return res.json();
}

export async function fetchRequestStats(): Promise<RequestStats> {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/request-stats`);
  if (!res.ok) throw new Error("Failed to fetch request stats");
  return res.json();
}

export async function fetchContactRequests(): Promise<ContactRequest[]> {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/contact-requests`);
  if (!res.ok) throw new Error("Failed to fetch contact requests");
  return res.json();
}

export async function fetchDatasetRequests(): Promise<DatasetRequest[]> {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/dataset-requests`);
  if (!res.ok) throw new Error("Failed to fetch dataset requests");
  return res.json();
}

export async function fetchNanoparticleTypes(): Promise<NanoparticleType[]> {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/nanoparticle-types`);
  if (!res.ok) throw new Error("Failed to fetch nanoparticle types");
  return res.json();
}
