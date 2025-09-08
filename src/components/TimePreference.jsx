import React from 'react';
import { Clock } from 'lucide-react';

const TimePreference = ({ selectedTimes, onTimeChange }) => {
  const timeOptions = [
    { id: 'quick', label: 'Quick Watch', description: 'Under 30 minutes', duration: '< 30 min' },
    { id: 'short', label: 'Short Session', description: '30-60 minutes', duration: '30-60 min' },
    { id: 'medium', label: 'Standard Length', description: '1-2 hours', duration: '1-2 hours' },
    { id: 'long', label: 'Long Session', description: '2+ hours', duration: '2+ hours' },
    { id: 'binge', label: 'Binge Watch', description: 'Multiple episodes/movies', duration: '3+ hours' },
    { id: 'flexible', label: 'Flexible', description: 'Any length is fine', duration: 'Any' }
  ];

  const toggleTime = (timeId) => {
    if (selectedTimes.includes(timeId)) {
      onTimeChange(selectedTimes.filter(t => t !== timeId));
    } else {
      onTimeChange([...selectedTimes, timeId]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {timeOptions.map((option) => {
        const isSelected = selectedTimes.includes(option.id);
        
        return (
          <button
            key={option.id}
            onClick={() => toggleTime(option.id)}
            className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 text-left ${
              isSelected
                ? 'bg-primary text-white border-primary'
                : 'bg-gray-800 text-dark-text-primary border-gray-700 hover:border-primary/50'
            }`}
          >
            <Clock className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-white' : 'text-primary'}`} />
            <div>
              <div className="font-medium">{option.label}</div>
              <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-dark-text-secondary'}`}>
                {option.description}
              </div>
              <div className={`text-xs font-mono ${isSelected ? 'text-white/60' : 'text-primary'}`}>
                {option.duration}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TimePreference;