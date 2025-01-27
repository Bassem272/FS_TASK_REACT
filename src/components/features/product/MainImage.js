import React from 'react';

const MainImage = ({ gallery, currentImageIndex, nextImage, prevImage }) => {
  return (
    <div className="sm:col-span-4 relative">
      {/* Container for Main Product Image */}
      <div className="relative w-full h-64 sm:h-96 overflow-hidden">
        <img
          src={gallery[currentImageIndex].image_url} // Source for current image
          alt="Main Product" // Alt text for accessibility
          className="w-full h-full object-contain" // Ensure the image fits within the box
        />
      </div>

      {/* Button to navigate to the previous image */}
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md"
        onClick={prevImage}
      >
        &lt; {/* Left arrow */}
      </button>

      {/* Button to navigate to the next image */}
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md"
        onClick={nextImage}
      >
        &gt; {/* Right arrow */}
      </button>
    </div>
  );
};

export default MainImage;
