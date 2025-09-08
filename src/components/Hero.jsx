import React from 'react';
import { Play, Sparkles, Target, Clock } from 'lucide-react';

const Hero = ({ onStartOnboarding }) => {
  const features = [
    {
      icon: Target,
      title: 'AI-Powered Recommendations',
      description: 'Get hyper-personalized movie and show suggestions that match your unique taste'
    },
    {
      icon: Clock,
      title: 'Time & Mood Based',
      description: 'Find content that fits your available time and current mood perfectly'
    },
    {
      icon: Sparkles,
      title: 'Niche Discovery',
      description: 'Discover hidden gems and content from specific genres, directors, and themes'
    }
  ];

  return (
    <div className="py-20 lg:py-32">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-bg mb-6 animate-glow">
            <Play className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Discover your next
          <span className="block gradient-bg bg-clip-text text-transparent">
            favorite movie
          </span>
          effortlessly
        </h1>
        
        <p className="text-lg sm:text-xl text-dark-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
          Stop scrolling endlessly. Our AI analyzes your preferences to deliver 
          personalized recommendations that you'll actually love watching.
        </p>
        
        <button 
          onClick={onStartOnboarding}
          className="inline-flex items-center space-x-2 btn-primary text-lg px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
        >
          <Sparkles className="w-5 h-5" />
          <span>Get Started Free</span>
        </button>
        
        <p className="text-sm text-dark-text-secondary mt-4">
          Premium features available for $4.99/month
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 mb-6">
              <feature.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-dark-text-secondary leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;