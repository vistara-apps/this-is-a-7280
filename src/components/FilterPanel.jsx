import React from 'react'
import { X } from 'lucide-react'

const FilterPanel = ({ filters, onFiltersChange }) => {
  const updateFilter = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    onFiltersChange({
      mood: '',
      timeAvailable: '',
      type: '',
      genre: ''
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Filter Recommendations</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-text-secondary hover:text-text-primary transition-colors duration-200 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Content Type */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Content Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="input w-full"
          >
            <option value="">All</option>
            <option value="movie">Movies</option>
            <option value="series">TV Series</option>
          </select>
        </div>

        {/* Genre */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Genre
          </label>
          <select
            value={filters.genre}
            onChange={(e) => updateFilter('genre', e.target.value)}
            className="input w-full"
          >
            <option value="">All Genres</option>
            <option value="action">Action</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="thriller">Thriller</option>
            <option value="mystery">Mystery</option>
            <option value="fantasy">Fantasy</option>
            <option value="animation">Animation</option>
            <option value="documentary">Documentary</option>
            <option value="crime">Crime</option>
            <option value="family">Family</option>
          </select>
        </div>

        {/* Mood */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Mood
          </label>
          <select
            value={filters.mood}
            onChange={(e) => updateFilter('mood', e.target.value)}
            className="input w-full"
          >
            <option value="">All Moods</option>
            <option value="feel-good">Feel-good</option>
            <option value="intense">Intense</option>
            <option value="relaxing">Relaxing</option>
            <option value="mind-bending">Mind-bending</option>
            <option value="emotional">Emotional</option>
            <option value="adventurous">Adventurous</option>
            <option value="dark">Dark</option>
            <option value="quirky">Quirky</option>
            <option value="epic">Epic</option>
            <option value="nostalgic">Nostalgic</option>
          </select>
        </div>

        {/* Time Available */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Time Available
          </label>
          <select
            value={filters.timeAvailable}
            onChange={(e) => updateFilter('timeAvailable', e.target.value)}
            className="input w-full"
          >
            <option value="">Any Length</option>
            <option value="under-30">Under 30 minutes</option>
            <option value="30-60">30-60 minutes</option>
            <option value="1-2">1-2 hours</option>
            <option value="2+">2+ hours</option>
          </select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-surface-light">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null
              
              const labels = {
                type: 'Type',
                genre: 'Genre',
                mood: 'Mood',
                timeAvailable: 'Time'
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  <span>{labels[key]}: {value}</span>
                  <button
                    onClick={() => updateFilter(key, '')}
                    className="hover:text-primary/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel