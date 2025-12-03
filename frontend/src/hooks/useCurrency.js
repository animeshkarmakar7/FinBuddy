// Utility hook to format currency based on user preferences
import { usePreferences } from '../context/PreferencesContext';

export const useCurrency = () => {
  const { formatCurrency, getCurrencySymbol } = usePreferences();
  
  return {
    formatCurrency,
    getCurrencySymbol,
    // Helper to format with default settings
    format: (amount) => formatCurrency(amount),
    // Helper to format with decimals
    formatWithDecimals: (amount, decimals = 2) => formatCurrency(amount, { decimals }),
  };
};
