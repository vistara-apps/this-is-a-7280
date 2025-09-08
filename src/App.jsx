import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import './App.css'

function App() {
  const { user } = useAppContext()

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          {!user ? (
            <>
              <Route index element={<Welcome />} />
              <Route path="onboarding" element={<Onboarding />} />
            </>
          ) : (
            <>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
            </>
          )}
        </Route>
      </Routes>
    </div>
  )
}

export default App