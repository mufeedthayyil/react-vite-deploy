import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('cameras');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" 
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
          backgroundPosition: 'center 30%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-900"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-40 pb-20 h-screen flex flex-col justify-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="text-indigo-400">Professional Gear</span>
            <br />for Your Creative Vision
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
            Rent top-of-the-line cameras and accessories to bring your photography and filmmaking projects to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#cameras"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 text-center"
            >
              Browse Our Gear
            </a>
            <a
              href="#how-it-works"
              className="bg-transparent hover:bg-white/10 text-white border border-white/30 font-semibold px-6 py-3 rounded-lg transition-colors duration-300 text-center"
            >
              How It Works
            </a>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce cursor-pointer" onClick={scrollToProducts}>
          <span className="text-gray-400 mb-2">Scroll</span>
          <ChevronDown className="h-6 w-6 text-indigo-400" />
        </div>
      </div>
      
      {/* Diagonal Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-900 -skew-y-1 transform origin-bottom-right z-0"></div>
    </div>
  );
};

export default Hero;