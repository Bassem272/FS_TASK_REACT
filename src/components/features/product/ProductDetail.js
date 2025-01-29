import React from "react";

class ProductDetail extends React.Component {
  render() {
    const { product } = this.props; 

    return (
      <div>
        <h1>Product Detail for: {product.name}</h1>

        <p>Price: ${product.price[0].amount}</p>
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
