import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      inStock
      category_id
      brand
      __typename
      price {
        product_id
        amount
        __typename
      }
      gallery {
        product_id
        image_url
      }
      attributes {
        id
        name
        product_id
        type
        __typename
        attribute_items {
          id
          attribute_id
          product_id
          displayValue
          value
          __typename
        }
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query ($id: String!) {
    product(id: $id) {
      id
      name
      description
      inStock
      category_id
      brand
      gallery {
        product_id
        image_url
      }
      price {
        product_id
        amount
      }
      attributes {
        id
        name
        type
        attribute_items {
          id
          displayValue
          value
        }
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;
