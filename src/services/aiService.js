import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const generateAIRecommendations = async (userPreferences, filters, isPremium = false) => {
  try {
    const prompt = createRecommendationPrompt(userPreferences, filters, isPremium);
    
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are CineMatch AI, an expert movie and TV show recommendation engine. Generate personalized recommendations based on user preferences. Always respond with valid JSON containing an array of recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from AI');

    // Parse the JSON response
    const recommendations = JSON.parse(response);
    
    // Validate and format the recommendations
    return recommendations.map(item => ({
      title: item.title || 'Unknown Title',
      description: item.description || 'No description available',
      year: item.year || null,
      duration: item.duration || null,
      genres: item.genres || [],
      rating: item.rating || null,
      matchScore: item.matchScore || Math.floor(Math.random() * 30) + 70,
      posterUrl: item.posterUrl || null,
      isPremiumRecommendation: isPremium && item.isPremiumRecommendation
    }));
    
  } catch (error) {
    console.error('AI recommendation failed:', error);
    throw error;
  }
};

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