import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PreferencesContext = createContext();

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [preferences, setPreferences] = useState({
    theme: 'light',
    currency: 'usd',
    language: 'english',
  });

  // Currency symbols and formatting
  const currencyConfig = {
    usd: { symbol: '$', name: 'USD', locale: 'en-US' },
    eur: { symbol: '€', name: 'EUR', locale: 'de-DE' },
    gbp: { symbol: '£', name: 'GBP', locale: 'en-GB' },
    jpy: { symbol: '¥', name: 'JPY', locale: 'ja-JP' },
  };

  // Load preferences from user data
  useEffect(() => {
    if (user?.preferences?.appearance) {
      setPreferences({
        theme: user.preferences.appearance.theme || 'light',
        currency: user.preferences.appearance.currency || 'usd',
        language: user.preferences.appearance.language || 'english',
      });
    }
  }, [user]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [preferences.theme]);

  // Format currency based on user preference
  const formatCurrency = (amount, options = {}) => {
    const config = currencyConfig[preferences.currency];
    
    try {
      const formatted = new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.name,
        minimumFractionDigits: options.decimals !== undefined ? options.decimals : 0,
        maximumFractionDigits: options.decimals !== undefined ? options.decimals : 0,
        ...options,
      }).format(amount);
      
      return formatted;
    } catch (error) {
      // Fallback to simple formatting
      return `${config.symbol}${amount.toLocaleString()}`;
    }
  };

  // Get currency symbol
  const getCurrencySymbol = () => {
    return currencyConfig[preferences.currency].symbol;
  };

  // Update preferences
  const updatePreferences = (newPreferences) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const value = {
    preferences,
    updatePreferences,
    formatCurrency,
    getCurrencySymbol,
    currencyConfig,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
