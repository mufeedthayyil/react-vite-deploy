import React from 'react';
import { Camera, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Camera className="h-6 w-6 text-indigo-500 mr-2" />
              <h3 className="text-xl font-semibold text-white">LensPro Rentals</h3>
            </div>
            <p className="mb-4">
              Professional camera gear rentals for photographers and filmmakers. Quality equipment at competitive prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-indigo-500 transition-colors">Home</a>
              </li>
              <li>
                <a href="#cameras" className="hover:text-indigo-500 transition-colors">Cameras</a>
              </li>
              <li>
                <a href="#accessories" className="hover:text-indigo-500 transition-colors">Accessories</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-500 transition-colors">FAQ</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Rental Info</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-indigo-500 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-500 transition-colors">Rental Policies</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-500 transition-colors">Insurance</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-500 transition-colors">Shipping</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />
                <span>123 Camera Street, Photo City, PC 12345</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-indigo-500 mr-2" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-indigo-500 mr-2" />
                <span>info@lensprorentals.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} LensPro Rentals. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-400 hover:text-indigo-500 transition-colors mr-4">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-indigo-500 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;