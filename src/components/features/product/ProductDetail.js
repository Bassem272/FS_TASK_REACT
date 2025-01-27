import React from "react";

class ProductDetail extends React.Component {
  render() {
    // Access the `product` object passed down from the parent component (assumed as prop)
    const { product } = this.props; 

    return (
      <div>
        {/* Display the product name */}
        <h1>Product Detail for: {product.name}</h1>

        {/* Display the product price (assuming it's an array, and we're getting the first element) */}
        <p>Price: ${product.price[0].amount}</p>

        {/* Display product image */}
        <img
          src={product.gallery[0].image_url}
          alt={product.name} 
          className="w-full h-auto object-cover"
        />
      </div>
    );
  }
}

export default ProductDetail;
