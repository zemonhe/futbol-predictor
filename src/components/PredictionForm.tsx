// src/components/PredictionForm.tsx
import { useState } from 'react';
import { useApi } from '../hooks/useApi';

export function PredictionForm() {
  const [seasons, setSeasons] = useState([2024]);
  const [leagues, setLeagues] = useState(['PL']);
  const { loading, error, fetchMatches } = useApi();

  const handleFetch = async () => {
    try {
      const result = await fetchMatches(seasons, leagues);
      console.log('Dados obtidos:', result);
      // Atualize o estado do componente com os dados
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Buscar Dados de Jogos</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Temporadas:</label>
          <input
            type="text"
            value={seasons.join(',')}
            onChange={(e) => setSeasons(e.target.value.split(',').map(Number))}
            className="border p-2 rounded w-full"
            placeholder="2023,2024"
          />
        </div>
        
        <div>
          <label className="block mb-2">Ligas:</label>
          <input
            type="text"
            value={leagues.join(',')}
            onChange={(e) => setLeagues(e.target.value.split(','))}
            className="border p-2 rounded w-full"
            placeholder="PL,PD"
          />
        </div>
        
        <button
          onClick={handleFetch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'A carregar...' : 'Buscar Dados'}
        </button>
      </div>
    </div>
  );
}
