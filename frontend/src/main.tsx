import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { queryClient } from './lib/queryClient'
import { ThemeLoader } from './components/ThemeLoader'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeLoader>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeLoader>
    </QueryClientProvider>
  </StrictMode>,
)
