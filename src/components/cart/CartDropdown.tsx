import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, ShoppingBag, Trash2 } from 'lucide-react';

interface CartDropdownProps {
  onClose: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ onClose }) => {
  const { items, removeItem, updateItem, totalPrice, clearItems } = useCart();
  
  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl z-50 max-h-[80vh] overflow-hidden flex flex-col mr-4">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center">
          <ShoppingBag className="h-5 w-5 text-indigo-500 mr-2" />
          <h3 className="text-lg font-semibold text-white">Your Cart</h3>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Your cart is empty</p>
            <p className="text-gray-500 text-sm mt-2">
              Add cameras and accessories to get started
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-700">
            {items.map(item => (
              <li key={item.id} className="p-4 hover:bg-gray-750">
                <div className="flex items-start">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h4 className="text-white font-medium">{item.name}</h4>
                      <span className="text-white font-semibold">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      ₹{item.price} × {item.duration}
                    </p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center bg-gray-700 rounded-md">
                        <button 
                          onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-gray-300 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-300 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {items.length > 0 && (
        <div className="p-4 border-t border-gray-700 bg-gray-850">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-300">Total</span>
            <span className="text-white font-bold text-xl">₹{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={clearItems}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors text-sm"
            >
              Clear Cart
            </button>
            <button 
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors text-sm"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
