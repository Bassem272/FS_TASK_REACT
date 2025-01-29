import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "react-feather";
import { CartContext } from "../../../context/CartContext";

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: JSON.parse(localStorage.getItem("cart")) || [],
      totalItems: 0,
    };
  }
  handleAddToCart = (toggle) => {
    const { product, addToCart } = this.props;

    if (!product.inStock) {
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const productExists = cart.some((item) => item.id === product.id);

    if (!productExists) {
      const productToAdd = {
        ...product,
        quantity: 1,
        selectedAttributes:
          product.attributes.length > 0
            ? product.attributes[0].attribute_items[0]
            : {},
      };

      this.setState({ cartItems: cart });
      localStorage.setItem("cart", JSON.stringify(cart));

      addToCart(productToAdd);

      this.setState({ isCartOpen: true });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      const scrollTime = Math.min(window.scrollY / 2, 1000);

      setTimeout(() => {
        toggle();
      }, scrollTime);
    } 
  };

  render() {
    const { product } = this.props;

    const kebabCaseProductName = product.name
      .toLowerCase()
      .replace(/\s+/g, "-");

    return (
      <CartContext.Consumer>
        {({ isCartOpn, toggle }) => (
          <div
            className="relative border shadow-md p-4 group transition-transform transform hover:scale-105"
            data-testid={`product-${kebabCaseProductName}`}
          >
            {/* Product Image Container with Fixed Dimensions */}
            <div className="p-4 w-full h-60 sm:h-72 md:h-80 lg:h-96 relative bg-white overflow-hidden rounded-lg">
              {/* Product Image */}
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.gallery[0].image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/path/to/placeholder-image.png";
                  }}
                />
              </Link>
              {/* Overlay for Out of Stock */}
              {!product.inStock && (
                <Link to={`/product/${product.id}`}>
                  <div className="absolute inset-0 bg-black opacity-10 flex items-center justify-center">
                    <span className="text-white text-3xl font-semibold">
                      Out of Stock
                    </span>
                  </div>
                </Link>
              )}

              {/* Cart Icon (appears on hover) */}
              <div
                className={`absolute bottom-2 right-2 text-white rounded-full p-2 cursor-pointer
                      group-hover:opacity-100 transition-opacity duration-300 ${
                        product.inStock ? "bg-green-500" : "bg-black-600"
                      } opacity-0`}
                onClick={
                  !product.inStock ? null : () => this.handleAddToCart(toggle)
                }
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart />
              </div>
            </div>
            {/* Product Name */}
            <h2 className="text-xl mt-2">{product.name}</h2>
            {/* Product Price */}
            <p className="text-gray-700">
              ${product.price[0].amount.toFixed(2)}
            </p>
          </div>
        )}
      </CartContext.Consumer>
    );
  }
}

export default ProductCard;
