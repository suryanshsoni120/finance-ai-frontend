import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import ErrorBoundary from './components/ErrorBoundary';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111827",
              color: "#e5e7eb"
            }
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
