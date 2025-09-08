-- CineMatch AI Database Schema
-- This file contains the complete database schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
    stripe_customer_id TEXT UNIQUE,
    onboarded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content table (movies and TV shows)
CREATE TABLE public.content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('movie', 'series')),
    genres TEXT[] NOT NULL DEFAULT '{}',
    release_date DATE,
    duration INTEGER, -- in minutes
    rating DECIMAL(3,1), -- e.g., 8.5
    poster_url TEXT,
    backdrop_url TEXT,
    streaming_platforms TEXT[] DEFAULT '{}',
    mood_tags TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    director TEXT,
    cast TEXT[] DEFAULT '{}',
    imdb_id TEXT,
    tmdb_id INTEGER,
    is_premium_content BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
    preference_type TEXT NOT NULL CHECK (preference_type IN ('like', 'dislike', 'genre', 'actor', 'director', 'mood')),
    preference_value TEXT, -- genre name, actor name, etc.
    score DECIMAL(3,2) DEFAULT 0.5, -- 0.0 to 1.0
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, content_id, preference_type)
);

-- User ratings table
CREATE TABLE public.user_ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content_id UUID REFERENCES public.content(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    watched_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, content_id)
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT NOT NULL,
    stripe_price_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User watch history table
CREATE TABLE public.user_watch_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content_id UUID REFERENCES public.content(id) ON DELETE CASCADE NOT NULL,
    watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    watch_duration INTEGER, -- in minutes
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendation sessions table (for tracking AI recommendations)
CREATE TABLE public.recommendation_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    session_data JSONB, -- stores filters, preferences used
    recommendations JSONB, -- stores the actual recommendations
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_stripe_customer_id ON public.users(stripe_customer_id);
CREATE INDEX idx_content_type ON public.content(type);
CREATE INDEX idx_content_genres ON public.content USING GIN(genres);
CREATE INDEX idx_content_mood_tags ON public.content USING GIN(mood_tags);
CREATE INDEX idx_content_streaming_platforms ON public.content USING GIN(streaming_platforms);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX idx_user_preferences_type ON public.user_preferences(preference_type);
CREATE INDEX idx_user_ratings_user_id ON public.user_ratings(user_id);
CREATE INDEX idx_user_ratings_content_id ON public.user_ratings(content_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_watch_history_user_id ON public.user_watch_history(user_id);
CREATE INDEX idx_recommendation_sessions_user_id ON public.recommendation_sessions(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON public.content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_ratings_updated_at BEFORE UPDATE ON public.user_ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own preferences" ON public.user_preferences FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ratings" ON public.user_ratings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ratings" ON public.user_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON public.user_ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ratings" ON public.user_ratings FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own watch history" ON public.user_watch_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own watch history" ON public.user_watch_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own recommendation sessions" ON public.recommendation_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recommendation sessions" ON public.recommendation_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Content is publicly readable
CREATE POLICY "Content is publicly readable" ON public.content FOR SELECT USING (true);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get user's subscription status
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    subscription_status TEXT;
BEGIN
    SELECT status INTO subscription_status
    FROM public.subscriptions
    WHERE user_id = user_uuid AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN COALESCE(subscription_status, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get personalized recommendations (placeholder for AI logic)
CREATE OR REPLACE FUNCTION public.get_personalized_recommendations(
    user_uuid UUID,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    content_id UUID,
    title TEXT,
    description TEXT,
    type TEXT,
    genres TEXT[],
    rating DECIMAL,
    match_score DECIMAL
) AS $$
BEGIN
    -- This is a simplified version - in production, this would include
    -- complex ML algorithms based on user preferences and ratings
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.description,
        c.type,
        c.genres,
        c.rating,
        RANDOM()::DECIMAL(3,2) as match_score -- Placeholder for actual ML score
    FROM public.content c
    WHERE c.is_premium_content = FALSE OR 
          public.get_user_subscription_status(user_uuid) = 'active'
    ORDER BY RANDOM()
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
