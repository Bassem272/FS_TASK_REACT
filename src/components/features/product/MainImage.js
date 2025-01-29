import React from 'react';

const MainImage = ({ gallery, currentImageIndex, nextImage, prevImage }) => {
  return (
    <div className="sm:col-span-4 relative">
      <div className="relative w-full h-64 sm:h-96 overflow-hidden flex justify-center items-center">
        <img
          src={gallery[currentImageIndex].image_url} 
          alt="Main Product" 
          className="w-full h-full object-contain" 
        />
                <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md"
          onClick={prevImage}
        >
          &lt; 
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md"
          onClick={nextImage}
        >
          &gt; 
        </button>
      </div>
    </div>
  );
};

export default MainImage;
