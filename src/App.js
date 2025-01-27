import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloClientProvider } from './graphql/ApolloClient'; // Import Apollo Client Provider
import ProductListPage from './pages/ProductListPage';  // Import ProductListPage Component
import ProductDetailPage from './pages/ProductDetailPage';  // Import ProductDetailPage Component
import Header from './components/shared/Header';  // Import Header Component
import { CartProvider } from './context/CartContext'
class App extends Component {
  // Set initial state: cartItems and activeCategory
  constructor(props) {
    super(props);
    this.state = {
      cartItems: JSON.parse(localStorage.getItem('cart')) || [], // Load cart items from localStorage
      activeCategory: 'All', // Initial active category state is "All"
    };
  }

  // Component did mount to load initial cartItems from localStorage
  componentDidMount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    this.setState({ cartItems });
  }

  // Add item to cart and update localStorage
  addToCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];  // Get existing items
    const updatedCart = [...cartItems, product];  // Add new product to cart
    localStorage.setItem('cart', JSON.stringify(updatedCart));  // Save updated cart to localStorage
    this.setState({ cartItems: updatedCart });  // Update state to reflect the changes
  };

  // Handle category change
  handleCategoryChange = (category) => {
    this.setState({ activeCategory: category });  // Update the active category state
  };

  render() {
    const { cartItems, activeCategory } = this.state;  // Destructure cartItems and activeCategory from state
    
    return (
      <ApolloClientProvider> {/* Wrap app with Apollo Client Provider */}
        <Router>  {/* Use Router for navigating between pages */}
          
          {/* Header Component that accepts cartItems, category change handler, and activeCategory */}
        <CartProvider>

          <Header 
            cartItems={cartItems} 
            onCategoryChange={this.handleCategoryChange} 
            activeCategory={this.state.activeCategory} 
            />

          <div>
            {/* Set up Routes for ProductListPage and ProductDetailPage */}
            <Routes>
              <Route 
                path="/" 
                element={<ProductListPage addToCart={this.addToCart} activeCategory={activeCategory} />} 
                />
              <Route 
                path="/product/:id" 
                element={<ProductDetailPage />} 
                />
            </Routes>
          </div>

                </CartProvider>
        </Router>
      </ApolloClientProvider>
    );
  }
}

export default App;
