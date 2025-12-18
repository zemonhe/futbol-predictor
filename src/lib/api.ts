import {
  FetchRequest,
  FetchResponse,
  TrainRequest,
  TrainResponse,
  EvaluateRequest,
  EvaluateResponse,
  BacktestRequest,
  BacktestResponse,
  PredictRequest,
  PredictResponse,
  HealthResponse,
} from '@/types/api';

// Base API URL - use mock endpoints for now
const API_BASE = '/api';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data generators
const generateMockMetrics = () => ({
  accuracy: 0.58 + Math.random() * 0.1,
  log_loss: 0.95 + Math.random() * 0.15,
  brier_score: 0.23 + Math.random() * 0.05,
});

// API Client Functions
export async function fetchData(request: FetchRequest): Promise<FetchResponse> {
  await delay(1500);
  
  // Mock response
  return {
    rows: Math.floor(1000 + Math.random() * 2000),
    path: 'data/matches_clean.csv',
    updatedAt: new Date().toISOString(),
  };
}

export async function trainModel(request: TrainRequest): Promise<TrainResponse> {
  await delay(2500);
  
  const metrics = generateMockMetrics();
  return {
    ...metrics,
    cutoff: request.cutoff || new Date().toISOString().split('T')[0],
    trainedAt: new Date().toISOString(),
  };
}

export async function evaluateModel(request: EvaluateRequest): Promise<EvaluateResponse> {
  await delay(2000);
  
  const metrics = generateMockMetrics();
  return {
    ...metrics,
    classification_report: `              precision    recall  f1-score   support

           H       0.62      0.58      0.60       245
           D       0.41      0.35      0.38       198
           A       0.55      0.62      0.58       207

    accuracy                           0.52       650
   macro avg       0.53      0.52      0.52       650
weighted avg       0.54      0.52      0.53       650`,
    confusion_matrix: [
      [142, 48, 55],
      [65, 69, 64],
      [45, 33, 129],
    ],
  };
}

export async function runBacktest(request: BacktestRequest): Promise<BacktestResponse> {
  await delay(3000);
  
  const results: BacktestResponse = [];
  const baseDate = new Date('2024-01-01');
  
  for (let i = 1; i <= request.splits; i++) {
    const trainEnd = new Date(baseDate);
    trainEnd.setMonth(trainEnd.getMonth() + i * 2);
    
    const testStart = new Date(trainEnd);
    testStart.setDate(testStart.getDate() + 1);
    
    const testEnd = new Date(testStart);
    testEnd.setMonth(testEnd.getMonth() + 1);
    
    results.push({
      fold: i,
      train_end: trainEnd.toISOString(),
      test_start: testStart.toISOString(),
      test_end: testEnd.toISOString(),
      ...generateMockMetrics(),
    });
  }
  
  return results;
}

export async function generatePredictions(request: PredictRequest): Promise<PredictResponse> {
  await delay(2000);
  
  const teams = [
    { home: 'Arsenal', away: 'Chelsea', league: 'Premier League' },
    { home: 'Liverpool', away: 'Manchester United', league: 'Premier League' },
    { home: 'Barcelona', away: 'Real Madrid', league: 'La Liga' },
    { home: 'Bayern Munich', away: 'Borussia Dortmund', league: 'Bundesliga' },
    { home: 'Juventus', away: 'AC Milan', league: 'Serie A' },
    { home: 'PSG', away: 'Lyon', league: 'Ligue 1' },
    { home: 'Benfica', away: 'Porto', league: 'Primeira Liga' },
    { home: 'Sporting', away: 'Braga', league: 'Primeira Liga' },
    { home: 'Ajax', away: 'PSV', league: 'Eredivisie' },
    { home: 'Inter Milan', away: 'Napoli', league: 'Serie A' },
  ];
  
  const predictions: PredictResponse = teams.map((match, index) => {
    const prob_home = 0.25 + Math.random() * 0.35;
    const prob_draw = 0.2 + Math.random() * 0.25;
    const prob_away = 1 - prob_home - prob_draw;
    
    let pred_class: 'H' | 'D' | 'A' = 'H';
    if (prob_draw > prob_home && prob_draw > prob_away) pred_class = 'D';
    else if (prob_away > prob_home) pred_class = 'A';
    
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    
    return {
      date: date.toISOString().split('T')[0],
      league: match.league,
      season: 2024,
      home_team: match.home,
      away_team: match.away,
      prob_home: Math.round(prob_home * 1000) / 1000,
      prob_draw: Math.round(prob_draw * 1000) / 1000,
      prob_away: Math.round(prob_away * 1000) / 1000,
      pred_class,
    };
  });
  
  return predictions;
}

export async function checkHealth(): Promise<HealthResponse> {
  await delay(500);
  
  return {
    status: 'ok',
    time: new Date().toISOString(),
  };
}

// Historical metrics for dashboard chart (mock)
export async function getMetricsHistory() {
  await delay(800);
  
  const history = [];
  const baseDate = new Date('2024-06-01');
  
  for (let i = 0; i < 8; i++) {
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + i);
    
    history.push({
      date: date.toISOString().split('T')[0],
      ...generateMockMetrics(),
    });
  }
  
  return history;
}
