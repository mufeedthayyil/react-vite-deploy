import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/admin/LoginForm';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { equipmentService } from '../services/equipmentService';
import { Database } from '../types/database';
import { Edit, Trash2, Plus, Camera as CameraIcon, Package } from 'lucide-react';

type Equipment = Database['public']['Tables']['equipments']['Row'];

const Admin: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'cameras' | 'accessories'>('cameras');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadEquipment();
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md transition-colors"
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
          </div>
          
          <div className="p-6">
            {activeTab === 'cameras' ? (
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
