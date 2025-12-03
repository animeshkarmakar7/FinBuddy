import { useState, useEffect, useCallback } from 'react';
import { aiAPI } from '../services/aiService';

/**
 * Hook for AI-powered transaction categorization
 * Automatically suggests categories as user types merchant name
 */
export const useAICategorization = (merchant, amount, type) => {
  const [category, setCategory] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('');

  // Debounce merchant input
  useEffect(() => {
    if (!merchant || merchant.length < 3) {
      setCategory('');
      setConfidence(0);
      setAlternatives([]);
      return;
    }

    const timer = setTimeout(() => {
      categorizeMerchant();
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [merchant, amount, type]);

  const categorizeMerchant = async () => {
    try {
      setLoading(true);
      const response = await aiAPI.categorize(merchant, amount, type);
      
      if (response.success) {
        setCategory(response.data.category);
        setConfidence(response.data.confidence);
        setAlternatives(response.data.alternatives || []);
        setSource(response.data.source);
      }
    } catch (error) {
      console.error('Categorization error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Learn from user correction
  const learnCorrection = useCallback(async (correctCategory) => {
    try {
      await aiAPI.learn(merchant, category, correctCategory);
      setCategory(correctCategory);
      setConfidence(1.0);
      setSource('user');
    } catch (error) {
      console.error('Learning error:', error);
    }
  }, [merchant, category]);

  return {
    category,
    confidence,
    alternatives,
    loading,
    source,
    learnCorrection,
    refreshCategory: categorizeMerchant,
  };
};
