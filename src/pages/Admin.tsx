import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/admin/LoginForm';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { equipmentService } from '../services/equipmentService';
import { orderService } from '../services/orderService';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { Edit, Trash2, Plus, Camera as CameraIcon, Package, Bell, CheckCircle, XCircle, Clock } from 'lucide-react';

type Equipment = Database['public']['Tables']['equipments']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];
type Suggestion = Database['public']['Tables']['suggestions']['Row'];

const Admin: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'cameras' | 'accessories' | 'orders' | 'notifications'>('cameras');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Suggestion[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadEquipment();
      loadOrders();
      loadNotifications();
    }
  }, [isAuthenticated, isAdmin]);

  const loadEquipment = async () => {
    try {
      const data = await equipmentService.getAll();
      setEquipment(data);
    } catch (error) {
      console.error('Error loading equipment:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await equipmentService.delete(id);
        await loadEquipment();
      } catch (error) {
        console.error('Error deleting equipment:', error);
      }
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, status: string) => {
    try {
      await orderService.update(orderId, { status });
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('suggestions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const toggleAvailability = async (id: string, currentAvailability: boolean) => {
    try {
      await equipmentService.update(id, { available: !currentAvailability });
      await loadEquipment();
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  // Filter equipment by type
  const cameraCategories = ['DSLR', 'Mirrorless', 'Cinema Camera', 'Medium Format', 'Compact'];
  const accessoryCategories = ['Lens', 'Stabilizer', 'Lighting', 'Audio', 'Support', 'Monitoring', 'Storage', 'Power'];
  
  const cameras = equipment.filter(item => cameraCategories.includes(item.category));
  const accessories = equipment.filter(item => accessoryCategories.includes(item.category));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <a
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your inventory and pricing</p>
          </div>
          
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('cameras')}
              className={`px-6 py-3 font-medium flex items-center ${
                activeTab === 'cameras'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <CameraIcon className="h-5 w-5 mr-2" />
              Cameras
            </button>
            <button
              onClick={() => setActiveTab('accessories')}
              className={`px-6 py-3 font-medium flex items-center ${
                activeTab === 'accessories'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Package className="h-5 w-5 mr-2" />
              Accessories
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-medium flex items-center ${
                activeTab === 'orders'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Clock className="h-5 w-5 mr-2" />
              Orders ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 font-medium flex items-center ${
                activeTab === 'notifications'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bell className="h-5 w-5 mr-2" />
              Notifications ({notifications.length})
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'orders' ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Order Management</h2>
                </div>
                
                {loadingData ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading orders...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-750">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Equipment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Dates
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-750">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="font-medium text-white">{order.customer_name}</div>
                                <div className="text-gray-400 text-sm">{order.customer_email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-white">{order.equipment_id}</div>
                              <div className="text-gray-400 text-sm">{order.duration}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-white text-sm">
                                {new Date(order.rent_date).toLocaleDateString()}
                              </div>
                              <div className="text-gray-400 text-sm">
                                to {new Date(order.return_date).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-white font-semibold">₹{order.total_cost}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                order.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                                order.status === 'confirmed' ? 'bg-green-900 text-green-300' :
                                order.status === 'completed' ? 'bg-blue-900 text-blue-300' :
                                'bg-red-900 text-red-300'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-2 justify-end">
                                {order.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleOrderStatusUpdate(order.id, 'confirmed')}
                                      className="text-green-400 hover:text-green-300"
                                      title="Confirm Order"
                                    >
                                      <CheckCircle className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => handleOrderStatusUpdate(order.id, 'cancelled')}
                                      className="text-red-400 hover:text-red-300"
                                      title="Cancel Order"
                                    >
                                      <XCircle className="h-5 w-5" />
                                    </button>
                                  </>
                                )}
                                {order.status === 'confirmed' && (
                                  <button
                                    onClick={() => handleOrderStatusUpdate(order.id, 'completed')}
                                    className="text-blue-400 hover:text-blue-300"
                                    title="Mark as Completed"
                                  >
                                    <CheckCircle className="h-5 w-5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : activeTab === 'notifications' ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Order Notifications</h2>
                </div>
                
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div key={notification.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-white">New Order Request</h4>
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-gray-300 text-sm whitespace-pre-line mb-2">
                        {notification.suggestion_text}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(notification.created_at || '').toLocaleString()}
                      </div>
                    </div>
                  ))}
                  
                  {notifications.length === 0 && (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No new notifications</p>
                    </div>
                  )}
                </div>
              </>
            ) : activeTab === 'cameras' ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Camera Inventory</h2>
                </div>
                
                {loadingData ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading cameras...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-750">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Camera
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            12H Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            24H Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {cameras.map(camera => (
                          <tr key={camera.id} className="hover:bg-gray-750">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={camera.image_url}
                                  alt={camera.name}
                                  className="h-10 w-10 rounded-md object-cover mr-3"
                                />
                                <div>
                                  <div className="font-medium">{camera.name}</div>
                                  <div className="text-gray-400 text-sm truncate max-w-xs">
                                    {camera.description.substring(0, 50)}...
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-700">
                                {camera.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              ₹{camera.rate_12hr}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              ₹{camera.rate_24hr}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleAvailability(camera.id, camera.available || false)}
                                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                  camera.available 
                                    ? 'bg-green-900 text-green-300 hover:bg-green-800' 
                                    : 'bg-red-900 text-red-300 hover:bg-red-800'
                                }`}
                              >
                                {camera.available ? 'Available' : 'Unavailable'}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDelete(camera.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Accessory Inventory</h2>
                </div>
                
                {loadingData ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading accessories...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-750">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Accessory
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            12H Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            24H Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {accessories.map(accessory => (
                          <tr key={accessory.id} className="hover:bg-gray-750">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={accessory.image_url}
                                  alt={accessory.name}
                                  className="h-10 w-10 rounded-md object-cover mr-3"
                                />
                                <div>
                                  <div className="font-medium">{accessory.name}</div>
                                  <div className="text-gray-400 text-sm truncate max-w-xs">
                                    {accessory.description.substring(0, 50)}...
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-700">
                                {accessory.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              ₹{accessory.rate_12hr}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              ₹{accessory.rate_24hr}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleAvailability(accessory.id, accessory.available || false)}
                                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                  accessory.available 
                                    ? 'bg-green-900 text-green-300 hover:bg-green-800' 
                                    : 'bg-red-900 text-red-300 hover:bg-red-800'
                                }`}
                              >
                                {accessory.available ? 'Available' : 'Unavailable'}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDelete(accessory.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
