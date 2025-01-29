import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ApolloClientProvider } from "./graphql/ApolloClient";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import Header from "./components/shared/Header";
import { CartProvider } from "./context/CartContext";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: JSON.parse(localStorage.getItem("cart")) || [],
      activeCategory: "All",
    };
  }

  componentDidMount() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    this.setState({ cartItems });
  }

  addToCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...cartItems, product];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    this.setState({ cartItems: updatedCart });
  };

  handleCategoryChange = (category) => {
    this.setState({ activeCategory: category });
  };

  render() {
    const { cartItems, activeCategory } = this.state;

    return (
      <ApolloClientProvider>
        <Router>
          <CartProvider>
            <Header
              cartItems={cartItems}
              onCategoryChange={this.handleCategoryChange}
              activeCategory={this.state.activeCategory}
            />
            <div>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProductListPage
                      addToCart={this.addToCart}
                      activeCategory={activeCategory}
                    />
                  }
                />
                <Route path="/product/:id" element={<ProductDetailPage />} />
              </Routes>
            </div>
          </CartProvider>
        </Router>
      </ApolloClientProvider>
    );
  }
}

export default App;
