import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

import Portfolio from "./components/Portfolio";
import MarketExplorer from "./components/MarketExplorer";
import Wallet from "./components/Wallet";
import Analytics from "./components/Analytics";
import Goals from "./components/Goals";
import Profile from "./components/Profile";
import AICoachPage from "./components/AICoachPage";

function App() {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-violet-600 font-semibold">Loading FinBuddy...</p>
        </div>
      </div>
    );
  }

  // Show Auth component if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => setActiveSection('Dashboard')} />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <Dashboard />;
      case 'AI Coach':
        return <AICoachPage />;

      case 'Portfolio':
        return <Portfolio />;
      case 'Market Explorer':
        return <MarketExplorer />;
      case 'Wallet':
        return <Wallet />;
      case 'Analytics':
        return <Analytics />;
      case 'Goals':
        return <Goals />;
      case 'Profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      {renderSection()}
    </>
  );
}

export default App;
