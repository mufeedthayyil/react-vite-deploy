import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { supabase } from '../../lib/supabase';
import { Calendar, CreditCard, User, Mail, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

interface CheckoutFormProps {
  onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const { items, totalPrice, clearItems } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customerName: user?.profile?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    rentDate: '',
    returnDate: '',
    paymentMode: 'cash', // cash or upi
    paymentType: 'advance', // advance or full
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateAdvanceAmount = () => {
    return totalPrice * 0.3; // 30% advance
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create orders for each item in cart
      const orderPromises = items.map(async (item) => {
        const rentDate = new Date(formData.rentDate);
        const returnDate = new Date(formData.returnDate);
        
        // Calculate duration in hours
        const durationHours = Math.ceil((returnDate.getTime() - rentDate.getTime()) / (1000 * 60 * 60));
        const duration = durationHours <= 12 ? '12hr' : '24hr';
        
        const totalCost = formData.paymentType === 'advance' 
          ? item.price * item.quantity * 0.3 
          : item.price * item.quantity;

        return await orderService.create({
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          equipment_id: item.itemId,
          duration: duration,
          rent_date: formData.rentDate,
          return_date: formData.returnDate,
          total_cost: totalCost,
          status: 'pending'
        });
      });

      await Promise.all(orderPromises);

      // Send notification to admin
      await supabase.from('suggestions').insert({
        suggestion_text: `New Order Request:
Customer: ${formData.customerName}
Email: ${formData.customerEmail}
Phone: ${formData.customerPhone}
Items: ${items.map(item => `${item.name} (${item.quantity}x)`).join(', ')}
Rent Date: ${formData.rentDate}
Return Date: ${formData.returnDate}
Payment Mode: ${formData.paymentMode.toUpperCase()}
Payment Type: ${formData.paymentType === 'advance' ? `Advance (₹${calculateAdvanceAmount().toFixed(2)})` : `Full Payment (₹${totalPrice.toFixed(2)})`}
Total Amount: ₹${totalPrice.toFixed(2)}
Notes: ${formData.notes || 'None'}`,
        suggested_by: formData.customerName
      });

      setSuccess(true);
      clearItems();
      
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Order Submitted!</h2>
          <p className="text-gray-300 mb-4">
            Your rental request has been sent to our admin team. You'll receive a confirmation email once approved.
          </p>
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-300">
              <strong>Payment Required:</strong> {formData.paymentType === 'advance' 
                ? `₹${calculateAdvanceAmount().toFixed(2)} (30% Advance)` 
                : `₹${totalPrice.toFixed(2)} (Full Payment)`}
            </p>
            <p className="text-sm text-gray-300 mt-1">
              <strong>Payment Mode:</strong> {formData.paymentMode.toUpperCase()}
            </p>
          </div>
          <p className="text-sm text-gray-400">This window will close automatically...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Checkout</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-md p-3 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Rental Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Rental Period
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rent Date *
                </label>
                <input
                  type="datetime-local"
                  name="rentDate"
                  value={formData.rentDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Return Date *
                </label>
                <input
                  type="datetime-local"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  min={formData.rentDate}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Options
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Mode *
                </label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Type *
                </label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="advance">Pay 30% Advance (Rest at pickup)</option>
                  <option value="full">Pay Full Amount</option>
                </select>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Total Amount:</span>
                <span className="text-white font-bold">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">
                  {formData.paymentType === 'advance' ? 'Advance Payment (30%):' : 'Full Payment:'}
                </span>
                <span className="text-indigo-400 font-bold">
                  ₹{formData.paymentType === 'advance' ? calculateAdvanceAmount().toFixed(2) : totalPrice.toFixed(2)}
                </span>
              </div>
              {formData.paymentType === 'advance' && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-400 text-sm">Remaining at pickup:</span>
                  <span className="text-gray-400 text-sm">₹{(totalPrice - calculateAdvanceAmount()).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Any special requirements or notes..."
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Order Summary</h4>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.name} x{item.quantity}</span>
                  <span className="text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Submit Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;