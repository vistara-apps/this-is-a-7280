import { supabase, dbHelpers } from '../lib/supabase'
import toast from 'react-hot-toast'

export const authService = {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || '',
            avatar_url: userData.avatar_url || ''
          }
        }
      })

      if (error) throw error

      if (data.user && !data.user.email_confirmed_at) {
        toast.success('Please check your email to confirm your account!')
      }

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error(error.message || 'Failed to create account')
      throw error
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast.success('Welcome back!')
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error(error.message || 'Failed to sign in')
      throw error
    }
  },

  // Sign in with OAuth (Google, etc.)
  async signInWithOAuth(provider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('OAuth sign in error:', error)
      toast.error(error.message || 'Failed to sign in with OAuth')
      throw error
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error(error.message || 'Failed to sign out')
      throw error
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  },

  // Get current session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('Get current session error:', error)
      return null
    }
  },

  // Update user profile
  async updateProfile(updates) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) throw error

      // Also update the user profile in our users table
      if (data.user) {
        await dbHelpers.updateUser(data.user.id, {
          name: updates.name,
          avatar_url: updates.avatar_url
        })
      }

      toast.success('Profile updated successfully')
      return data.user
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error(error.message || 'Failed to update profile')
      throw error
    }
  },

  // Update password
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      toast.success('Password updated successfully')
      return data.user
    } catch (error) {
      console.error('Update password error:', error)
      toast.error(error.message || 'Failed to update password')
      throw error
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      toast.success('Password reset email sent!')
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error(error.message || 'Failed to send reset email')
      throw error
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Complete user onboarding
  async completeOnboarding(userId, preferences) {
    try {
      // Update user as onboarded
      await dbHelpers.updateUser(userId, {
        onboarded_at: new Date().toISOString()
      })

      // Save user preferences
      const preferencePromises = []

      // Save genre preferences
      if (preferences.genres && preferences.genres.length > 0) {
        preferences.genres.forEach(genre => {
          preferencePromises.push(
            dbHelpers.upsertUserPreference({
              user_id: userId,
              preference_type: 'genre',
              preference_value: genre,
              score: 0.8 // High preference score
            })
          )
        })
      }

      // Save mood preferences
      if (preferences.moods && preferences.moods.length > 0) {
        preferences.moods.forEach(mood => {
          preferencePromises.push(
            dbHelpers.upsertUserPreference({
              user_id: userId,
              preference_type: 'mood',
              preference_value: mood,
              score: 0.7
            })
          )
        })
      }

      // Save time preferences
      if (preferences.timePreferences && preferences.timePreferences.length > 0) {
        preferences.timePreferences.forEach(timePref => {
          preferencePromises.push(
            dbHelpers.upsertUserPreference({
              user_id: userId,
              preference_type: 'time',
              preference_value: timePref,
              score: 0.6
            })
          )
        })
      }

      await Promise.all(preferencePromises)
      toast.success('Onboarding completed!')
    } catch (error) {
      console.error('Complete onboarding error:', error)
      toast.error(error.message || 'Failed to complete onboarding')
      throw error
    }
  },

  // Get user's full profile with preferences and subscription
  async getUserProfile(userId) {
    try {
      const [user, preferences, subscription] = await Promise.all([
        dbHelpers.getUserById(userId),
        dbHelpers.getUserPreferences(userId),
        dbHelpers.getUserSubscription(userId)
      ])

      return {
        ...user,
        preferences: preferences || [],
        subscription: subscription || null,
        isPremium: subscription?.status === 'active'
      }
    } catch (error) {
      console.error('Get user profile error:', error)
      throw error
    }
  },

  // Check if user is onboarded
  async isUserOnboarded(userId) {
    try {
      const user = await dbHelpers.getUserById(userId)
      return !!user?.onboarded_at
    } catch (error) {
      console.error('Check onboarding error:', error)
      return false
    }
  }
}
