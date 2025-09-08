import OpenAI from 'openai';
import { dbHelpers } from '../lib/supabase';
import { subscriptionService } from './subscriptionService';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

// Enhanced AI recommendation service
export const aiService = {
  // Generate personalized recommendations using AI
  async generateRecommendations(userId, filters = {}, options = {}) {
    try {
      // Check subscription limits
      await subscriptionService.incrementRecommendationUsage(userId);
      
      // Get user preferences and history
      const [userPreferences, userRatings, subscription] = await Promise.all([
        dbHelpers.getUserPreferences(userId),
        dbHelpers.getUserRatings(userId),
        subscriptionService.getUserSubscription(userId)
      ]);

      const isPremium = subscription?.status === 'active';
      
      // Create enhanced prompt with user history
      const prompt = this.createEnhancedPrompt(userPreferences, userRatings, filters, isPremium);
      
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(isPremium)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: isPremium ? 0.8 : 0.7, // More creative for premium users
        max_tokens: isPremium ? 3000 : 2000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error('No response from AI');

      // Parse and enhance recommendations
      const recommendations = JSON.parse(response);
      const enhancedRecommendations = await this.enhanceRecommendations(recommendations, userId, isPremium);
      
      // Save recommendation session for learning
      await this.saveRecommendationSession(userId, filters, enhancedRecommendations);
      
      return enhancedRecommendations;
      
    } catch (error) {
      console.error('AI recommendation failed:', error);
      
      // Fallback to content-based recommendations
      return this.getFallbackRecommendations(userId, filters);
    }
  },

  // Create enhanced prompt with user history and preferences
  createEnhancedPrompt(userPreferences, userRatings, filters, isPremium) {
    const genrePrefs = userPreferences.filter(p => p.preference_type === 'genre').map(p => p.preference_value);
    const moodPrefs = userPreferences.filter(p => p.preference_type === 'mood').map(p => p.preference_value);
    const likedContent = userRatings.filter(r => r.rating >= 4).map(r => r.content?.title).filter(Boolean);
    const dislikedContent = userRatings.filter(r => r.rating <= 2).map(r => r.content?.title).filter(Boolean);

    let prompt = `Generate ${isPremium ? '8' : '6'} highly personalized movie and TV show recommendations.

USER PROFILE:
- Preferred Genres: ${genrePrefs.join(', ') || 'Various'}
- Preferred Moods: ${moodPrefs.join(', ') || 'Various'}
- Recently Liked: ${likedContent.slice(0, 5).join(', ') || 'None yet'}
- Recently Disliked: ${dislikedContent.slice(0, 3).join(', ') || 'None yet'}

CURRENT FILTERS:
- Mood: ${filters.mood || 'Any'}
- Time Available: ${filters.timeAvailable || 'Any'}
- Content Type: ${filters.type || 'Any'}
- Genre: ${filters.genre || 'Any'}
- Search Query: ${filters.search || 'None'}

${isPremium ? `
PREMIUM USER REQUIREMENTS:
- Include 2-3 niche/indie recommendations
- Provide deeper analysis of why each recommendation matches
- Include hidden gems and critically acclaimed content
- Consider international and arthouse films
- Provide more sophisticated matching logic
` : ''}

RECOMMENDATION CRITERIA:
- Avoid content similar to disliked items
- Prioritize content matching preferred genres and moods
- Consider current filters as high priority
- Ensure variety in recommendations
- Include both popular and lesser-known options

Return a JSON array with this exact structure:`;

    return prompt + this.getRecommendationSchema(isPremium);
  },

  // Get system prompt based on user tier
  getSystemPrompt(isPremium) {
    const basePrompt = "You are CineMatch AI, an expert movie and TV show recommendation engine. You understand user preferences deeply and provide personalized recommendations.";
    
    if (isPremium) {
      return basePrompt + " For premium users, you provide more sophisticated, niche recommendations with deeper analysis and include hidden gems, international content, and arthouse films.";
    }
    
    return basePrompt + " Provide accurate, engaging recommendations that match user preferences. Always respond with valid JSON.";
  },

  // Get recommendation JSON schema
  getRecommendationSchema(isPremium) {
    return `
[
  {
    "title": "Movie/Show Title",
    "description": "Engaging description (2-3 sentences)",
    "year": 2023,
    "duration": "1h 45m" or "45m/episode",
    "genres": ["Genre1", "Genre2"],
    "rating": 8.5,
    "matchScore": 85,
    "type": "movie" or "series",
    "director": "Director Name",
    "cast": ["Actor1", "Actor2"],
    "streamingPlatforms": ["Netflix", "Prime Video"],
    "moodTags": ["Mood1", "Mood2"],
    "posterUrl": null,
    "isNiche": ${isPremium ? 'true/false' : 'false'},
    "isPremiumRecommendation": ${isPremium},
    "whyRecommended": "Brief explanation of why this matches user preferences"
  }
]`;
  },

  // Enhance recommendations with additional data
  async enhanceRecommendations(recommendations, userId, isPremium) {
    return recommendations.map((item, index) => ({
      id: `rec_${Date.now()}_${index}`,
      title: item.title || 'Unknown Title',
      description: item.description || 'No description available',
      year: item.year || null,
      duration: item.duration || null,
      genres: Array.isArray(item.genres) ? item.genres : [],
      rating: item.rating || null,
      matchScore: item.matchScore || Math.floor(Math.random() * 30) + 70,
      type: item.type || 'movie',
      director: item.director || null,
      cast: Array.isArray(item.cast) ? item.cast : [],
      streamingPlatforms: Array.isArray(item.streamingPlatforms) ? item.streamingPlatforms : [],
      moodTags: Array.isArray(item.moodTags) ? item.moodTags : [],
      posterUrl: item.posterUrl || this.generatePlaceholderPoster(item.title),
      isNiche: item.isNiche || false,
      isPremiumRecommendation: isPremium && item.isPremiumRecommendation,
      whyRecommended: item.whyRecommended || 'Matches your preferences',
      recommendedAt: new Date().toISOString()
    }));
  },

  // Generate placeholder poster URL
  generatePlaceholderPoster(title) {
    const encodedTitle = encodeURIComponent(title);
    return `https://images.unsplash.com/photo-1489599316561-0e2e37c05188?w=300&h=450&fit=crop&crop=faces&auto=format&q=80&txt=${encodedTitle}`;
  },

  // Save recommendation session for learning
  async saveRecommendationSession(userId, filters, recommendations) {
    try {
      await dbHelpers.createRecommendationSession({
        user_id: userId,
        session_data: {
          filters,
          timestamp: new Date().toISOString(),
          recommendationCount: recommendations.length
        },
        recommendations: recommendations
      });
    } catch (error) {
      console.error('Failed to save recommendation session:', error);
      // Don't throw - this is not critical
    }
  },

  // Fallback recommendations when AI fails
  async getFallbackRecommendations(userId, filters) {
    try {
      // Get content from database with basic filtering
      const content = await dbHelpers.getContent({
        type: filters.type,
        genre: filters.genre,
        limit: 6
      });

      return content.map((item, index) => ({
        id: `fallback_${item.id}`,
        title: item.title,
        description: item.description,
        year: item.release_date ? new Date(item.release_date).getFullYear() : null,
        duration: item.duration ? `${item.duration}m` : null,
        genres: item.genres || [],
        rating: item.rating,
        matchScore: Math.floor(Math.random() * 20) + 60, // Lower scores for fallback
        type: item.type,
        posterUrl: item.poster_url || this.generatePlaceholderPoster(item.title),
        streamingPlatforms: item.streaming_platforms || [],
        moodTags: item.mood_tags || [],
        whyRecommended: 'Popular content matching your filters',
        isFallback: true
      }));
    } catch (error) {
      console.error('Fallback recommendations failed:', error);
      return this.getHardcodedFallback();
    }
  },

  // Hard-coded fallback when everything else fails
  getHardcodedFallback() {
    return [
      {
        id: 'fallback_1',
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        year: 1994,
        duration: '2h 22m',
        genres: ['Drama'],
        rating: 9.3,
        matchScore: 85,
        type: 'movie',
        posterUrl: 'https://images.unsplash.com/photo-1489599316561-0e2e37c05188?w=300&h=450&fit=crop',
        whyRecommended: 'Universally acclaimed classic',
        isFallback: true
      }
    ];
  },

  // Learn from user feedback
  async learnFromFeedback(userId, contentId, feedback) {
    try {
      const score = feedback === 'like' ? 0.8 : feedback === 'dislike' ? 0.2 : 0.5;
      
      await dbHelpers.upsertUserPreference({
        user_id: userId,
        content_id: contentId,
        preference_type: feedback,
        score: score
      });
    } catch (error) {
      console.error('Failed to learn from feedback:', error);
    }
  }
};

// Legacy function for backward compatibility
export const generateAIRecommendations = aiService.generateRecommendations;

const createRecommendationPrompt = (userPreferences, filters, isPremium) => {
  let prompt = `Generate 6 movie and TV show recommendations for a user with these preferences:

User Preferences:
- Favorite Genres: ${userPreferences.genres?.join(', ') || 'Various'}
- Preferred Moods: ${userPreferences.moods?.join(', ') || 'Various'}
- Time Preferences: ${userPreferences.timePreferences?.join(', ') || 'Any'}

Current Filters:
- Mood: ${filters.mood || 'Any'}
- Time: ${filters.time || 'Any'}
- Genre: ${filters.genre || 'Any'}
- Search: ${filters.search || 'None'}

${isPremium ? `
This is a PREMIUM user, so provide:
- More niche and sophisticated recommendations
- Hidden gems and critically acclaimed content
- Detailed analysis of why each recommendation matches their taste
- Higher quality, curated suggestions
` : ''}

Return a JSON array of 6 recommendations with this exact structure:
[
  {
    "title": "Movie/Show Title",
    "description": "Brief engaging description (2-3 sentences)",
    "year": 2023,
    "duration": "1h 45m" or "45m/episode",
    "genres": ["Genre1", "Genre2"],
    "rating": 8.5,
    "matchScore": 85,
    "posterUrl": null,
    "isPremiumRecommendation": ${isPremium}
  }
]

Focus on variety and ensure each recommendation genuinely matches the user's stated preferences.`;

  return prompt;
};
