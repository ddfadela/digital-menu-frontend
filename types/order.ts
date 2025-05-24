import { CartItem } from "./dish";
import { Restaurant } from "./restaurant";

export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  createdAt: string;
  status: OrderStatus;
  restaurantId: number;
  restaurant: Restaurant;
}

export interface OrderRequest {
  restaurantId: number;
  items: Array<{
    dishId: number;
    quantity: number;
    price: number;
  }>;
  total: number;
  phoneNumber: number;
}
