import { useState } from 'react';
import { useRecommendationContext } from '../context/RecommendationContext';
import { generateAIRecommendations } from '../services/aiService';
import { getMockRecommendations } from '../data/mockData';

export const useRecommendations = () => {
  const { recommendations, setRecommendations, loading, setLoading } = useRecommendationContext();

  const generateRecommendations = async (userPreferences, filters, isPremium = false) => {
    setLoading(true);
    
    try {
      // Try to get AI recommendations first
      let newRecommendations;
      
      try {
        newRecommendations = await generateAIRecommendations(userPreferences, filters, isPremium);
      } catch (error) {
        console.warn('AI service unavailable, using mock data:', error);
        // Fallback to mock data if AI service fails
        newRecommendations = getMockRecommendations(userPreferences, filters, isPremium);
      }
      
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      // Always fallback to mock data
      const mockRecommendations = getMockRecommendations(userPreferences, filters, isPremium);
      setRecommendations(mockRecommendations);
    } finally {
      setLoading(false);
    }
  };

  return {
    recommendations,
    loading,
    generateRecommendations
  };
};