import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import RecommendationCard from '../components/RecommendationCard'
import FilterPanel from '../components/FilterPanel'
import LoadingSpinner from '../components/LoadingSpinner'
import { Sparkles, Filter, Zap, Star } from 'lucide-react'

const Dashboard = () => {
  const { user, recommendations, loading, generateRecommendations } = useAppContext()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    mood: '',
    timeAvailable: '',
    type: '', // movie or series
    genre: ''
  })

  useEffect(() => {
    if (recommendations.length === 0) {
      generateRecommendations()
    }
  }, [])

  const filteredRecommendations = recommendations.filter(item => {
    if (filters.mood && !item.mood.some(mood => mood.toLowerCase().includes(filters.mood.toLowerCase()))) {
      return false
    }
    if (filters.type && item.type !== filters.type) {
      return false
    }
    if (filters.genre && !item.genre.some(genre => genre.toLowerCase().includes(filters.genre.toLowerCase()))) {
      return false
    }
    return true
  })

  const handleRefresh = () => {
    generateRecommendations()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-surface/50 to-background border-b border-surface-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Here are your personalized recommendations based on your taste profile
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <Star className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-text-primary">{recommendations.length}</div>
              <div className="text-sm text-text-secondary">New Recommendations</div>
            </div>
            
            <div className="card text-center">
              <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-text-primary">95%</div>
              <div className="text-sm text-text-secondary">Average Match Score</div>
            </div>
            
            <div className="card text-center">
              <Sparkles className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-text-primary">{user?.isPremium ? 'Premium' : 'Free'}</div>
              <div className="text-sm text-text-secondary">Account Type</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{loading ? 'Generating...' : 'Get New Recommendations'}</span>
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filter Results</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-8 animate-slide-up">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner />
            <p className="text-text-secondary mt-4">Generating your personalized recommendations...</p>
          </div>
        )}

        {/* Recommendations Grid */}
        {!loading && filteredRecommendations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">
                Your Recommendations
                {filters.mood || filters.type || filters.genre ? ' (Filtered)' : ''}
              </h2>
              <span className="text-text-secondary">
                {filteredRecommendations.length} results
              </span>
            </div>
            
            <div className="recommendation-grid">
              {filteredRecommendations.map((item, index) => (
                <RecommendationCard 
                  key={item.id} 
                  item={item} 
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredRecommendations.length === 0 && recommendations.length > 0 && (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">No matches found</h3>
            <p className="text-text-secondary mb-6">Try adjusting your filters or get new recommendations</p>
            <button
              onClick={() => setFilters({ mood: '', timeAvailable: '', type: '', genre: '' })}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && recommendations.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">Ready for recommendations?</h3>
            <p className="text-text-secondary mb-6">Click the button above to get your personalized suggestions</p>
          </div>
        )}

        {/* Premium Upsell */}
        {!user?.isPremium && (
          <div className="mt-12 card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">Unlock Premium Features</h3>
            <p className="text-text-secondary mb-6">
              Get unlimited personalized recommendations, advanced filters, and curated lists for just $4.99/month
            </p>
            <button className="btn-primary">
              Upgrade to Premium
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard