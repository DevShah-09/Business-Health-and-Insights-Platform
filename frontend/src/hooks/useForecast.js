/**
 * useForecast — fetches forecast data, refreshes on transaction changes
 */
import { useState, useEffect, useCallback } from 'react';
import { getForecast } from '../services/forecastService';

export function useForecast() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchForecast = useCallback(() => {
    setLoading(true);
    getForecast()
      .then((d) => {
        setForecast(d);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch forecast:', err);
        setError('Unable to load forecast.');
        setForecast(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchForecast();
    window.addEventListener('financial-data-refresh', fetchForecast);
    return () => window.removeEventListener('financial-data-refresh', fetchForecast);
  }, [fetchForecast]);

  return { forecast, loading, error, refetch: fetchForecast };
}
