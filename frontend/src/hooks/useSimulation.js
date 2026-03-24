import { useState } from 'react';
import api from '../services/api';

export const useSimulation = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runSimulation = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const { business_id, income_change_pct, expense_change_pct, mode } = params;
      
      const response = await api.post(`/api/v1/businesses/${business_id}/simulation/run`, {
        income_change_pct,
        expense_change_pct,
        mode
      });
      
      setResults(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Simulation failed to run');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { runSimulation, results, loading, error };
};