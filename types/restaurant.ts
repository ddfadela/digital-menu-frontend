export interface Restaurant {
  id: number;
  name: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  image?: string;
  isActive: boolean;
}
