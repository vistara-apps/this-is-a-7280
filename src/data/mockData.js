export const getMockRecommendations = (userPreferences, filters, isPremium = false) => {
  const baseRecommendations = [
    {
      title: "The Grand Budapest Hotel",
      description: "A whimsical comedy-drama about the adventures of a legendary concierge and his protégé at a famous European hotel.",
      year: 2014,
      duration: "1h 39m",
      genres: ["Comedy", "Drama"],
      rating: 8.1,
      matchScore: 92,
      posterUrl: null,
      isPremiumRecommendation: false
    },
    {
      title: "Stranger Things",
      description: "A group of young friends in 1980s Indiana discover supernatural forces and government secrets threatening their town.",
      year: 2016,
      duration: "50m/episode",
      genres: ["Sci-Fi", "Horror", "Drama"],
      rating: 8.7,
      matchScore: 88,
      posterUrl: null,
      isPremiumRecommendation: false
    },
    {
      title: "Parasite",
      description: "A dark comedy thriller about class conflict when a poor family infiltrates the household of a wealthy family.",
      year: 2019,
      duration: "2h 12m",
      genres: ["Thriller", "Drama"],
      rating: 8.6,
      matchScore: 90,
      posterUrl: null,
      isPremiumRecommendation: true
    },
    {
      title: "Ted Lasso",
      description: "An American football coach moves to England to coach soccer despite having no experience in the sport.",
      year: 2020,
      duration: "30m/episode",
      genres: ["Comedy", "Drama", "Sport"],
      rating: 8.8,
      matchScore: 85,
      posterUrl: null,
      isPremiumRecommendation: false
    },
    {
      title: "Moonlight",
      description: "A young black man grapples with his identity and sexuality while experiencing the physical and emotional brutality of growing up.",
      year: 2016,
      duration: "1h 51m",
      genres: ["Drama"],
      rating: 7.4,
      matchScore: 87,
      posterUrl: null,
      isPremiumRecommendation: true
    },
    {
      title: "The Bear",
      description: "A young chef returns to Chicago to run his family's Italian beef sandwich shop following a tragedy.",
      year: 2022,
      duration: "25m/episode",
      genres: ["Comedy", "Drama"],
      rating: 8.7,
      matchScore: 89,
      posterUrl: null,
      isPremiumRecommendation: false
    }
  ];

  // Filter based on user preferences and current filters
  let filtered = baseRecommendations;

  // Apply genre filter
  if (filters.genre) {
    filtered = filtered.filter(item => 
      item.genres.some(genre => 
        genre.toLowerCase().includes(filters.genre.toLowerCase())
      )
    );
  }

  // Apply search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.genres.some(genre => genre.toLowerCase().includes(searchTerm))
    );
  }

  // If premium, include premium recommendations
  if (!isPremium) {
    filtered = filtered.filter(item => !item.isPremiumRecommendation);
  }

  // If no results after filtering, return original recommendations
  if (filtered.length === 0) {
    filtered = baseRecommendations.filter(item => !item.isPremiumRecommendation || isPremium);
  }

  // Add some randomization to match scores based on user preferences
  return filtered.map(item => ({
    ...item,
    matchScore: calculateMatchScore(item, userPreferences),
    isPremiumRecommendation: isPremium && item.isPremiumRecommendation
  }));
};

const calculateMatchScore = (item, userPreferences) => {
  let score = 70; // Base score

  // Boost score if genres match user preferences
  if (userPreferences.genres) {
    const genreMatches = item.genres.filter(genre =>
      userPreferences.genres.some(userGenre =>
        userGenre.toLowerCase() === genre.toLowerCase()
      )
    ).length;
    score += genreMatches * 5;
  }

  // Add some randomness
  score += Math.floor(Math.random() * 10) - 5;

  // Ensure score is between 70-99
  return Math.min(99, Math.max(70, score));
};