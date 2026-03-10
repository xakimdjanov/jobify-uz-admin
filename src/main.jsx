import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'; // Shu yerda import qil

createRoot(document.getElementById('root')).render(
  <ThemeProvider> {/* Eng tepada ThemeProvider bo'lishi kerak */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);