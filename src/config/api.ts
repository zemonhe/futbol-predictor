// Add your API configuration here
// src/config/api.ts
/**
 * Configuração centralizada da API do backend.
 * Substitua a URL abaixo pela URL real do seu serviço no Render.
 */
export const API_CONFIG = {
  // ⚠️ SUBSTITUA pela URL do SEU backend no Render
  BASE_URL: "https://gts-stats-backend.onrender.com",
  ENDPOINTS: {
    HEALTH: "/health",
    FETCH: "/fetch",
    TRAIN: "/train",
    PREDICT: "/predict",
    UPLOAD: "/upload_csv",
    EVALUATE: "/evaluate",
    BACKTEST: "/backtest"
  }
} as const;

// Tipos de dados para as requisições (opcional, mas recomendado)
export interface FetchBody {
  seasons: number[];
  leagues: string[];
}

export interface PredictBody {
  fixturesCsvPath: string;
}
