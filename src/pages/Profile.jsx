import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { User, Settings, Crown, Heart, Clock, Tv } from 'lucide-react'

const Profile = () => {
  const { user, preferences, updatePreferences } = useAppContext()
  const [activeTab, setActiveTab] = useState('preferences')
  
  const handlePreferenceUpdate = (key, value) => {
    updatePreferences({ [key]: value })
  }

  const toggleGenre = (genre) => {
    const updatedGenres = preferences.genres.includes(genre)
      ? preferences.genres.filter(g => g !== genre)
      : [...preferences.genres, genre]
    handlePreferenceUpdate('genres', updatedGenres)
  }

  const tabs = [
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'activity', label: 'Activity', icon: Heart },
    { id: 'account', label: 'Account', icon: User }
  ]

  const GENRES = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 
    'Thriller', 'Mystery', 'Fantasy', 'Animation', 'Documentary', 'Crime', 'Family'
  ]

  const renderPreferences = () => (
    <div className="space-y-8">
      {/* Genres */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Favorite Genres</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                preferences.genres.includes(genre)
                  ? 'bg-primary text-white border-primary shadow-glow'
                  : 'bg-surface border-surface-light text-text-primary hover:border-primary/50'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Time Preference */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Preferred Watch Time</h3>
        <select
          value={preferences.timeAvailable || ''}
          onChange={(e) => handlePreferenceUpdate('timeAvailable', e.target.value)}
          className="input w-full max-w-md"
        >
          <option value="">Select time preference</option>
          <option value="Under 30 minutes">Under 30 minutes</option>
          <option value="30-60 minutes">30-60 minutes</option>
          <option value="1-2 hours">1-2 hours</option>
          <option value="2+ hours">2+ hours</option>
          <option value="Any length">Any length</option>
        </select>
      </div>

      {/* Streaming Platforms */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Streaming Platforms</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Netflix', 'Prime Video', 'Disney+', 'Hulu', 'Apple TV+', 'HBO Max'].map((platform) => (
            <button
              key={platform}
              onClick={() => {
                const updated = preferences.streamingPlatforms.includes(platform)
                  ? preferences.streamingPlatforms.filter(p => p !== platform)
                  : [...preferences.streamingPlatforms, platform]
                handlePreferenceUpdate('streamingPlatforms', updated)
              }}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                preferences.streamingPlatforms.includes(platform)
                  ? 'bg-accent text-white border-accent shadow-glow'
                  : 'bg-surface border-surface-light text-text-primary hover:border-accent/50'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderActivity = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-surface-light rounded-lg">
            <Heart className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-text-primary">Liked "Dune: Part Two"</p>
              <p className="text-text-secondary text-sm">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-surface-light rounded-lg">
            <Tv className="w-5 h-5 text-accent" />
            <div>
              <p className="text-text-primary">Watched "The Bear" Episode 1</p>
              <p className="text-text-secondary text-sm">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-surface-light rounded-lg">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-text-primary">Updated time preference</p>
              <p className="text-text-secondary text-sm">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAccount = () => (
    <div className="space-y-6">
      {/* Account Info */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className="input w-full"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              className="input w-full"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Subscription</h3>
          {user?.isPremium && <Crown className="w-6 h-6 text-yellow-400" />}
        </div>
        
        {user?.isPremium ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-text-primary font-medium">Premium Active</span>
            </div>
            <p className="text-text-secondary">Next billing: January 15, 2024</p>
            <button className="btn-secondary">Manage Subscription</button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-text-secondary">You're on the free plan</p>
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold text-text-primary mb-2">Upgrade to Premium</h4>
              <ul className="text-sm text-text-secondary space-y-1 mb-4">
                <li>• Unlimited personalized recommendations</li>
                <li>• Advanced mood and time filters</li>
                <li>• Curated themed lists</li>
                <li>• Priority support</li>
              </ul>
              <button className="btn-primary">
                Upgrade for $4.99/month
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Profile Settings</h1>
          <p className="text-text-secondary">Manage your preferences and account settings</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-surface border border-surface-light rounded-lg p-1 inline-flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-glow'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'preferences' && renderPreferences()}
          {activeTab === 'activity' && renderActivity()}
          {activeTab === 'account' && renderAccount()}
        </div>
      </div>
    </div>
  )
}

export default Profile