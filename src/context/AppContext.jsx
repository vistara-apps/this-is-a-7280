import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [preferences, setPreferences] = useState({
    genres: [],
    actors: [],
    directors: [],
    mood: '',
    timeAvailable: '',
    streamingPlatforms: []
  })
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOnboarded, setIsOnboarded] = useState(false)

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('cinematch_user')
    const savedPreferences = localStorage.getItem('cinematch_preferences')
    const savedOnboarded = localStorage.getItem('cinematch_onboarded')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
    if (savedOnboarded) {
      setIsOnboarded(true)
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('cinematch_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setPreferences({
      genres: [],
      actors: [],
      directors: [],
      mood: '',
      timeAvailable: '',
      streamingPlatforms: []
    })
    setRecommendations([])
    setIsOnboarded(false)
    localStorage.removeItem('cinematch_user')
    localStorage.removeItem('cinematch_preferences')
    localStorage.removeItem('cinematch_onboarded')
  }

  const updatePreferences = (newPreferences) => {
    const updated = { ...preferences, ...newPreferences }
    setPreferences(updated)
    localStorage.setItem('cinematch_preferences', JSON.stringify(updated))
  }

  const completeOnboarding = () => {
    setIsOnboarded(true)
    localStorage.setItem('cinematch_onboarded', 'true')
  }

  const generateRecommendations = async () => {
    setLoading(true)
    try {
      // Simulate AI recommendation generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockRecommendations = [
        {
          id: 1,
          title: "Dune: Part Two",
          type: "movie",
          genre: ["Sci-Fi", "Adventure"],
          duration: "2h 46m",
          rating: 8.8,
          description: "Paul Atreides unites with the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
          poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop&crop=faces",
          platforms: ["Netflix", "Prime Video"],
          mood: ["Epic", "Adventurous"],
          matchScore: 95
        },
        {
          id: 2,
          title: "The Bear",
          type: "series",
          genre: ["Comedy", "Drama"],
          duration: "30m episodes",
          rating: 9.1,
          description: "A young chef from the fine dining world returns to Chicago to run his deceased brother's sandwich shop.",
          poster: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=450&fit=crop&crop=faces",
          platforms: ["Hulu", "Disney+"],
          mood: ["Intense", "Emotional"],
          matchScore: 92
        },
        {
          id: 3,
          title: "Everything Everywhere All at Once",
          type: "movie",
          genre: ["Comedy", "Sci-Fi", "Drama"],
          duration: "2h 19m",
          rating: 8.7,
          description: "A Chinese-American woman gets swept up in an insane adventure in which she alone can save existence.",
          poster: "https://images.unsplash.com/photo-1489599316561-0e2e37c05188?w=300&h=450&fit=crop&crop=faces",
          platforms: ["Prime Video", "Apple TV+"],
          mood: ["Quirky", "Mind-bending"],
          matchScore: 89
        },
        {
          id: 4,
          title: "Wednesday",
          type: "series",
          genre: ["Comedy", "Horror", "Mystery"],
          duration: "45m episodes",
          rating: 8.2,
          description: "Wednesday Addams attempts to master her emerging psychic ability, thwart a monstrous killing spree.",
          poster: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=300&h=450&fit=crop&crop=faces",
          platforms: ["Netflix"],
          mood: ["Dark", "Quirky"],
          matchScore: 87
        }
      ]
      
      setRecommendations(mockRecommendations)
    } catch (error) {
      console.error('Error generating recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    preferences,
    recommendations,
    loading,
    isOnboarded,
    login,
    logout,
    updatePreferences,
    completeOnboarding,
    generateRecommendations
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}