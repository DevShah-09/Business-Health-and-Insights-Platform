/**
 * useInsights — fetches AI insights, refreshes on transaction changes
 */
import { useState, useEffect, useCallback } from 'react';
import { getInsights } from '../services/insightService';

export function useInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(() => {
    setLoading(true);
    getInsights()
      .then((d) => {
        // API returns { insights: [], narrative, health_score, recommendations, risk_flags }
        const cards = Array.isArray(d) ? d : (d?.insights || []);
        setInsights(cards);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch insights:', err);
        setError('Unable to load insights.');
        setInsights([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchInsights();
    window.addEventListener('financial-data-refresh', fetchInsights);
    return () => window.removeEventListener('financial-data-refresh', fetchInsights);
  }, [fetchInsights]);

  return { insights, loading, error, refetch: fetchInsights };
}
