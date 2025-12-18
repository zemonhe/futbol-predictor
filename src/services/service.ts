// src/services/api.service.ts
import { API_CONFIG, type FetchBody, type PredictBody } from '../config/api';

export class ApiService {
  private static async request<T>(
    endpoint: string,
    method: string = 'GET',
    data?: unknown
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API (${response.status}): ${errorText}`);
    }

    return response.json() as Promise<T>;
  }

  // Verifica se o backend está online
  static async healthCheck() {
    return this.request<{ status: string; time: string }>(API_CONFIG.ENDPOINTS.HEALTH);
  }

  // Busca dados da API de futebol
  static async fetchMatches(body: FetchBody) {
    return this.request(API_CONFIG.ENDPOINTS.FETCH, 'POST', body);
  }

  // Faz previsões para jogos futuros
  static async makePrediction(body: PredictBody) {
    return this.request(API_CONFIG.ENDPOINTS.PREDICT, 'POST', body);
  }

  // Faz upload de um ficheiro CSV (Nota: lógica diferente para FormData)
  static async uploadCSV(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD}`,
      {
        method: 'POST',
        body: formData,
        // NOTA: NÃO defina 'Content-Type' manualmente para FormData.
        // O browser define automaticamente com o boundary correto.
      }
    );

    if (!response.ok) {
      throw new Error(`Upload falhou: ${response.status}`);
    }

    return response.json();
  }
}
