import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Camera, ShoppingCart, Menu, X } from 'lucide-react';
import CartDropdown from '../cart/CartDropdown';

const Header: React.FC = () => {
  const { itemCount } = useCart();
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-indigo-500" />
            <span className="text-xl font-bold text-white">LensPro Rentals</span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#cameras" className="text-gray-300 hover:text-white transition-colors">
              Cameras
            </a>
            <a href="#accessories" className="text-gray-300 hover:text-white transition-colors">
              Accessories
            </a>
            {isAdmin && (
              <a href="/admin" className="text-gray-300 hover:text-white transition-colors">
                Admin Panel
              </a>
            )}
            {isAuthenticated ? (
              <button 
                onClick={logout}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Logout
              </button>
            ) : (
              <a href="/admin" className="text-gray-300 hover:text-white transition-colors">
                Admin Login
              </a>
            )}
            <button 
              onClick={toggleCart}
              className="relative p-1 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart className="h-6 w-6 text-white" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={toggleCart}
              className="relative p-1 mr-4 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart className="h-6 w-6 text-white" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-1 rounded-md hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <a 
                href="#cameras" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cameras
              </a>
              <a 
                href="#accessories" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accessories
              </a>
              {isAdmin && (
                <a 
                  href="/admin" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Panel
                </a>
              )}
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Logout
                </button>
              ) : (
                <a 
                  href="/admin" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Login
                </a>
              )}
            </div>
          </nav>
        )}
      </div>
      
      {/* Cart Dropdown */}
      {isCartOpen && (
        <CartDropdown onClose={() => setIsCartOpen(false)} />
      )}
    </header>
  );
};

export default Header;