import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { initializeLocalStorage } from './utils/localStorage';

function App() {
  useEffect(() => {
    // Initialize local storage with data when the app loads
    initializeLocalStorage();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
