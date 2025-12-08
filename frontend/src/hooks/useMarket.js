import { useState, useEffect } from 'react';
import marketAPI from '../services/marketService';

/**
 * Hook for trending stocks
 */
export const useTrendingStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await marketAPI.getTrendingStocks();
      setStocks(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching trending stocks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchStocks, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { stocks, loading, error, refetch: fetchStocks };
};

/**
 * Hook for top cryptos
 */
export const useTopCryptos = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      const response = await marketAPI.getTopCryptos();
      setCryptos(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching top cryptos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptos();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchCryptos, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { cryptos, loading, error, refetch: fetchCryptos };
};

/**
 * Hook for market search
 */
export const useMarketSearch = (query) => {
  const [results, setResults] = useState({ stocks: [], cryptos: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ stocks: [], cryptos: [] });
      return;
    }

    const searchMarket = async () => {
      try {
        setLoading(true);
        const response = await marketAPI.search(query);
        setResults(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error searching market:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeout = setTimeout(searchMarket, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return { results, loading, error };
};

/**
 * Hook for investment details
 */
export const useInvestmentDetails = (symbol, type) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol || !type) {
      setDetails(null);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await marketAPI.getDetails(symbol, type);
        setDetails(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching investment details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [symbol, type]);

  return { details, loading, error };
};
