import React, { useState } from 'react';
import { Check, X, Loader, TrendingUp, DollarSign, Target } from 'lucide-react';

const ActionButton = ({ action, onExecute, onDismiss }) => {
  const [loading, setLoading] = useState(false);
  const [executed, setExecuted] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    try {
      await onExecute(action);
      setExecuted(true);
      setTimeout(() => setExecuted(false), 2000);
    } catch (error) {
      console.error('Action execution failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = () => {
    switch (action.action) {
      case 'create_goal':
        return <Target className="w-5 h-5" />;
      case 'add_transaction':
        return <DollarSign className="w-5 h-5" />;
      case 'update_goal':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getActionLabel = () => {
    switch (action.action) {
      case 'create_goal':
        return `Create "${action.title}" Goal`;
      case 'add_transaction':
        return `Add ₹${action.amount.toLocaleString()} ${action.type}`;
      case 'update_goal':
        return `Add ₹${action.amount.toLocaleString()} to ${action.goalTitle}`;
      default:
        return 'Execute Action';
    }
  };

  const getActionDetails = () => {
    switch (action.action) {
      case 'create_goal':
        return `₹${action.targetAmount.toLocaleString()} by ${new Date(action.deadline).toLocaleDateString()}`;
      case 'add_transaction':
        return `${action.category} - ${action.merchant}`;
      case 'update_goal':
        return action.note || 'Update goal progress';
      default:
        return '';
    }
  };

  if (executed) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-green-800">Action Completed!</p>
          <p className="text-sm text-green-600">{getActionLabel()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          {getActionIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 mb-1">{getActionLabel()}</h4>
          <p className="text-sm text-gray-600">{getActionDetails()}</p>
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleExecute}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirm
                </>
              )}
            </button>
            
            <button
              onClick={onDismiss}
              disabled={loading}
              className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButton;
