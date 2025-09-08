import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { Film, User, LogOut, Settings } from 'lucide-react'

const Header = () => {
  const { user, logout } = useAppContext()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-surface-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <Film className="w-8 h-8 text-primary" />
              <div className="absolute inset-0 animate-pulse-glow"></div>
            </div>
            <span className="text-xl font-bold text-text-primary">CineMatch AI</span>
          </div>

          {/* Navigation */}
          {user && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-text-secondary hover:text-red-400 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header