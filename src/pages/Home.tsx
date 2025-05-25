import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import Hero from '../components/home/Hero';
import Footer from '../components/common/Footer';
import CameraCard from '../components/products/CameraCard';
import AccessoryCard from '../components/products/AccessoryCard';
import { Camera, Accessory } from '../types';
import { getCameras, getAccessories, initializeLocalStorage } from '../utils/localStorage';

const Home: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  
  useEffect(() => {
    // Initialize local storage with data if needed
    initializeLocalStorage();
    
    // Load data
    setCameras(getCameras());
    setAccessories(getAccessories());
  }, []);
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <Hero />
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Renting professional camera gear has never been easier. Follow these simple steps to get the equipment you need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse & Select</h3>
              <p className="text-gray-400">
                Browse our extensive collection of professional cameras and accessories. Select the items you need for your project.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Rental Duration</h3>
              <p className="text-gray-400">
                Select how long you need the equipment for. We offer flexible 12-hour and 24-hour rental periods to suit your needs.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Checkout & Pickup</h3>
              <p className="text-gray-400">
                Complete your reservation and pick up your gear at our store. Return it when your rental period is over.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Cameras Section */}
      <section id="cameras" className="py-20 bg-gray-850">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Professional Cameras</h2>
              <p className="text-gray-400">
                High-quality cameras for every type of shoot
              </p>
            </div>
            <div className="hidden md:block">
              <a href="#cameras" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                View All Cameras
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cameras.map(camera => (
              <CameraCard key={camera.id} camera={camera} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Accessories Section */}
      <section id="accessories" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Essential Accessories</h2>
              <p className="text-gray-400">
                Complete your setup with our premium accessories
              </p>
            </div>
            <div className="hidden md:block">
              <a href="#accessories" className="text-purple-400 hover:text-purple-300 transition-colors">
                View All Accessories
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accessories.map(accessory => (
              <AccessoryCard key={accessory.id} accessory={accessory} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-850">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what photographers and filmmakers have to say about LensPro Rentals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full mr-4 flex items-center justify-center font-bold">
                  JS
                </div>
                <div>
                  <h4 className="font-semibold">Jane Smith</h4>
                  <p className="text-gray-400 text-sm">Professional Photographer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "The quality of LensPro's equipment is exceptional. I rented the Canon EOS R5 for a wedding shoot and the photos turned out amazing. Will definitely rent again!"
              </p>
              <div className="flex text-yellow-400 mt-4">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full mr-4 flex items-center justify-center font-bold">
                  MD
                </div>
                <div>
                  <h4 className="font-semibold">Mark Davis</h4>
                  <p className="text-gray-400 text-sm">Indie Filmmaker</p>
                </div>
              </div>
              <p className="text-gray-300">
                "I rented the Blackmagic Pocket 6K along with some lenses and lights for my short film. The equipment was in perfect condition and the staff was incredibly helpful."
              </p>
              <div className="flex text-yellow-400 mt-4">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full mr-4 flex items-center justify-center font-bold">
                  SR
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Rodriguez</h4>
                  <p className="text-gray-400 text-sm">Photography Student</p>
                </div>
              </div>
              <p className="text-gray-300">
                "As a student, I appreciate the affordable rental options. Being able to use professional equipment for my class projects has helped me improve my skills tremendously."
              </p>
              <div className="flex text-yellow-400 mt-4">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Rent Professional Gear?</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
            Browse our collection of high-quality cameras and accessories for your next photography or film project.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#cameras"
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Browse Cameras
            </a>
            <a
              href="#accessories"
              className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Explore Accessories
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;