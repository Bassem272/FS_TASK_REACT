import React, { useContext, createContext, useState } from "react";

export const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [isCartOpn, setIsCartOpn] = useState(false);
  const toggle = () => {
    setIsCartOpn((prev) => !prev);
  };

  return (
    <CartContext.Provider value={{ isCartOpn, toggle }}>
      {children}
    </CartContext.Provider>
  );
};
