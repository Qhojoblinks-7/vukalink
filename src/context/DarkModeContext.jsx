// src/context/DarkModeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  // Always start with dark mode off
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Always remove dark class and set localStorage to false
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', false);
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}