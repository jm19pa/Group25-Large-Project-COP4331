import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Menu from './Menu.tsx'

// trying to get a menu icon thingy


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Menu />
    <App />
  </StrictMode>,
)
