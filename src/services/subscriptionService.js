import { stripeHelpers, SUBSCRIPTION_PLANS, STRIPE_CONFIG } from '../lib/stripe'
import { dbHelpers } from '../lib/supabase'
import toast from 'react-hot-toast'

export const subscriptionService = {
  // Get user's current subscription
  async getUserSubscription(userId) {
    try {
      const subscription = await dbHelpers.getUserSubscription(userId)
      return subscription
    } catch (error) {
      console.error('Get user subscription error:', error)
      return null
    }
  },

  // Get user's subscription plan details
  async getUserPlan(userId) {
    try {
      const subscription = await this.getUserSubscription(userId)
      return stripeHelpers.getUserPlan(subscription)
    } catch (error) {
      console.error('Get user plan error:', error)
      return SUBSCRIPTION_PLANS.FREE
    }
  },

  // Check if user has premium features
  async hasPremiumFeatures(userId) {
    try {
      const subscription = await this.getUserSubscription(userId)
      return stripeHelpers.hasPremiumFeatures(subscription)
    } catch (error) {
      console.error('Check premium features error:', error)
      return false
    }
  },

  // Check if user can access a specific feature
  async canAccessFeature(userId, feature) {
    try {
      const subscription = await this.getUserSubscription(userId)
      return stripeHelpers.canAccessFeature(subscription, feature)
    } catch (error) {
      console.error('Check feature access error:', error)
      return feature === 'basic' // Only basic features if error
    }
  },

  // Start premium subscription
  async subscribeToPremium(userId) {
    try {
      const successUrl = `${window.location.origin}/subscription/success`
      const cancelUrl = `${window.location.origin}/subscription/canceled`
      
      const sessionId = await stripeHelpers.createCheckoutSession(
        STRIPE_CONFIG.PRICE_IDS.PREMIUM_MONTHLY,
        userId,
        successUrl,
        cancelUrl
      )

      await stripeHelpers.redirectToCheckout(sessionId)
    } catch (error) {
      console.error('Subscribe to premium error:', error)
      toast.error('Failed to start subscription process')
      throw error
    }
  },

  // Manage subscription (redirect to Stripe portal)
  async manageSubscription(userId) {
    try {
      const user = await dbHelpers.getUserById(userId)
      if (!user?.stripe_customer_id) {
        throw new Error('No Stripe customer ID found')
      }

      await stripeHelpers.redirectToPortal(user.stripe_customer_id)
    } catch (error) {
      console.error('Manage subscription error:', error)
      toast.error('Failed to open subscription management')
      throw error
    }
  },

  // Handle successful subscription (called from success page)
  async handleSubscriptionSuccess(sessionId) {
    try {
      // In a real app, you would verify the session with your backend
      // and update the user's subscription status
      toast.success('Subscription activated successfully!')
      
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Handle subscription success error:', error)
      toast.error('Failed to activate subscription')
      throw error
    }
  },

  // Handle subscription cancellation
  async handleSubscriptionCanceled() {
    toast.info('Subscription was canceled. You can try again anytime!')
    window.location.href = '/dashboard'
  },

  // Get subscription usage stats
  async getUsageStats(userId) {
    try {
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      
      // This would typically query your database for usage stats
      // For now, we'll return mock data
      const plan = await this.getUserPlan(userId)
      
      return {
        dailyRecommendations: {
          used: Math.floor(Math.random() * 8), // Mock data
          limit: plan.limitations.dailyRecommendations,
          unlimited: plan.limitations.dailyRecommendations === -1
        },
        premiumContent: {
          available: plan.limitations.premiumContent
        },
        advancedFilters: {
          available: plan.limitations.advancedFilters
        },
        curatedLists: {
          available: plan.limitations.curatedLists
        }
      }
    } catch (error) {
      console.error('Get usage stats error:', error)
      return {
        dailyRecommendations: { used: 0, limit: 10, unlimited: false },
        premiumContent: { available: false },
        advancedFilters: { available: false },
        curatedLists: { available: false }
      }
    }
  },

  // Check if user has reached daily recommendation limit
  async hasReachedDailyLimit(userId) {
    try {
      const stats = await this.getUsageStats(userId)
      if (stats.dailyRecommendations.unlimited) {
        return false
      }
      return stats.dailyRecommendations.used >= stats.dailyRecommendations.limit
    } catch (error) {
      console.error('Check daily limit error:', error)
      return false
    }
  },

  // Increment daily recommendation usage
  async incrementRecommendationUsage(userId) {
    try {
      // In a real app, you would update the database with usage tracking
      // For now, we'll just check if they've hit the limit
      const hasReachedLimit = await this.hasReachedDailyLimit(userId)
      
      if (hasReachedLimit) {
        const isPremium = await this.hasPremiumFeatures(userId)
        if (!isPremium) {
          throw new Error('Daily recommendation limit reached. Upgrade to Premium for unlimited recommendations!')
        }
      }
      
      return true
    } catch (error) {
      console.error('Increment recommendation usage error:', error)
      throw error
    }
  },

  // Get all available subscription plans
  getAvailablePlans() {
    return Object.values(SUBSCRIPTION_PLANS)
  },

  // Compare plans for pricing page
  getPlansComparison() {
    const plans = this.getAvailablePlans()
    
    return plans.map(plan => ({
      ...plan,
      isPopular: plan.id === 'premium', // Mark premium as popular
      ctaText: plan.id === 'free' ? 'Current Plan' : 'Upgrade Now',
      ctaAction: plan.id === 'free' ? null : 'subscribe'
    }))
  },

  // Webhook handler for Stripe events (would be called from backend)
  async handleWebhookEvent(event) {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.updateSubscriptionFromStripe(event.data.object)
          break
          
        case 'customer.subscription.deleted':
          await this.cancelSubscriptionFromStripe(event.data.object)
          break
          
        case 'invoice.payment_succeeded':
          await this.handlePaymentSuccess(event.data.object)
          break
          
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object)
          break
          
        default:
          console.log(`Unhandled event type: ${event.type}`)
      }
    } catch (error) {
      console.error('Webhook handler error:', error)
      throw error
    }
  },

  // Update subscription in database from Stripe data
  async updateSubscriptionFromStripe(stripeSubscription) {
    try {
      const subscriptionData = {
        stripe_subscription_id: stripeSubscription.id,
        stripe_customer_id: stripeSubscription.customer,
        stripe_price_id: stripeSubscription.items.data[0].price.id,
        status: stripeSubscription.status,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000),
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
        canceled_at: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : null
      }

      // Find user by Stripe customer ID
      const { data: users } = await supabase
        .from('users')
        .select('id')
        .eq('stripe_customer_id', stripeSubscription.customer)
        .single()

      if (users) {
        subscriptionData.user_id = users.id
        await dbHelpers.createSubscription(subscriptionData)
      }
    } catch (error) {
      console.error('Update subscription from Stripe error:', error)
      throw error
    }
  },

  // Cancel subscription in database
  async cancelSubscriptionFromStripe(stripeSubscription) {
    try {
      await dbHelpers.updateSubscription(stripeSubscription.id, {
        status: 'canceled',
        canceled_at: new Date()
      })
    } catch (error) {
      console.error('Cancel subscription from Stripe error:', error)
      throw error
    }
  },

  // Handle successful payment
  async handlePaymentSuccess(invoice) {
    try {
      // Update subscription status if needed
      console.log('Payment succeeded for invoice:', invoice.id)
    } catch (error) {
      console.error('Handle payment success error:', error)
      throw error
    }
  },

  // Handle failed payment
  async handlePaymentFailed(invoice) {
    try {
      // Notify user of failed payment
      console.log('Payment failed for invoice:', invoice.id)
    } catch (error) {
      console.error('Handle payment failed error:', error)
      throw error
    }
  }
}
