import { Dish } from "./dish";

export interface Category {
  id: number;
  name: string;
  dishes: Dish[];
}
