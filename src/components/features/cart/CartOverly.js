import React, { Component } from "react";
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";
import CartAttributes from "./CartAttributes"; 
import { Mutation } from "@apollo/client/react/components";
import { CREATE_ORDER } from "../../../graphql/mutation"; 
import { MdDelete } from "react-icons/md";

class CartOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: JSON.parse(localStorage.getItem("cart")) || [],
      totalItems: 0,
      noProducts: false,
      hoveredIndex: null, 
    };
    this.scrollToLastProduct = this.scrollToLastProduct.bind(this);
  }
 
  scrollToLastProduct = () => {
    const container = document.getElementById("cart-container");
    const lastChild = container ? container.lastElementChild : null;

    if (lastChild) {
      container.scrollTo({
        top: lastChild.offsetTop,
        behavior: 'smooth',
      });
    }
  }
  componentDidMount() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cartItems.reduce((total, item) => {
      const quantity =
        item.quantity && typeof item.quantity === "number" && item.quantity > 0
          ? item.quantity 
          : 1; 
      return total + quantity;
    }, 0);

    this.setState({ totalItems });
    document.body.style.overflow = "hidden";
    this.scrollToLastProduct();

  }

  componentWillUnmount() {
    document.body.style.overflow = "auto";
  }

  handleRemoveFromCart = (productId, selectedAttributes) => {
    const updatedCart = this.state.cartItems.filter(
      (item) =>
        !(
          item.id === productId &&
          JSON.stringify(item.selectedAttributes) ===
            JSON.stringify(selectedAttributes)
        )
    );

    this.setState({ cartItems: updatedCart });

    const totalItems = updatedCart.reduce((total, item) => {
      const quantity =
        item.quantity && typeof item.quantity === "number" && item.quantity > 0
          ? item.quantity
          : 1; 
      return total + quantity;
    }, 0);

    this.setState({ totalItems });

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  handleUpdateQuantity = (productId, selectedAttributes, quantity) => {
    const updatedCart = this.state.cartItems.map((item) =>
      item.id === productId &&
      JSON.stringify(item.selectedAttributes) ===
        JSON.stringify(selectedAttributes)
        ? { ...item, quantity: Math.max(1, quantity) } 
        : item
    );

    this.setState({ cartItems: updatedCart });

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const totalItems = updatedCart.reduce((total, item) => {
      const quantity =
        item.quantity && typeof item.quantity === "number" && item.quantity > 0
          ? item.quantity
          : 1;
      return total + quantity;
    }, 0);

    this.setState({ totalItems });
  };

  handleAttributeChange = (productId, selectedAttributes) => {
    const updatedCart = this.state.cartItems.map((item) =>
      item.id === productId
        ? {
            ...item,
            selectedAttributes: {
              ...item.selectedAttributes,
              ...selectedAttributes,
            },
          }
        : item
    );

    this.setState({ cartItems: updatedCart });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  getTotalPrice = () => {
    return this.state.cartItems.reduce(
      (total, item) => total + item.price[0].amount * item.quantity, 
      0 
    );
  };

  handlePlaceOrder = async (createOrder) => {
    const items = this.state.cartItems.map((item) => ({
      productId: item.id, 
      name: item.name, 
      price: item.price[0].amount, 
      quantity: item.quantity, 
      selectedAttributes: JSON.stringify(item.selectedAttributes), 
      categoryId: item.category_id, 
      inStock: item.inStock, 
    }));

    try {
      const response = await createOrder({
        variables: {userId: "user123", items }, 
      });

      alert("Order placed successfully!");

      localStorage.removeItem("cart");
      this.setState({ cartItems: [], totalItems: 0 });

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      alert("Error placing order!",err);
    }
  };


  handleMouseEnter = (index) => {
    this.setState({ hoveredIndex: index });
  };

  handleMouseLeave = () => {
    this.setState({ hoveredIndex: null });
  };

  render() {
    const { cartItems, totalItems } = this.state;
    const { onClose } = this.props;
    const { hoveredIndex } = this.state;

    return (
      <Mutation mutation={CREATE_ORDER}>
        {(createOrder, { loading, error, data }) => {
          return (
            <div
              data-testid="cart-overlay"
              className="fixed inset-0 flex justify-end "
              style={{ top: "64px", zIndex: 1000 }}
            >
              <div
                className="absolute inset-0 bg-black bg-opacity-20"
                onClick={onClose}
              />

              <div
                className={`flex flex-col bg-white  p-4  shadow-lg relative z-50 lg:mr-12 md:mr-15 max-w-xs sm:max-w-sm sm:mr-0 ${
                  cartItems.length === 0 ? "h-24" : "h-5/6"
                }`}
              >
                <button
                  className="absolute top-2 right-2 text-red-500"
                  onClick={onClose}
                >
                  <i className="fas fa-times"></i>
                </button>

                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-10 text-gray-600">
                    <i className="fas fa-shopping-cart text-4xl mb-4"></i>
                    <p className="text-sm font-semibold">Your cart is empty</p>
                    <button
                      className="mt-4 px-4 py-2 bg-green-500 text-white text-sm rounded shadow"
                      onClick={onClose}
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-sm font-semibold mb-4">
                      My Bag: {totalItems} {totalItems > 1 ? "Items" : "Item"}
                    </h2>

                    <div id="cart-container" className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-gray-200 p-5">
                      {cartItems.map((item, index) => (
                  <div
                  key={index}
                  onMouseEnter={() => this.handleMouseEnter(index)}
                  onMouseLeave={this.handleMouseLeave}
                  className={`flex justify-between mb-2 border p-2 pr-10 rounded-lg transition-all transform ${
                    hoveredIndex === index
                      ? "bg-white shadow-lg border-gray-400" 
                      : hoveredIndex !== null
                      ? "bg-gray-100 border-gray-300" 
                      : "bg-white border-gray-300" 
                  }`}
                >
                          <div className="flex flex-col justify-between w-2/3 pr-2 mr-5">
                            <h3 className="text-sm font-semibold">
                              {item.name}
                            </h3>
                            <p className="text-sm">${item.price[0].amount}</p>

                            {item.attributes.length > 0 && (
                              <CartAttributes
                                item={item}
                                onAttributeChange={(selectedAttributes) =>
                                  this.handleAttributeChange(
                                    item.id,
                                    selectedAttributes
                                  )
                                }
                                isCartItem={true}
                              />
                            )}
                          </div>

                          <div className="w-full sm:w-2/3 flex flex-col items-center">
                            <div className="flex items-center mb-4 w-full justify-between">
                              <div className="flex flex-col items-center w-full">

                                <button
                                  className="mb-6 mt-5"
                                  data-testid="cart-item-amount-increase"
                                  onClick={() =>
                                    this.handleUpdateQuantity(
                                      item.id,
                                      item.selectedAttributes,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  <CiSquarePlus />
                                </button>
                                <span
                                  className="mb-6"
                                  data-testid="cart-item-amount"
                                >
                                  {item.quantity ? item.quantity : 1}
                                </span>

                                <button
                                  data-testid="cart-item-amount-decrease"
                                  onClick={() =>
                                    this.handleUpdateQuantity(
                                      item.id,
                                      item.selectedAttributes,
                                      item.quantity - 1
                                    )
                                  }
                                >
                                  <CiSquareMinus />
                                </button>
                              </div>

                              <div className="w-full max-w-[120px] h-auto overflow-hidden flex justify-center">
                                <img
                                  src={item.gallery[0].image_url}
                                  alt={item.name}
                                  className="object-cover w-full h-full"
                                  style={{ maxHeight: "120px" }} 
                                />
                              </div>
                            </div>

                            <div className="flex flex-row">
                              <button
                                className="text-xs mt-2 text-red-400"
                                onClick={() =>
                                  this.handleRemoveFromCart(
                                    item.id,
                                    item.selectedAttributes
                                  )
                                }
                              >
                                <MdDelete className="w-5 h-5 text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>


                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span
                          className="font-semibold"
                          data-testid="cart-total"
                        >
                          Total:
                        </span>
                        <span className="font-semibold">
                          ${this.getTotalPrice().toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => this.handlePlaceOrder(createOrder)}
                        className="w-full bg-green-500 text-white py-2 mt-4 rounded"
                      >
                        Place Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default CartOverlay;
