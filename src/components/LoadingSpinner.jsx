import React from 'react'
import { Film } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-surface-light rounded-full animate-spin border-t-primary"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Film className="w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <div className="text-lg font-medium text-text-primary mb-1">
          AI is analyzing your preferences...
        </div>
        <div className="text-sm text-text-secondary">
          This may take a few moments
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner