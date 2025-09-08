import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Payment features will be disabled.')
}

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey || 'pk_test_demo')

// Stripe configuration
export const STRIPE_CONFIG = {
  PRICE_IDS: {
    PREMIUM_MONTHLY: 'price_premium_monthly', // Replace with actual Stripe price ID
  },
  PRODUCTS: {
    PREMIUM: 'prod_premium' // Replace with actual Stripe product ID
  }
}

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      'Basic AI recommendations',
      'Up to 10 recommendations per day',
      'Standard content discovery',
      'Basic mood filtering'
    ],
    limitations: {
      dailyRecommendations: 10,
      premiumContent: false,
      advancedFilters: false,
      curatedLists: false
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 4.99,
    currency: 'USD',
    interval: 'month',
    stripeProductId: STRIPE_CONFIG.PRODUCTS.PREMIUM,
    stripePriceId: STRIPE_CONFIG.PRICE_IDS.PREMIUM_MONTHLY,
    features: [
      'Unlimited AI recommendations',
      'Advanced personalization',
      'Niche content discovery',
      'Curated thematic lists',
      'Advanced mood & time filtering',
      'Priority customer support',
      'Early access to new features'
    ],
    limitations: {
      dailyRecommendations: -1, // unlimited
      premiumContent: true,
      advancedFilters: true,
      curatedLists: true
    }
  }
}

// Stripe helper functions
export const stripeHelpers = {
  async createCheckoutSession(priceId, userId, successUrl, cancelUrl) {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl,
          cancelUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      return sessionId
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  },

  async createPortalSession(customerId, returnUrl) {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      return url
    } catch (error) {
      console.error('Error creating portal session:', error)
      throw error
    }
  },

  async redirectToCheckout(sessionId) {
    const stripe = await stripePromise
    if (!stripe) {
      throw new Error('Stripe not loaded')
    }

    const { error } = await stripe.redirectToCheckout({ sessionId })
    if (error) {
      throw error
    }
  },

  async redirectToPortal(customerId) {
    const returnUrl = `${window.location.origin}/profile`
    const portalUrl = await this.createPortalSession(customerId, returnUrl)
    window.location.href = portalUrl
  },

  // Get user's current subscription plan
  getUserPlan(subscription) {
    if (!subscription || subscription.status !== 'active') {
      return SUBSCRIPTION_PLANS.FREE
    }
    
    // Check if subscription matches premium plan
    if (subscription.stripe_price_id === STRIPE_CONFIG.PRICE_IDS.PREMIUM_MONTHLY) {
      return SUBSCRIPTION_PLANS.PREMIUM
    }
    
    return SUBSCRIPTION_PLANS.FREE
  },

  // Check if user has premium features
  hasPremiumFeatures(subscription) {
    const plan = this.getUserPlan(subscription)
    return plan.id === 'premium'
  },

  // Check if user can access a feature
  canAccessFeature(subscription, feature) {
    const plan = this.getUserPlan(subscription)
    
    switch (feature) {
      case 'unlimited_recommendations':
        return plan.limitations.dailyRecommendations === -1
      case 'premium_content':
        return plan.limitations.premiumContent
      case 'advanced_filters':
        return plan.limitations.advancedFilters
      case 'curated_lists':
        return plan.limitations.curatedLists
      default:
        return true // Basic features available to all
    }
  }
}
