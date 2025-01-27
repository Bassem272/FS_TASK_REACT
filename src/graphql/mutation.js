import { gql } from "@apollo/client";

// Define the GraphQL mutation for creating an order
export const CREATE_ORDER = gql`
  mutation CreateOrder($items: [OrderItemInput!]!, $userId: String!) {
    createOrder(items: $items, userId: $userId) {
      orderId
      orderTotal
      orderTime
      #   items {
      #     productId
      #     name
      #     price
      #     quantity
      #     selectedAttributes
      #     gallery
      #     categoryId
      #     inStock
      #   }
    }
  }
`;

