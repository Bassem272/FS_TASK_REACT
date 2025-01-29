import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($items: [OrderItemInput!]!, $userId: String!) {
    createOrder(items: $items, userId: $userId) {
      orderId
      orderTotal
      orderTime
    }
  }
`;
