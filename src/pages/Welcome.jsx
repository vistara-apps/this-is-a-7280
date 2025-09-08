import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { Film, Sparkles, Clock, Target } from 'lucide-react'

const Welcome = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const { login } = useAppContext()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && password) {
      login({
        id: Date.now(),
        email,
        name: email.split('@')[0],
        isPremium: false
      })
      navigate('/onboarding')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Film className="w-16 h-16 text-primary" />
            <div className="absolute inset-0 animate-pulse-glow"></div>
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
          CineMatch AI
        </h1>
        
        <p className="text-xl sm:text-2xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Discover your next favorite movie or show, effortlessly.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <Sparkles className="w-8 h-8 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">AI-Powered</h3>
            <p className="text-text-secondary text-sm">Personalized recommendations that learn from your taste</p>
          </div>
          
          <div className="card text-center">
            <Clock className="w-8 h-8 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Time-Based</h3>
            <p className="text-text-secondary text-sm">Find content that fits your available time</p>
          </div>
          
          <div className="card text-center">
            <Target className="w-8 h-8 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Niche Discovery</h3>
            <p className="text-text-secondary text-sm">Explore hidden gems tailored to your interests</p>
          </div>
        </div>
      </div>

      {/* Auth Form */}
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-text-secondary mt-2">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary/80 ml-2 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Premium Badge */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-text-primary">Premium: $4.99/month for advanced features</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome