import React from 'react';
import AICoach from './AICoach';

const AICoachPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Financial Coach
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Get personalized financial advice powered by Groq & Llama 3
          </p>
        </div>

        {/* AI Coach Component - Full Page */}
        <div className="bg-white rounded-2xl shadow-2xl h-[calc(100vh-200px)] md:h-[calc(100vh-180px)] flex flex-col overflow-hidden">
          <AICoach onClose={null} isFullPage={true} />
        </div>
      </div>
    </div>
  );
};

export default AICoachPage;
