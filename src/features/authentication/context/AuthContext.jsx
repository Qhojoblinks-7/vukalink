// AuthContext.jsx
// Auth context provider

import React, { createContext, useState } from 'react';


// Context for authentication state
export const AuthContext = createContext(null);

// Provider for authentication context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Add authentication logic here (e.g., login, logout, session check)
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
