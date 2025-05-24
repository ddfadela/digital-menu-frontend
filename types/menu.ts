import { Category } from "./category";
import { Restaurant } from "./restaurant";

export interface MenuResponse {
  id: number;
  name: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  categories: Category[];
}
