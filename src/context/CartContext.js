import React, { useContext, createContext, useState } from "react";

export const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [isCartOpn, setIsCartOpn] = useState(false);
  console.log(isCartOpn, "out");
  const toggle = () => {
    console.log(isCartOpn, "this is before ok ");
    setIsCartOpn((prev) => !prev);
    console.log(isCartOpn, "this is after ok ");
  };
  console.log(isCartOpn, "in ");

  return (
    <CartContext.Provider value={{ isCartOpn, toggle }}>
      {children}
    </CartContext.Provider>
  );
};
