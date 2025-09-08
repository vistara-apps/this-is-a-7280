import React, { useState } from 'react';
import { Heart, X, Bookmark, Star, Clock, Calendar, Play } from 'lucide-react';

const RecommendationCard = ({ item, isPremium, onLike, onDislike, onSave }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(item);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(item);
  };

  return (
    <div className="card overflow-hidden group hover:scale-105 transition-transform duration-200">
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
        {item.posterUrl ? (
          <img 
            src={item.posterUrl} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-16 h-16 text-gray-600" />
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-md ${
              isLiked ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-red-500'
            } transition-colors duration-200`}
          >
            <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleSave}
            className={`p-2 rounded-full backdrop-blur-md ${
              isSaved ? 'bg-blue-500 text-white' : 'bg-black/50 text-white hover:bg-blue-500'
            } transition-colors duration-200`}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Rating Badge */}
        {item.rating && (
          <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/70 text-yellow-400 px-2 py-1 rounded-full text-sm">
            <Star className="w-3 h-3" fill="currentColor" />
            <span>{item.rating}</span>
          </div>
        )}

        {/* Premium Badge */}
        {isPremium && item.isPremiumRecommendation && (
          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Premium Pick
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
        
        {/* Metadata */}
        <div className="flex items-center space-x-4 text-sm text-dark-text-secondary mb-3">
          {item.year && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{item.year}</span>
            </div>
          )}
          {item.duration && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{item.duration}</span>
            </div>
          )}
        </div>

        {/* Genres */}
        {item.genres && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.genres.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-800 text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-dark-text-secondary line-clamp-3 mb-4">
          {item.description}
        </p>

        {/* AI Match Score */}
        {item.matchScore && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-dark-text-secondary">AI Match:</span>
              <div className="flex items-center space-x-1">
                <div className="w-16 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                    style={{ width: `${item.matchScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-primary">{item.matchScore}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={onDislike}
            className="flex-1 flex items-center justify-center space-x-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            <span className="text-sm">Not Interested</span>
          </button>
          <button className="flex-1 btn-primary text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;