import React, { useState } from 'react';
import { Accessory } from '../../types';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Info } from 'lucide-react';

interface AccessoryCardProps {
  accessory: Accessory;
}

const AccessoryCard: React.FC<AccessoryCardProps> = ({ accessory }) => {
  const { addItem } = useCart();
  const [duration, setDuration] = useState<'12h' | '24h'>('24h');
  const [showDetails, setShowDetails] = useState(false);
  
  const handleAddToCart = () => {
    addItem(accessory, duration);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col relative group">
      <div className="relative overflow-hidden">
        <img 
          src={accessory.imageUrl} 
          alt={accessory.name} 
          className="w-full h-48 object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <button
          onClick={() => setShowDetails(true)}
          className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/30"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white">{accessory.name}</h3>
            <span className="bg-purple-600 text-xs text-white px-2 py-1 rounded">
              {accessory.category}
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{accessory.description}</p>
        </div>
        
        <div className="mt-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex space-x-2">
              <button
                onClick={() => setDuration('12h')}
                className={`px-2 py-1 text-xs rounded ₹{
                  duration === '12h' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                12 Hours
              </button>
              <button
                onClick={() => setDuration('24h')}
                className={`px-2 py-1 text-xs rounded ₹{
                  duration === '24h' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                24 Hours
              </button>
            </div>
            <span className="text-lg font-bold text-white">
              ₹{duration === '12h' ? accessory.price12h : accessory.price24h}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!accessory.available}
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors ₹{
              accessory.available 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{accessory.available ? 'Add to Cart' : 'Unavailable'}</span>
          </button>
        </div>
      </div>
      
      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={accessory.imageUrl} 
                alt={accessory.name} 
                className="w-full h-64 object-cover object-center rounded-t-lg"
              />
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">{accessory.name}</h2>
                <span className="bg-purple-600 text-xs text-white px-2 py-1 rounded">
                  {accessory.category}
                </span>
              </div>
              
              <p className="text-gray-300 mb-6">{accessory.description}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">12 Hour Rental</span>
                  <span className="text-white font-semibold">₹{accessory.price12h}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">24 Hour Rental</span>
                  <span className="text-white font-semibold">₹{accessory.price24h}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Availability</span>
                  <span className={accessory.available ? 'text-green-500' : 'text-red-500'}>
                    {accessory.available ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {
                    setDuration('24h');
                    handleAddToCart();
                    setShowDetails(false);
                  }}
                  disabled={!accessory.available}
                  className={`flex-1 py-2 rounded-md transition-colors ₹{
                    accessory.available 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessoryCard;
