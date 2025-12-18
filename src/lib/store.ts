import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TrainResponse, EvaluateResponse, BacktestResponse, PredictionRow, FetchResponse } from '@/types/api';

interface AppStore {
  // Data state
  lastTraining: TrainResponse | null;
  lastEvaluation: EvaluateResponse | null;
  lastBacktest: BacktestResponse | null;
  predictions: PredictionRow[];
  dataInfo: FetchResponse | null;
  
  // Actions
  setLastTraining: (training: TrainResponse | null) => void;
  setLastEvaluation: (evaluation: EvaluateResponse | null) => void;
  setLastBacktest: (backtest: BacktestResponse | null) => void;
  setPredictions: (predictions: PredictionRow[]) => void;
  setDataInfo: (dataInfo: FetchResponse | null) => void;
  clearAll: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      lastTraining: null,
      lastEvaluation: null,
      lastBacktest: null,
      predictions: [],
      dataInfo: null,
      
      setLastTraining: (training) => set({ lastTraining: training }),
      setLastEvaluation: (evaluation) => set({ lastEvaluation: evaluation }),
      setLastBacktest: (backtest) => set({ lastBacktest: backtest }),
      setPredictions: (predictions) => set({ predictions }),
      setDataInfo: (dataInfo) => set({ dataInfo }),
      clearAll: () => set({
        lastTraining: null,
        lastEvaluation: null,
        lastBacktest: null,
        predictions: [],
        dataInfo: null,
      }),
    }),
    {
      name: 'futebol-1x2-storage',
    }
  )
);
