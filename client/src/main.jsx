import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/index.css'
import App from './App.jsx'

import ClerkWrapper from './ClerkWrapper'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkWrapper />
  </StrictMode>,
)
