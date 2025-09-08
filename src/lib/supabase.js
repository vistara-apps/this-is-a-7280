import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using demo mode.')
}

export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseAnonKey || 'demo-key'
)

// Database table names
export const TABLES = {
  USERS: 'users',
  CONTENT: 'content',
  USER_PREFERENCES: 'user_preferences',
  USER_RATINGS: 'user_ratings',
  SUBSCRIPTIONS: 'subscriptions'
}

// Helper functions for common database operations
export const dbHelpers = {
  // User operations
  async createUser(userData) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserById(userId) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // User preferences operations
  async getUserPreferences(userId) {
    const { data, error } = await supabase
      .from(TABLES.USER_PREFERENCES)
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  },

  async upsertUserPreference(preferenceData) {
    const { data, error } = await supabase
      .from(TABLES.USER_PREFERENCES)
      .upsert([preferenceData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Content operations
  async getContent(filters = {}) {
    let query = supabase.from(TABLES.CONTENT).select('*')
    
    if (filters.genre) {
      query = query.contains('genres', [filters.genre])
    }
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getContentById(contentId) {
    const { data, error } = await supabase
      .from(TABLES.CONTENT)
      .select('*')
      .eq('id', contentId)
      .single()
    
    if (error) throw error
    return data
  },

  // User ratings operations
  async getUserRatings(userId) {
    const { data, error } = await supabase
      .from(TABLES.USER_RATINGS)
      .select('*, content(*)')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  },

  async upsertUserRating(ratingData) {
    const { data, error } = await supabase
      .from(TABLES.USER_RATINGS)
      .upsert([ratingData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Subscription operations
  async getUserSubscription(userId) {
    const { data, error } = await supabase
      .from(TABLES.SUBSCRIPTIONS)
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async createSubscription(subscriptionData) {
    const { data, error } = await supabase
      .from(TABLES.SUBSCRIPTIONS)
      .insert([subscriptionData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateSubscription(subscriptionId, updates) {
    const { data, error } = await supabase
      .from(TABLES.SUBSCRIPTIONS)
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
