import { useState, useEffect } from 'react';
import { forecastAPI } from '../services/goalService';

export const useForecast = (months = 6) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await forecastAPI.getSpendingForecast(months);
      setForecast(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch forecast');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [months]);

  return {
    forecast,
    loading,
    error,
    refetch: fetchForecast,
  };
};
