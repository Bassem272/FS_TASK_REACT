import React, { Component } from 'react';

class VerticalCarousel extends Component {
  // Function to handle image click and notify parent of the selected image
  handleImageClick = (imageUrl) => {
    this.props.onSelectImage(imageUrl); // Passing the selected image URL to parent
  };

  render() {
    const { gallery, selectedImage } = this.props; // Destructure props: gallery of images and selected image

    return (
      <div className="flex flex-row sm:flex-col items-start sm:items-center space-y-0 sm:space-y-4 space-x-4 sm:space-x-0 overflow-auto">
        {/* Map over the gallery images */}
        {gallery.map((image, index) => (
          <img
            key={index}  // Key is set to the index of the image to help React track individual items
            src={image.image_url} // Image URL from the gallery
            alt="Product Thumbnail" // Alt text for accessibility
            className={`w-16 h-16 sm:w-20 sm:h-20 object-cover cursor-pointer ${
              selectedImage === image.image_url ? 'border-2 border-blue-500' : '' // Highlight selected image
            }`}
            onClick={() => this.handleImageClick(image.image_url)} // Handle the click event
          />
        ))}
      </div>
    );
  }
}

export default VerticalCarousel;
