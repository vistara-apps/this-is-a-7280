import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Header from './components/Header';
import Hero from './components/Hero';
import OnboardingFlow from './components/OnboardingFlow';
import Dashboard from './components/Dashboard';
import { UserProvider } from './context/UserContext';
import { RecommendationProvider } from './context/RecommendationContext';

function App() {
  const [currentView, setCurrentView] = useState('hero'); // hero, onboarding, dashboard
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const userData = localStorage.getItem('cinematch_user');
    if (userData) {
      setUser(JSON.parse(userData));
      setCurrentView('dashboard');
    }
  }, []);

  const handleStartOnboarding = () => {
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = (userData) => {
    setUser(userData);
    localStorage.setItem('cinematch_user', JSON.stringify(userData));
    setCurrentView('dashboard');
  };

  const handleBackToHero = () => {
    setCurrentView('hero');
    setUser(null);
    localStorage.removeItem('cinematch_user');
  };

  return (
    <UserProvider>
      <RecommendationProvider>
        <div className="min-h-screen bg-dark-bg text-dark-text-primary">
          <Header 
            currentView={currentView} 
            onBackToHero={handleBackToHero}
            user={user}
          />
          
          <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {currentView === 'hero' && (
              <Hero onStartOnboarding={handleStartOnboarding} />
            )}
            
            {currentView === 'onboarding' && (
              <OnboardingFlow onComplete={handleOnboardingComplete} />
            )}
            
            {currentView === 'dashboard' && user && (
              <Dashboard user={user} />
            )}
          </main>
        </div>
      </RecommendationProvider>
    </UserProvider>
  );
}

export default App;