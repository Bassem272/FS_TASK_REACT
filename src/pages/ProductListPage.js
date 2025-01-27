import React, { Component } from "react";
import { Query } from "@apollo/client/react/components";
import { GET_PRODUCTS } from "../graphql/queries"; // Import query
import ProductCard from "../components/features/product/ProductCard";

class ProductListPage extends Component {
  render() {
    const { addToCart, activeCategory } = this.props; // Destructure props

    return (
      <div className="container mx-auto px-4 pb-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold my-6 text-start ml-3">
          {activeCategory.toUpperCase()}
        </h1>

        <Query query={GET_PRODUCTS}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            const normalizedActiveCategory = activeCategory.toLowerCase();
            const filteredProducts = data.products.filter((product) => {
              const normalizedCategoryId = product.category_id.toLowerCase();
              return (
                normalizedActiveCategory === "all" ||
                normalizedCategoryId === normalizedActiveCategory
              );
            });

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default ProductListPage;
