import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(220, 15%, 12%)',
              color: 'hsl(220, 15%, 95%)',
              border: '1px solid hsl(220, 15%, 16%)',
            },
            success: {
              iconTheme: {
                primary: 'hsl(170, 70%, 45%)',
                secondary: 'hsl(220, 15%, 12%)',
              },
            },
            error: {
              iconTheme: {
                primary: 'hsl(0, 70%, 50%)',
                secondary: 'hsl(220, 15%, 12%)',
              },
            },
          }}
        />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
