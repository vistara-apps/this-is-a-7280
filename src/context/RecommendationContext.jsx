import React, { createContext, useContext, useState } from 'react';

const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const value = {
    recommendations,
    setRecommendations,
    loading,
    setLoading
  };

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendationContext = () => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error('useRecommendationContext must be used within a RecommendationProvider');
  }
  return context;
};