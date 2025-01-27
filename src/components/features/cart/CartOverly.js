import React, { Component } from "react";
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";
import CartAttributes from "./CartAttributes"; // Assuming you have the ProductAttributes component
import { Mutation } from "@apollo/client/react/components";
import { CREATE_ORDER } from "../../../graphql/mutation"; // Import the mutation
import { MdDelete } from "react-icons/md";

class CartOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: JSON.parse(localStorage.getItem("cart")) || [],
      totalItems: 0,
      noProducts: false,
    };
  }
  // Lifecycle method called when the component is mounted
  componentDidMount() {
    // Retrieve cart items from localStorage, defaulting to an empty array if none exist
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    // Calculate the total number of items in the cart
    const totalItems = cartItems.reduce((total, item) => {
      const quantity =
        item.quantity && typeof item.quantity === "number" && item.quantity > 0
          ? item.quantity // If quantity is valid, use it
          : 1; // Default to 1 if no valid quantity exists
      return total + quantity;
    }, 0);

    // Update component state with the total number of items in the cart
    this.setState({ totalItems });

    // Disable body scroll to focus on the cart (could be useful if it's a modal)
    document.body.style.overflow = "hidden";
  }

  // Lifecycle method called when the component will unmount
  componentWillUnmount() {
    // Restore body scroll behavior when the cart is closed or component is unmounted
    document.body.style.overflow = "auto";
  }

  // Handle removing an item from the cart based on product ID and selected attributes
  handleRemoveFromCart = (productId, selectedAttributes) => {
    // Filter out the item that matches the provided product ID and selected attributes
    const updatedCart = this.state.cartItems.filter(
      (item) =>
        !(
          item.id === productId &&
          JSON.stringify(item.selectedAttributes) ===
            JSON.stringify(selectedAttributes)
        )
    );

    // Update the component state with the updated cart
    this.setState({ cartItems: updatedCart });

    // Recalculate the total number of items after removal
    const totalItems = updatedCart.reduce((total, item) => {
      const quantity =
        item.quantity && typeof item.quantity === "number" && item.quantity > 0
          ? item.quantity
          : 1; // Default to 1 if no valid quantity exists
      return total + quantity;
    }, 0);

    // Update state with new total number of items
    this.setState({ totalItems });

    // Save updated cart data to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Handle updating the quantity of an item in the cart
  handleUpdateQuantity = (productId, selectedAttributes, quantity) => {
    // Update the quantity of the item in the cart, ensuring it doesn't go below 1
    const updatedCart = this.state.cartItems.map((item) =>
      item.id === productId &&
      JSON.stringify(item.selectedAttributes) ===
        JSON.stringify(selectedAttributes)
        ? { ...item, quantity: Math.max(1, quantity) } // Ensure quantity is at least 1
        : item
    );

    // Update the state with the updated cart
    this.setState({ cartItems: updatedCart });

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Recalculate the total number of items after the update
    const totalItems = updatedCart.reduce((total, item) => {
      const quantity =
        item.quantity && typeof item.quantity === "number" && item.quantity > 0
          ? item.quantity
          : 1; // Default to 1 if no valid quantity exists
      return total + quantity;
    }, 0);

    // Update the state with the new total number of items
    this.setState({ totalItems });
  };

  // Handle changing attributes (e.g., size, color) of an item in the cart
  handleAttributeChange = (productId, selectedAttributes) => {
    // Update the attributes of the item in the cart by merging with the existing ones
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

    // Update the component state with the updated cart
    this.setState({ cartItems: updatedCart });

    // Save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calculate the total price of all items in the cart
  getTotalPrice = () => {
    return this.state.cartItems.reduce(
      (total, item) => total + item.price[0].amount * item.quantity, // Multiply price by quantity for each item
      0 // Start with a total of 0
    );
  };

  // Handle placing an order by sending cart data to the server
  handlePlaceOrder = async (createOrder) => {
    // Get the current time (optional for the order creation)
    const currentTime = new Date().toLocaleTimeString();

    // Format the items to be passed to the order creation
    const items = this.state.cartItems.map((item) => ({
      productId: item.id, // Product ID
      name: item.name, // Product name
      price: item.price[0].amount, // Item price
      quantity: item.quantity, // Quantity of the product
      selectedAttributes: JSON.stringify(item.selectedAttributes), // Serialize selected attributes
      categoryId: item.category_id, // Product category ID
      inStock: item.inStock, // Stock status
    }));

    try {
      // Send request to create the order
      const response = await createOrder({
        variables: {userId: "user123", items }, // Include user ID and items
      });

      // Log the response and show success message
      console.log("Order placed successfully:", response.data);
      alert("Order placed successfully!");

      // Clear the cart from both the state and localStorage
      localStorage.removeItem("cart");
      this.setState({ cartItems: [], totalItems: 0 });

      // Dispatch an event to indicate cart has been updated (could trigger UI updates)
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      // Handle any errors during the order placement
      console.error("Error placing order:", err);
      alert("Error placing order!",err);
    }
  };

  // The render method returns the JSX for the component
  render() {
    const { cartItems, totalItems } = this.state;
    const { onClose } = this.props;

    return (
      <Mutation mutation={CREATE_ORDER}>
        {(createOrder, { loading, error, data }) => {
          return (
            <div
              data-testid="cart-overlay"
              className="fixed inset-0 flex justify-end "
              style={{ top: "64px", zIndex: 1000 }}
            >
              {/* Overlay to darken the background and close the cart */}
              <div
                className="absolute inset-0 bg-black bg-opacity-20"
                onClick={onClose}
              />

              {/* Sidebar Container (Cart Side Panel) */}
              <div
                className={`flex flex-col bg-white  p-4 shadow-lg relative z-50 lg:mr-12 md:mr-12 max-w-xs sm:max-w-sm sm:mr-0 ${
                  cartItems.length === 0 ? "h-24" : "h-5/6"
                }`}
              >
                {/* Close Button */}
                <button
                  className="absolute top-2 right-2 text-red-500"
                  onClick={onClose}
                >
                  <i className="fas fa-times"></i>
                </button>

                {/* Conditional Rendering for Empty Cart or Filled Cart */}
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
                    {/* Bag Header (Cart Title with Item Count) */}
                    <h2 className="text-sm font-semibold mb-4">
                      My Bag: {totalItems} {totalItems > 1 ? "Items" : "Item"}
                    </h2>

                    {/* Scrollable Section for Cart Items */}
                    <div className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-gray-200 p-2">
                      {cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between mb-2 border bg-white p-2"
                        >
                          {/* Left side: Product Details */}
                          <div className="flex flex-col justify-between w-2/3 pr-2">
                            <h3 className="text-sm font-semibold">
                              {item.name}
                            </h3>
                            <p className="text-sm">${item.price[0].amount}</p>

                            {/* Display Attributes if Available (size, color, etc.) */}
                            {item.attributes.length > 0 && (
                              <CartAttributes
                                attributes={item.attributes}
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

                          {/* Right side: Image, Quantity Control and Remove Button */}
                          <div className="w-full sm:w-2/3 flex flex-col items-center">
                            <div className="flex items-center mb-4 w-full justify-between">
                              {/* Quantity Controls and Image Container */}
                              <div className="flex flex-col items-center w-full">
                                {/* Increase Quantity Button */}
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

                                {/* Item Quantity Display */}
                                <span
                                  className="mb-6"
                                  data-testid="cart-item-amount"
                                >
                                  {item.quantity ? item.quantity : 1}
                                </span>

                                {/* Decrease Quantity Button */}
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

                              {/* Item Image */}
                              <div className="w-full max-w-[120px] h-auto overflow-hidden flex justify-center">
                                <img
                                  src={item.gallery[0].image_url}
                                  alt={item.name}
                                  className="object-cover w-full h-full"
                                  style={{ maxHeight: "120px" }} // Limit the maximum height of the image
                                />
                              </div>
                            </div>

                            {/* Remove Item Button */}
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

                    {/* Fixed Footer Section */}
                    <div className="border-t pt-4">
                      {/* Total Price Display */}
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

                      {/* Place Order Button */}
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
