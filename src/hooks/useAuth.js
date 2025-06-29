// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContextOnly';

export function useAuth() {
  return useContext(AuthContext);
}
