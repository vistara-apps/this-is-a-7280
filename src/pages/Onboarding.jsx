import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 
  'Thriller', 'Mystery', 'Fantasy', 'Animation', 'Documentary', 'Crime', 'Family'
]

const MOODS = [
  'Feel-good', 'Intense', 'Relaxing', 'Mind-bending', 'Emotional', 
  'Adventurous', 'Dark', 'Quirky', 'Epic', 'Nostalgic'
]

const TIME_OPTIONS = [
  'Under 30 minutes', '30-60 minutes', '1-2 hours', '2+ hours', 'Any length'
]

const PLATFORMS = [
  'Netflix', 'Prime Video', 'Disney+', 'Hulu', 'Apple TV+', 'HBO Max', 'Paramount+', 'Peacock'
]

const Onboarding = () => {
  const [step, setStep] = useState(1)
  const [tempPreferences, setTempPreferences] = useState({
    genres: [],
    moods: [],
    timeAvailable: '',
    streamingPlatforms: []
  })
  
  const { updatePreferences, completeOnboarding } = useAppContext()
  const navigate = useNavigate()

  const handleGenreToggle = (genre) => {
    setTempPreferences(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  const handleMoodToggle = (mood) => {
    setTempPreferences(prev => ({
      ...prev,
      moods: prev.moods.includes(mood)
        ? prev.moods.filter(m => m !== mood)
        : [...prev.moods, mood]
    }))
  }

  const handleTimeSelect = (time) => {
    setTempPreferences(prev => ({
      ...prev,
      timeAvailable: time
    }))
  }

  const handlePlatformToggle = (platform) => {
    setTempPreferences(prev => ({
      ...prev,
      streamingPlatforms: prev.streamingPlatforms.includes(platform)
        ? prev.streamingPlatforms.filter(p => p !== platform)
        : [...prev.streamingPlatforms, platform]
    }))
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      updatePreferences(tempPreferences)
      completeOnboarding()
      navigate('/')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return tempPreferences.genres.length > 0
      case 2:
        return tempPreferences.moods.length > 0
      case 3:
        return tempPreferences.timeAvailable !== ''
      case 4:
        return tempPreferences.streamingPlatforms.length > 0
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-2">What genres do you enjoy?</h2>
            <p className="text-text-secondary mb-8">Select all that apply (you can always change these later)</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    tempPreferences.genres.includes(genre)
                      ? 'bg-primary text-white border-primary shadow-glow'
                      : 'bg-surface border-surface-light text-text-primary hover:border-primary/50'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-2">What's your mood preference?</h2>
            <p className="text-text-secondary mb-8">Choose the moods that resonate with you</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MOODS.map((mood) => (
                <button
                  key={mood}
                  onClick={() => handleMoodToggle(mood)}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    tempPreferences.moods.includes(mood)
                      ? 'bg-accent text-white border-accent shadow-glow'
                      : 'bg-surface border-surface-light text-text-primary hover:border-accent/50'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-2">How much time do you usually have?</h2>
            <p className="text-text-secondary mb-8">This helps us recommend content that fits your schedule</p>
            
            <div className="space-y-3">
              {TIME_OPTIONS.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                    tempPreferences.timeAvailable === time
                      ? 'bg-primary text-white border-primary shadow-glow'
                      : 'bg-surface border-surface-light text-text-primary hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{time}</span>
                    {tempPreferences.timeAvailable === time && <Check className="w-5 h-5" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Which platforms do you use?</h2>
            <p className="text-text-secondary mb-8">We'll prioritize recommendations from these services</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform}
                  onClick={() => handlePlatformToggle(platform)}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    tempPreferences.streamingPlatforms.includes(platform)
                      ? 'bg-accent text-white border-accent shadow-glow'
                      : 'bg-surface border-surface-light text-text-primary hover:border-accent/50'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% complete</span>
          </div>
          <div className="w-full bg-surface-light rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="card min-h-[400px] flex flex-col">
          <div className="flex-1">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-light">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                step === 1
                  ? 'text-text-muted cursor-not-allowed'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                canProceed()
                  ? 'bg-primary text-white hover:bg-primary/90 shadow-glow'
                  : 'bg-surface-light text-text-muted cursor-not-allowed'
              }`}
            >
              <span>{step === 4 ? 'Complete Setup' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding