# CineMatch AI API Documentation

This document provides comprehensive API documentation for the CineMatch AI application, including all endpoints, data models, and integration guides.

## Table of Contents

1. [Authentication](#authentication)
2. [Data Models](#data-models)
3. [API Endpoints](#api-endpoints)
4. [Supabase Integration](#supabase-integration)
5. [Stripe Integration](#stripe-integration)
6. [OpenAI Integration](#openai-integration)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

## Authentication

CineMatch AI uses Supabase Auth for user authentication with JWT tokens.

### Authentication Flow

1. **Sign Up**: Create new user account
2. **Sign In**: Authenticate existing user
3. **Token Refresh**: Automatically handled by Supabase client
4. **Sign Out**: Invalidate session

### Headers

All authenticated requests must include:

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Data Models

### User

```typescript
interface User {
  id: string                    // UUID
  email: string                 // User email
  name?: string                 // Display name
  avatar_url?: string           // Profile picture URL
  subscription_status: 'free' | 'premium'
  stripe_customer_id?: string   // Stripe customer ID
  onboarded_at?: string         // ISO timestamp
  created_at: string            // ISO timestamp
  updated_at: string            // ISO timestamp
}
```

### Content

```typescript
interface Content {
  id: string                    // UUID
  title: string                 // Movie/show title
  description?: string          // Plot summary
  type: 'movie' | 'series'      // Content type
  genres: string[]              // Genre tags
  release_date?: string         // ISO date
  duration?: number             // Duration in minutes
  rating?: number               // Rating (0-10)
  poster_url?: string           // Poster image URL
  backdrop_url?: string         // Backdrop image URL
  streaming_platforms: string[] // Available platforms
  mood_tags: string[]           // Mood classifications
  keywords: string[]            // Search keywords
  director?: string             // Director name
  cast: string[]                // Main cast
  imdb_id?: string              // IMDB identifier
  tmdb_id?: number              // TMDB identifier
  is_premium_content: boolean   // Premium tier content
  created_at: string            // ISO timestamp
  updated_at: string            // ISO timestamp
}
```

### UserPreference

```typescript
interface UserPreference {
  id: string                    // UUID
  user_id: string               // User UUID
  content_id?: string           // Content UUID (optional)
  preference_type: 'like' | 'dislike' | 'genre' | 'actor' | 'director' | 'mood'
  preference_value?: string     // Preference value
  score: number                 // Preference score (0.0-1.0)
  created_at: string            // ISO timestamp
  updated_at: string            // ISO timestamp
}
```

### UserRating

```typescript
interface UserRating {
  id: string                    // UUID
  user_id: string               // User UUID
  content_id: string            // Content UUID
  rating: number                // Rating (1-5)
  review?: string               // Optional review text
  watched_at?: string           // ISO timestamp
  created_at: string            // ISO timestamp
  updated_at: string            // ISO timestamp
}
```

### Subscription

```typescript
interface Subscription {
  id: string                    // UUID
  user_id: string               // User UUID
  stripe_subscription_id: string // Stripe subscription ID
  stripe_customer_id: string    // Stripe customer ID
  stripe_price_id: string       // Stripe price ID
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
  current_period_start: string  // ISO timestamp
  current_period_end: string    // ISO timestamp
  cancel_at_period_end: boolean // Cancel flag
  canceled_at?: string          // ISO timestamp
  created_at: string            // ISO timestamp
  updated_at: string            // ISO timestamp
}
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

#### POST /auth/signin
Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### POST /auth/signout
Sign out current user.

### User Endpoints

#### GET /api/user/profile
Get current user profile with preferences and subscription.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "subscription_status": "premium",
  "preferences": [...],
  "subscription": {...},
  "isPremium": true
}
```

#### PUT /api/user/profile
Update user profile.

**Request Body:**
```json
{
  "name": "Updated Name",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

#### POST /api/user/onboarding
Complete user onboarding with preferences.

**Request Body:**
```json
{
  "preferences": {
    "genres": ["Action", "Sci-Fi"],
    "moods": ["Exciting", "Adventurous"],
    "timePreferences": ["Under 2 hours"]
  }
}
```

### Recommendation Endpoints

#### POST /api/recommendations/generate
Generate AI-powered recommendations.

**Request Body:**
```json
{
  "filters": {
    "mood": "exciting",
    "timeAvailable": "2 hours",
    "type": "movie",
    "genre": "action"
  },
  "options": {
    "count": 6
  }
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "id": "rec_123",
      "title": "Movie Title",
      "description": "Movie description",
      "year": 2023,
      "duration": "2h 15m",
      "genres": ["Action", "Thriller"],
      "rating": 8.5,
      "matchScore": 92,
      "type": "movie",
      "posterUrl": "https://example.com/poster.jpg",
      "streamingPlatforms": ["Netflix", "Prime Video"],
      "whyRecommended": "Matches your action preferences"
    }
  ]
}
```

#### POST /api/recommendations/feedback
Provide feedback on recommendations.

**Request Body:**
```json
{
  "contentId": "content_uuid",
  "feedback": "like" | "dislike" | "neutral"
}
```

### Content Endpoints

#### GET /api/content
Get content with filtering options.

**Query Parameters:**
- `type`: movie | series
- `genre`: Genre filter
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset

#### GET /api/content/:id
Get specific content by ID.

#### POST /api/content/:id/rating
Rate content.

**Request Body:**
```json
{
  "rating": 5,
  "review": "Great movie!"
}
```

### Subscription Endpoints

#### GET /api/subscription/plans
Get available subscription plans.

**Response:**
```json
{
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "price": 0,
      "features": [...],
      "limitations": {...}
    },
    {
      "id": "premium",
      "name": "Premium",
      "price": 4.99,
      "features": [...],
      "limitations": {...}
    }
  ]
}
```

#### POST /api/subscription/checkout
Create Stripe checkout session.

**Request Body:**
```json
{
  "priceId": "price_premium_monthly",
  "successUrl": "https://app.com/success",
  "cancelUrl": "https://app.com/cancel"
}
```

#### POST /api/subscription/portal
Create Stripe customer portal session.

**Response:**
```json
{
  "url": "https://billing.stripe.com/session/..."
}
```

#### GET /api/subscription/usage
Get current usage statistics.

**Response:**
```json
{
  "dailyRecommendations": {
    "used": 5,
    "limit": 10,
    "unlimited": false
  },
  "premiumContent": {
    "available": false
  }
}
```

## Supabase Integration

### Database Setup

1. Create Supabase project
2. Run the schema from `database/schema.sql`
3. Configure Row Level Security (RLS) policies
4. Set up authentication providers

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Client Configuration

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)
```

## Stripe Integration

### Setup

1. Create Stripe account
2. Set up products and prices
3. Configure webhooks
4. Set environment variables

### Environment Variables

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Webhook Events

Handle these Stripe webhook events:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### Webhook Endpoint

```javascript
// POST /api/webhooks/stripe
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature']
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  
  // Handle event
  await subscriptionService.handleWebhookEvent(event)
  
  res.json({received: true})
})
```

## OpenAI Integration

### Setup

1. Get OpenAI API key or OpenRouter key
2. Configure model and parameters
3. Implement rate limiting

### Environment Variables

```env
VITE_OPENAI_API_KEY=sk-...
VITE_OPENROUTER_API_KEY=sk-or-...
```

### Usage

```javascript
import { aiService } from './services/aiService'

const recommendations = await aiService.generateRecommendations(
  userId,
  filters,
  options
)
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Common Error Codes

- `AUTHENTICATION_REQUIRED`: User not authenticated
- `AUTHORIZATION_FAILED`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid request data
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SUBSCRIPTION_REQUIRED`: Premium feature requires subscription
- `DAILY_LIMIT_REACHED`: Free tier daily limit exceeded

## Rate Limiting

### Limits by Plan

**Free Plan:**
- 10 recommendations per day
- 100 API requests per hour

**Premium Plan:**
- Unlimited recommendations
- 1000 API requests per hour

### Headers

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## SDK Usage Examples

### JavaScript/TypeScript

```javascript
import { CineMatchClient } from '@cinematch/sdk'

const client = new CineMatchClient({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.cinematch.ai'
})

// Generate recommendations
const recommendations = await client.recommendations.generate({
  filters: { mood: 'exciting', type: 'movie' }
})

// Rate content
await client.content.rate('content_id', {
  rating: 5,
  review: 'Amazing movie!'
})
```

### cURL Examples

```bash
# Generate recommendations
curl -X POST https://api.cinematch.ai/api/recommendations/generate \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filters": {"mood": "exciting"}}'

# Get user profile
curl -X GET https://api.cinematch.ai/api/user/profile \
  -H "Authorization: Bearer $JWT_TOKEN"
```

## Testing

### Test Environment

Use test environment for development:

```env
VITE_SUPABASE_URL=https://test-project.supabase.co
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Mock Data

The application includes mock data for testing when external services are unavailable.

## Support

For API support and questions:

- Documentation: https://docs.cinematch.ai
- Support Email: support@cinematch.ai
- GitHub Issues: https://github.com/cinematch/api/issues
