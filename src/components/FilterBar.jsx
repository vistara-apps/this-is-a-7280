import React from 'react';
import { Filter, Clock, Heart, Film } from 'lucide-react';

const FilterBar = ({ filters, onChange, isPremium }) => {
  const moods = [
    { id: '', label: 'Any Mood' },
    { id: 'feel-good', label: 'Feel Good' },
    { id: 'exciting', label: 'Exciting' },
    { id: 'funny', label: 'Funny' },
    { id: 'suspenseful', label: 'Suspenseful' },
    { id: 'thought-provoking', label: 'Thought Provoking' },
  ];

  const timeRanges = [
    { id: '', label: 'Any Length' },
    { id: 'quick', label: 'Under 30 min' },
    { id: 'short', label: '30-60 min' },
    { id: 'medium', label: '1-2 hours' },
    { id: 'long', label: '2+ hours' },
  ];

  const genres = [
    { id: '', label: 'All Genres' },
    { id: 'action', label: 'Action' },
    { id: 'comedy', label: 'Comedy' },
    { id: 'drama', label: 'Drama' },
    { id: 'horror', label: 'Horror' },
    { id: 'sci-fi', label: 'Sci-Fi' },
    { id: 'romance', label: 'Romance' },
  ];

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center space-x-2 text-sm text-dark-text-secondary">
        <Filter className="w-4 h-4" />
        <span>Filters:</span>
      </div>

      {/* Mood Filter */}
      <div className="flex items-center space-x-2">
        <Heart className="w-4 h-4 text-pink-400" />
        <select
          value={filters.mood}
          onChange={(e) => onChange({ ...filters, mood: e.target.value })}
          className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        >
          {moods.map(mood => (
            <option key={mood.id} value={mood.id}>{mood.label}</option>
          ))}
        </select>
      </div>

      {/* Time Filter */}
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 text-blue-400" />
        <select
          value={filters.time}
          onChange={(e) => onChange({ ...filters, time: e.target.value })}
          className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        >
          {timeRanges.map(time => (
            <option key={time.id} value={time.id}>{time.label}</option>
          ))}
        </select>
      </div>

      {/* Genre Filter */}
      <div className="flex items-center space-x-2">
        <Film className="w-4 h-4 text-green-400" />
        <select
          value={filters.genre}
          onChange={(e) => onChange({ ...filters, genre: e.target.value })}
          className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        >
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.label}</option>
          ))}
        </select>
      </div>

      {isPremium && (
        <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
          Premium Filters Active
        </div>
      )}
    </div>
  );
};

export default FilterBar;