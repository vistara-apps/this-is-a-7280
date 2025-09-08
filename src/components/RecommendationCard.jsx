import React, { useState } from 'react'
import { Heart, Clock, Star, Play, BookmarkPlus, Bookmark } from 'lucide-react'

const RecommendationCard = ({ item, index }) => {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleLike = (e) => {
    e.stopPropagation()
    setLiked(!liked)
  }

  const handleSave = (e) => {
    e.stopPropagation()
    setSaved(!saved)
  }

  return (
    <div 
      className="card group hover:scale-105 hover:shadow-glow transition-all duration-300 cursor-pointer animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Poster Image */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <img
          src={item.poster}
          alt={item.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Match Score Badge */}
        <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-medium">
          {item.matchScore}% match
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
              liked 
                ? 'bg-red-500 text-white' 
                : 'bg-black/50 text-white hover:bg-red-500'
            }`}
          >
            <Heart className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} />
          </button>
          
          <button
            onClick={handleSave}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
              saved 
                ? 'bg-primary text-white' 
                : 'bg-black/50 text-white hover:bg-primary'
            }`}
          >
            {saved ? <Bookmark className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
          </button>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
          <button className="bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-200">
            <Play className="w-6 h-6 ml-1" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title and Type */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-text-primary line-clamp-1">
              {item.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.type === 'movie' 
                ? 'bg-primary/20 text-primary' 
                : 'bg-accent/20 text-accent'
            }`}>
              {item.type === 'movie' ? 'Movie' : 'Series'}
            </span>
          </div>
          
          {/* Rating and Duration */}
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
              <span>{item.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{item.duration}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-text-secondary text-sm line-clamp-3">
          {item.description}
        </p>

        {/* Genres */}
        <div className="flex flex-wrap gap-1">
          {item.genre.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="px-2 py-1 bg-surface-light text-text-secondary text-xs rounded-full"
            >
              {genre}
            </span>
          ))}
          {item.genre.length > 3 && (
            <span className="px-2 py-1 bg-surface-light text-text-secondary text-xs rounded-full">
              +{item.genre.length - 3} more
            </span>
          )}
        </div>

        {/* Mood Tags */}
        <div className="flex flex-wrap gap-1">
          {item.mood.map((mood) => (
            <span
              key={mood}
              className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20"
            >
              {mood}
            </span>
          ))}
        </div>

        {/* Platforms */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-light">
          <div className="flex flex-wrap gap-1">
            {item.platforms.slice(0, 2).map((platform) => (
              <span
                key={platform}
                className="text-xs text-text-secondary bg-surface-light px-2 py-1 rounded"
              >
                {platform}
              </span>
            ))}
            {item.platforms.length > 2 && (
              <span className="text-xs text-text-secondary">
                +{item.platforms.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendationCard