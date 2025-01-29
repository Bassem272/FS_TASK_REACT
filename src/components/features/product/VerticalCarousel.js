import React, { Component } from 'react';

class VerticalCarousel extends Component {
  
  handleImageClick = (imageUrl) => {
    this.props.onSelectImage(imageUrl); 
  };

  render() {
    const { gallery, selectedImage } = this.props; 
    return (
      <div className="flex flex-row sm:flex-col items-start sm:items-center space-y-0 sm:space-y-4 space-x-4 sm:space-x-0 overflow-auto">

        {gallery.map((image, index) => (
          <img
            key={index}  
            src={image.image_url} 
            alt="Product Thumbnail" 
            className={`w-16 h-16 sm:w-20 sm:h-20 object-cover cursor-pointer ${
              selectedImage === image.image_url ? 'border-2 border-blue-500' : '' 
            }`}
            onClick={() => this.handleImageClick(image.image_url)} 
          />
        ))}
      </div>
    );
  }
}

export default VerticalCarousel;
