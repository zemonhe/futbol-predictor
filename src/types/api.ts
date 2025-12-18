// API Types for Futebol 1X2 - Previsões

export interface Metrics {
  accuracy: number;
  log_loss: number;
  brier_score: number;
}

export interface FetchResponse {
  rows: number;
  path: string;
  updatedAt: string;
}

export interface FetchRequest {
  source: 'csv' | 'api';
  league?: string;
  season?: number;
  limit?: number;
  token?: string;
  csvUploadId?: string;
}

export interface TrainRequest {
  cutoff: string | null;
  useXgb: boolean;
}

export interface TrainResponse extends Metrics {
  cutoff: string;
  trainedAt: string;
}

export interface EvaluateRequest {
  cutoff: string | null;
}

export interface EvaluateResponse extends Metrics {
  classification_report: string;
  confusion_matrix: number[][];
}

export interface BacktestRequest {
  splits: number;
  useXgb: boolean;
}

export interface BacktestRow {
  fold: number;
  train_end: string;
  test_start: string;
  test_end: string;
  accuracy: number;
  log_loss: number;
  brier_score: number;
}

export type BacktestResponse = BacktestRow[];

export interface PredictRequest {
  fixturesCsvPath: string;
}

export type PredClass = 'H' | 'D' | 'A';

export interface PredictionRow {
  date: string;
  league: string;
  season: number;
  home_team: string;
  away_team: string;
  prob_home: number;
  prob_draw: number;
  prob_away: number;
  pred_class: PredClass;
}

export type PredictResponse = PredictionRow[];

export interface HealthResponse {
  status: 'ok' | 'error';
  time: string;
}

export interface MatchRow {
  date: string;
  league: string;
  season: number;
  home_team: string;
  away_team: string;
  home_goals: number;
  away_goals: number;
}

// UI State Types
export interface AppState {
  lastTraining: TrainResponse | null;
  lastEvaluation: EvaluateResponse | null;
  lastBacktest: BacktestResponse | null;
  predictions: PredictionRow[];
  dataInfo: FetchResponse | null;
}

// CSV Validation
export interface CSVValidationResult {
  valid: boolean;
  errors: string[];
  preview: Record<string, string>[];
  rowCount: number;
}

export const REQUIRED_CSV_COLUMNS = [
  'date',
  'league', 
  'season',
  'home_team',
  'away_team',
  'home_goals',
  'away_goals'
] as const;

export const REQUIRED_FIXTURES_COLUMNS = [
  'date',
  'league',
  'season',
  'home_team',
  'away_team'
] as const;
