import React, { useState, useEffect } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import CartOverlay from "../features/cart/CartOverly";
import { useCart } from "../../context/CartContext";
import { Query } from "@apollo/client/react/components";
import { GET_CATEGORIES } from "../../graphql/queries";

const Header = ({ onCategoryChange }) => {
  const [totalItems, setTotalItems] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isCartOpn, toggle } = useCart();

  const updateTotalItems = () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cartItems.reduce((total, item) => {
      const quantity =
        item.quantity && typeof item.quantity === "number" && item.quantity > 0
          ? item.quantity
          : 1;
      return total + quantity;
    }, 0);
    setTotalItems(total);
  };

  useEffect(() => {
    updateTotalItems();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      updateTotalItems();
    };

    const handleCartUpdate = () => {
      updateTotalItems();
    };

    window.addEventListener("storage", handleStorageChange);

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments);
      if (key === "cart") {
        updateTotalItems();
      }
    };

    return () => {
      localStorage.setItem = originalSetItem;
    };
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
    navigate("/");
  };

  const toggleCart = () => {
    toggle();
  };

  const closeCart = () => {
    toggle();
  };

  return (
    <div className="flex flex-row items-center w-full h-16 p-1 m-0 border-b-4 shadow-sm text-black font-medium text-lg">
      <div className="flex flex-row items-center w-fit h-full ml-8">
        <Query query={GET_CATEGORIES}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            const categories = [
              ...data.categories.map((category) => category.name.toUpperCase()),
            ].reverse();

            return (
              <div>
                {categories.map((category) => (
                  <a
                    key={category}
                    href={`/${category.toLowerCase()}`}
                    className={`h-full w-fit p-1 m-2 text-slate-500 hover:text-green-400 hover:border-b-2 hover:border-green-400 ${
                      activeCategory === category
                        ? "text-green-400 border-b-2 border-green-400"
                        : ""
                    }`}
                    data-testid={
                      activeCategory === category ? "active-category-link" : ""
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategoryChange(category);
                    }}
                  >
                    {category}
                  </a>
                ))}
              </div>
            );
          }}
        </Query>
      </div>
      <div className="flex-1"></div>
      {isCartOpen && (
        <img
          src="/refresh-svgrepo-com.svg"
          alt="refresh icon"
          className="w-6 h-6 hidden md:block"
        />
      )}
      <div className="flex-1"></div>
      <button
        aria-label="Open Cart"
        data-testid="cart-btn"
        className="relative h-full w-fit p-1 text-slate-500 hover:text-green-400 mr-12"
        onClick={toggleCart}
      >
        <AiOutlineShoppingCart className="h-6 w-6 text-green-500" />
        {totalItems > 0 && (
          <span className="absolute top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
      {isCartOpn && <CartOverlay onClose={closeCart} />}
    </div>
  );
};

export default Header;
