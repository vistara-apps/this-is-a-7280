import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import GenreSelector from './GenreSelector';
import MoodSelector from './MoodSelector';
import TimePreference from './TimePreference';

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    email: '',
    genres: [],
    moods: [],
    timePreferences: [],
    likedContent: [],
    dislikedContent: []
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      const userData = {
        userId: Date.now().toString(),
        email: preferences.email,
        preferences: preferences,
        watchHistory: [],
        createdAt: new Date().toISOString()
      };
      onComplete(userData);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updatePreferences = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return preferences.email.length > 0;
      case 2:
        return preferences.genres.length > 0;
      case 3:
        return preferences.moods.length > 0;
      case 4:
        return preferences.timePreferences.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="py-20">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-dark-text-secondary">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-dark-text-secondary">
              {Math.round((step / totalSteps) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="gradient-bg h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="card p-8">
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Welcome to CineMatch AI</h2>
              <p className="text-dark-text-secondary mb-8">
                Let's set up your profile to get personalized recommendations
              </p>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={preferences.email}
                  onChange={(e) => updatePreferences('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-center">What do you love watching?</h2>
              <p className="text-dark-text-secondary mb-8 text-center">
                Select your favorite genres (choose at least 3)
              </p>
              <GenreSelector
                selectedGenres={preferences.genres}
                onGenreChange={(genres) => updatePreferences('genres', genres)}
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-center">What's your mood?</h2>
              <p className="text-dark-text-secondary mb-8 text-center">
                Select moods that match your viewing preferences
              </p>
              <MoodSelector
                selectedMoods={preferences.moods}
                onMoodChange={(moods) => updatePreferences('moods', moods)}
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-center">How much time do you have?</h2>
              <p className="text-dark-text-secondary mb-8 text-center">
                Tell us about your typical viewing time
              </p>
              <TimePreference
                selectedTimes={preferences.timePreferences}
                onTimeChange={(times) => updatePreferences('timePreferences', times)}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex items-center space-x-2 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{step === totalSteps ? 'Complete Setup' : 'Next'}</span>
            {step === totalSteps ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;