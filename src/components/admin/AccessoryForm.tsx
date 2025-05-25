import React, { useState } from 'react';
import { Accessory } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface AccessoryFormProps {
  accessory?: Accessory;
  onSubmit: (accessory: Accessory) => void;
  onCancel: () => void;
}

const AccessoryForm: React.FC<AccessoryFormProps> = ({ accessory, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Accessory>(
    accessory || {
      id: uuidv4(),
      name: '',
      category: '',
      imageUrl: '',
      description: '',
      price12h: 0,
      price24h: 0,
      available: true
    }
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-white">
        {accessory ? 'Edit Accessory' : 'Add New Accessory'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-300 block">
            Accessory Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-gray-300 block">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Select Category</option>
            <option value="Lens">Lens</option>
            <option value="Stabilizer">Stabilizer</option>
            <option value="Lighting">Lighting</option>
            <option value="Audio">Audio</option>
            <option value="Support">Support</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Storage">Storage</option>
            <option value="Power">Power</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="price12h" className="text-sm font-medium text-gray-300 block">
            12 Hour Price ($)
          </label>
          <input
            type="number"
            id="price12h"
            name="price12h"
            value={formData.price12h}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="price24h" className="text-sm font-medium text-gray-300 block">
            24 Hour Price ($)
          </label>
          <input
            type="number"
            id="price24h"
            name="price24h"
            value={formData.price24h}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="imageUrl" className="text-sm font-medium text-gray-300 block">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-300 block">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-700"
            />
            <span className="ml-2 text-sm text-gray-300">Available for Rent</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          {accessory ? 'Update Accessory' : 'Add Accessory'}
        </button>
      </div>
    </form>
  );
};

export default AccessoryForm;