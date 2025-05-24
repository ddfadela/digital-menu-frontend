export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface CartItem extends Dish {
  quantity: number;
  dish?: any;
}
