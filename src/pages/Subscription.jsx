import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { subscriptionService } from '../services/subscriptionService'
import { SUBSCRIPTION_PLANS } from '../lib/stripe'
import { Check, Crown, Zap, Star, Sparkles } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const Subscription = () => {
  const { user } = useAppContext()
  const [currentPlan, setCurrentPlan] = useState(null)
  const [usageStats, setUsageStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    if (user) {
      loadSubscriptionData()
    }
  }, [user])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      const [plan, stats] = await Promise.all([
        subscriptionService.getUserPlan(user.id),
        subscriptionService.getUsageStats(user.id)
      ])
      setCurrentPlan(plan)
      setUsageStats(stats)
    } catch (error) {
      console.error('Failed to load subscription data:', error)
      toast.error('Failed to load subscription information')
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    try {
      setSubscribing(true)
      await subscriptionService.subscribeToPremium(user.id)
    } catch (error) {
      console.error('Subscription failed:', error)
      toast.error('Failed to start subscription')
    } finally {
      setSubscribing(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      await subscriptionService.manageSubscription(user.id)
    } catch (error) {
      console.error('Failed to open subscription management:', error)
      toast.error('Failed to open subscription management')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const plans = subscriptionService.getPlansComparison()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-surface/50 to-background border-b border-surface-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Unlock the full power of AI-driven movie and TV recommendations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Current Plan Status */}
        {currentPlan && (
          <div className="mb-12">
            <div className="bg-surface border border-surface-light rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${currentPlan.id === 'premium' ? 'bg-primary/20' : 'bg-surface-light'}`}>
                    {currentPlan.id === 'premium' ? (
                      <Crown className="w-6 h-6 text-primary" />
                    ) : (
                      <Star className="w-6 h-6 text-text-secondary" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">
                      Current Plan: {currentPlan.name}
                    </h3>
                    <p className="text-text-secondary">
                      {currentPlan.id === 'premium' 
                        ? `$${currentPlan.price}/month` 
                        : 'Free forever'
                      }
                    </p>
                  </div>
                </div>
                {currentPlan.id === 'premium' && (
                  <button
                    onClick={handleManageSubscription}
                    className="px-4 py-2 bg-surface-light hover:bg-surface border border-surface-light rounded-lg text-text-primary transition-colors"
                  >
                    Manage Subscription
                  </button>
                )}
              </div>

              {/* Usage Stats */}
              {usageStats && (
                <div className="mt-6 pt-6 border-t border-surface-light">
                  <h4 className="text-lg font-medium text-text-primary mb-4">Usage This Month</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-surface-light rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-text-secondary text-sm">Daily Recommendations</span>
                        <Zap className="w-4 h-4 text-accent" />
                      </div>
                      <div className="text-2xl font-bold text-text-primary">
                        {usageStats.dailyRecommendations.unlimited 
                          ? '∞' 
                          : `${usageStats.dailyRecommendations.used}/${usageStats.dailyRecommendations.limit}`
                        }
                      </div>
                    </div>
                    
                    <div className="bg-surface-light rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-text-secondary text-sm">Premium Content</span>
                        <Crown className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-text-primary">
                        {usageStats.premiumContent.available ? '✓' : '✗'}
                      </div>
                    </div>

                    <div className="bg-surface-light rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-text-secondary text-sm">Advanced Filters</span>
                        <Sparkles className="w-4 h-4 text-accent" />
                      </div>
                      <div className="text-2xl font-bold text-text-primary">
                        {usageStats.advancedFilters.available ? '✓' : '✗'}
                      </div>
                    </div>

                    <div className="bg-surface-light rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-text-secondary text-sm">Curated Lists</span>
                        <Star className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-text-primary">
                        {usageStats.curatedLists.available ? '✓' : '✗'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-surface border rounded-xl p-8 ${
                plan.isPopular 
                  ? 'border-primary shadow-glow' 
                  : 'border-surface-light'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-lg mb-4 ${
                  plan.id === 'premium' ? 'bg-primary/20' : 'bg-surface-light'
                }`}>
                  {plan.id === 'premium' ? (
                    <Crown className="w-8 h-8 text-primary" />
                  ) : (
                    <Star className="w-8 h-8 text-text-secondary" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-text-primary mb-2">
                  ${plan.price}
                  {plan.price > 0 && (
                    <span className="text-lg font-normal text-text-secondary">
                      /{plan.interval}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.id === 'premium' ? handleSubscribe : undefined}
                disabled={
                  subscribing || 
                  (currentPlan?.id === plan.id) ||
                  (plan.id === 'free')
                }
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                  plan.id === 'premium'
                    ? currentPlan?.id === 'premium'
                      ? 'bg-surface-light text-text-secondary cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90 text-white shadow-glow'
                    : 'bg-surface-light text-text-secondary cursor-not-allowed'
                } ${subscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {subscribing && plan.id === 'premium' ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Processing...</span>
                  </div>
                ) : currentPlan?.id === plan.id ? (
                  'Current Plan'
                ) : plan.id === 'premium' ? (
                  'Upgrade Now'
                ) : (
                  'Free Forever'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-surface border border-surface-light rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-text-secondary">
                Yes! You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
              </p>
            </div>
            
            <div className="bg-surface border border-surface-light rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                What makes premium recommendations better?
              </h3>
              <p className="text-text-secondary">
                Premium users get access to our advanced AI algorithms that consider niche preferences, international content, and provide deeper personalization based on your viewing history.
              </p>
            </div>
            
            <div className="bg-surface border border-surface-light rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Is there a free trial?
              </h3>
              <p className="text-text-secondary">
                You can use CineMatch AI for free with basic recommendations. Upgrade to premium anytime to unlock unlimited recommendations and advanced features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Subscription
