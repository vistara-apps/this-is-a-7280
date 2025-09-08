import React from 'react';
import { Heart, Zap, Brain, Laugh, Eye, Sparkles } from 'lucide-react';

const MoodSelector = ({ selectedMoods, onMoodChange }) => {
  const moods = [
    { id: 'feel-good', label: 'Feel Good', icon: Heart, color: 'text-pink-400' },
    { id: 'exciting', label: 'Exciting', icon: Zap, color: 'text-yellow-400' },
    { id: 'thought-provoking', label: 'Thought Provoking', icon: Brain, color: 'text-purple-400' },
    { id: 'funny', label: 'Funny', icon: Laugh, color: 'text-green-400' },
    { id: 'suspenseful', label: 'Suspenseful', icon: Eye, color: 'text-red-400' },
    { id: 'inspiring', label: 'Inspiring', icon: Sparkles, color: 'text-blue-400' },
    { id: 'relaxing', label: 'Relaxing', icon: Heart, color: 'text-indigo-400' },
    { id: 'intense', label: 'Intense', icon: Zap, color: 'text-orange-400' }
  ];

  const toggleMood = (mood) => {
    if (selectedMoods.includes(mood)) {
      onMoodChange(selectedMoods.filter(m => m !== mood));
    } else {
      onMoodChange([...selectedMoods, mood]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {moods.map((mood) => {
        const Icon = mood.icon;
        const isSelected = selectedMoods.includes(mood.id);
        
        return (
          <button
            key={mood.id}
            onClick={() => toggleMood(mood.id)}
            className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 ${
              isSelected
                ? 'bg-primary text-white border-primary'
                : 'bg-gray-800 text-dark-text-primary border-gray-700 hover:border-primary/50'
            }`}
          >
            <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : mood.color}`} />
            <span>{mood.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;