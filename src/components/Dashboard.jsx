import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import RecommendationCard from './RecommendationCard';
import FilterBar from './FilterBar';
import { useRecommendations } from '../hooks/useRecommendations';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { Sparkles, Crown, Loader } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [filters, setFilters] = useState({
    mood: '',
    time: '',
    genre: '',
    search: ''
  });
  const [isPremium, setIsPremium] = useState(false);
  const { recommendations, loading, generateRecommendations } = useRecommendations();
  const { createSession } = usePaymentContext();

  useEffect(() => {
    // Generate initial recommendations
    generateRecommendations(user.preferences, filters);
  }, []);

  const handleUpgrade = async () => {
    try {
      await createSession();
      setIsPremium(true);
      // Regenerate with premium features
      generateRecommendations(user.preferences, filters, true);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    generateRecommendations(user.preferences, newFilters, isPremium);
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user.email.split('@')[0]}!
            </h1>
            <p className="text-dark-text-secondary">
              Here are your personalized recommendations
            </p>
          </div>
          
          {!isPremium && (
            <button
              onClick={handleUpgrade}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade to Premium</span>
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <SearchBar
            value={filters.search}
            onChange={(search) => handleFiltersChange({ ...filters, search })}
            placeholder="Search for movies, shows, or describe what you want to watch..."
          />
          <FilterBar
            filters={filters}
            onChange={handleFiltersChange}
            isPremium={isPremium}
          />
        </div>
      </div>

      {/* Premium Banner */}
      {isPremium && (
        <div className="mb-8 p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
          <div className="flex items-center space-x-2 text-yellow-400">
            <Crown className="w-5 h-5" />
            <span className="font-medium">Premium Active</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-sm text-dark-text-secondary mt-1">
            Enjoying advanced AI recommendations and curated lists
          </p>
        </div>
      )}

      {/* Recommendations */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">
            {isPremium ? 'Premium AI Recommendations' : 'AI Recommendations'}
          </h2>
          {loading && <Loader className="w-4 h-4 animate-spin text-primary" />}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((item, index) => (
              <RecommendationCard
                key={index}
                item={item}
                isPremium={isPremium}
                onLike={() => {/* Handle like */}}
                onDislike={() => {/* Handle dislike */}}
                onSave={() => {/* Handle save */}}
              />
            ))}
          </div>
        )}

        {!loading && recommendations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
            <p className="text-dark-text-secondary">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;