import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/admin/LoginForm';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CameraForm from '../components/admin/CameraForm';
import AccessoryForm from '../components/admin/AccessoryForm';
import { Camera, Accessory } from '../types';
import { 
  getCameras, 
  getAccessories, 
  addCamera, 
  updateCamera, 
  deleteCamera,
  addAccessory,
  updateAccessory,
  deleteAccessory
} from '../utils/localStorage';
import { Edit, Trash2, Plus, Camera as CameraIcon, Package } from 'lucide-react';

const Admin: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'cameras' | 'accessories'>('cameras');
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [showCameraForm, setShowCameraForm] = useState(false);
  const [showAccessoryForm, setShowAccessoryForm] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  
  useEffect(() => {
    if (isAuthenticated) {
      setCameras(getCameras());
      setAccessories(getAccessories());
    }
  }, [isAuthenticated]);
  
  const handleCameraSubmit = (camera: Camera) => {
    if (editingCamera) {
      updateCamera(camera);
      setEditingCamera(null);
    } else {
      addCamera(camera);
    }
    setShowCameraForm(false);
    setCameras(getCameras());
  };
  
  const handleAccessorySubmit = (accessory: Accessory) => {
    if (editingAccessory) {
      updateAccessory(accessory);
      setEditingAccessory(null);
    } else {
      addAccessory(accessory);
    }
    setShowAccessoryForm(false);
    setAccessories(getAccessories());
  };
  
  const handleDeleteCamera = (id: string) => {
    if (window.confirm('Are you sure you want to delete this camera?')) {
      deleteCamera(id);
      setCameras(getCameras());
    }
  };
  
  const handleDeleteAccessory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this accessory?')) {
      deleteAccessory(id);
      setAccessories(getAccessories());
    }
  };
  
  const handleEditCamera = (camera: Camera) => {
    setEditingCamera(camera);
    setShowCameraForm(true);
  };
  
  const handleEditAccessory = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setShowAccessoryForm(true);
  };
  
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
              className={`px-6 py-3 font-medium flex items-center ₹{
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
              className={`px-6 py-3 font-medium flex items-center ₹{
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
                  <button
                    onClick={() => {
                      setEditingCamera(null);
                      setShowCameraForm(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Camera
                  </button>
                </div>
                
                {showCameraForm ? (
                  <CameraForm
                    camera={editingCamera || undefined}
                    onSubmit={handleCameraSubmit}
                    onCancel={() => {
                      setShowCameraForm(false);
                      setEditingCamera(null);
                    }}
                  />
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
                                  src={camera.imageUrl}
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
                              ₹{camera.price12h}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              ₹{camera.price24h}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span 
                                className={`px-2 py-1 text-xs rounded-full ₹{
                                  camera.available 
                                    ? 'bg-green-900 text-green-300' 
                                    : 'bg-red-900 text-red-300'
                                }`}
                              >
                                {camera.available ? 'Available' : 'Unavailable'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEditCamera(camera)}
                                className="text-indigo-400 hover:text-indigo-300 mr-3"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCamera(camera.id)}
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
                  <button
                    onClick={() => {
                      setEditingAccessory(null);
                      setShowAccessoryForm(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Accessory
                  </button>
                </div>
                
                {showAccessoryForm ? (
                  <AccessoryForm
                    accessory={editingAccessory || undefined}
                    onSubmit={handleAccessorySubmit}
                    onCancel={() => {
                      setShowAccessoryForm(false);
                      setEditingAccessory(null);
                    }}
                  />
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
                                  src={accessory.imageUrl}
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
                              ₹{accessory.price12h}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              ₹{accessory.price24h}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span 
                                className={`px-2 py-1 text-xs rounded-full ₹{
                                  accessory.available 
                                    ? 'bg-green-900 text-green-300' 
                                    : 'bg-red-900 text-red-300'
                                }`}
                              >
                                {accessory.available ? 'Available' : 'Unavailable'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEditAccessory(accessory)}
                                className="text-purple-400 hover:text-purple-300 mr-3"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAccessory(accessory.id)}
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
