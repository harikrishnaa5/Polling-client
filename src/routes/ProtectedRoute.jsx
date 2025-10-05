import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => Boolean(localStorage.getItem('authToken'));

export function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}
