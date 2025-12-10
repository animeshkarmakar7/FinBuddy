import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import investmentAPI from '../services/investmentService';

// WebSocket needs base URL without /api path
const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

/**
 * Hook for real-time price updates via WebSocket
 * @param {Array} symbols - Array of symbols to subscribe to
 * @returns {Object} - { prices, connected, error }
 */
export const useLivePrices = (symbols = []) => {
  const [prices, setPrices] = useState({});
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!symbols || symbols.length === 0) return;

    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
      setError(null);
      
      // Subscribe to symbols
      newSocket.emit('subscribe', symbols);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ WebSocket connection error:', err);
      setConnected(false);
      setError('Connection failed. Using polling fallback.');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setConnected(false);
    });

    // Price update event
    newSocket.on('priceUpdate', ({ symbol, price, type }) => {
      setPrices(prev => ({
        ...prev,
        [symbol]: price
      }));
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      if (newSocket) {
        newSocket.emit('unsubscribe', symbols);
        newSocket.disconnect();
      }
    };
  }, [symbols.join(',')]); // Re-subscribe if symbols change

  return { prices, connected, error };
};

/**
 * Hook for managing investments
 */
export const useInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const response = await investmentAPI.getAll();
      
      setInvestments(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching investments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  return {
    investments,
    loading,
    error,
    refetch: fetchInvestments
  };
};

/**
 * Hook for portfolio summary
 */
export const usePortfolioSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await investmentAPI.getPortfolioSummary();
      
      setSummary(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching portfolio summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary
  };
};

export default useLivePrices;
