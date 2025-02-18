import React, { Component } from "react";
import { Query } from "@apollo/client/react/components";
import VerticalCarousel from "../components/features/product/VerticalCarousel";
import MainImage from "../components/features/product/MainImage";
import ProductAttributes from "../components/features/product/ProductAttributes";
import { withParams } from "../hoc/WithParams";
import parse from "html-react-parser";
import { GET_PRODUCT } from "../graphql/queries";
import { CartContext } from "../context/CartContext";
class ProductDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: {},
      isAddToCartEnabled: false,
      currentImageIndex: 0,
    };
  }


  handleImageSelect = (imageUrl, gallery) => {
    if (!gallery) return;

    const selectedIndex = gallery.findIndex(
      (image) => image.image_url === imageUrl
    );
    if (selectedIndex !== -1) {
      this.setState({ currentImageIndex: selectedIndex });
    }
  };

  nextImage = (gallery) => {
    if (!gallery) return;

    this.setState((prevState) => ({
      currentImageIndex: (prevState.currentImageIndex + 1) % gallery.length,
    }));
  };

  prevImage = (gallery) => {
    if (!gallery) return;

    this.setState((prevState) => ({
      currentImageIndex:
        (prevState.currentImageIndex - 1 + gallery.length) % gallery.length,
    }));
  };

  handleAttributeSelection = (selectedAttributes) => {
    this.setState({
      selectedAttributes,
      isAddToCartEnabled: true,
    },
    );

  };

  handleAddToCart = (product, toggle) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const { selectedAttributes } = this.state;

    const productInCartIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        JSON.stringify(item.selectedAttributes) ===
          JSON.stringify(selectedAttributes)
    );

    if (productInCartIndex !== -1) {
      cart[productInCartIndex].quantity += 1;
    } else {
      cart.push({
        ...product,
        selectedAttributes: Object.entries(selectedAttributes).map(([key, value]) => ({
          key,
          value,
        })),
        quantity: 1,
        fromDetailsPage:true,  
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setTimeout(() => {
      toggle();
    }, 500);
  };

  render() {
    const { id } = this.props.params;
    const { currentImageIndex, isAddToCartEnabled } = this.state;

    return (
      <CartContext.Consumer>
        {({ isCartOpn, toggle }) => (
          <Query query={GET_PRODUCT} variables={{ id }}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error: {error.message}</p>;

              const product = data.product;
              const gallery = product?.gallery || [];

              if (!product) {
                return <p>Product not found.</p>;
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-8">
                  {/* Gallery Section */}
                  <div
                    className="md:col-span-2 grid grid-cols-1 sm:grid-cols-5 gap-4"
                    data-testid="product-gallery"
                  >
                    <VerticalCarousel
                      gallery={gallery}
                      onSelectImage={(imageUrl) =>
                        this.handleImageSelect(imageUrl, gallery)
                      }
                      selectedImage={gallery[currentImageIndex]?.image_url}
                    />
                    <MainImage
                      gallery={gallery}
                      currentImageIndex={currentImageIndex}
                      nextImage={() => this.nextImage(gallery)}
                      prevImage={() => this.prevImage(gallery)}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="md:col-span-1">
                    <h1 className="text-lg md:text-2xl font-bold mb-4">
                      {product.name}
                    </h1>
                    <ProductAttributes
                      attributes={product.attributes}
                      onAttributeChange={this.handleAttributeSelection}
                      isCartItem={false}
                    />
                    <p className="text-lg md:text-xl font-semibold my-4">
                      ${product.price[0].amount.toFixed(2)}
                    </p>
                    <button
                      data-testid="add-to-cart"
                      className={`bg-green-500 text-white px-4 py-2 mt-4 w-full ${
                        product.inStock && isAddToCartEnabled
                          ? "hover:bg-green-400"
                          : "opacity-50"
                      }`}
                      onClick={() => this.handleAddToCart(product, toggle)}
                      disabled={!product.inStock || !isAddToCartEnabled}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>

                    <div className="mt-6">
                      <h2 className="text-md md:text-lg font-bold mb-2">
                        Description
                      </h2>
                      <div data-testid="product-description">
                        {parse(product.description)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </Query>
        )}
      </CartContext.Consumer>
    );
  }
}

export default withParams(ProductDetailPage);
